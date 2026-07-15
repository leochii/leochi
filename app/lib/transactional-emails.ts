import { render } from "@react-email/render";
import { createElement } from "react";
import { Resend } from "resend";
import { AdminNotification } from "@/components/emails/AdminNotification";
import { OrderConfirmation } from "@/components/emails/OrderConfirmation";
import { OrderSummaryItem } from "@/components/emails/OrderSummaryCard";
import { QuoteRequest } from "@/components/emails/QuoteRequest";
import { ShippingConfirmation } from "@/components/emails/ShippingConfirmation";

export const LEOCHI_SITE_URL = "https://leochi.co";
export const LEOCHI_SUPPORT_EMAIL = "support@leochi.co";

export const EMAIL_SUBJECTS = {
  orderConfirmation: "Your LEOCHI order has been confirmed",
  quoteRequest: "We received your custom printing request",
  shippingConfirmation: "Your LEOCHI order is on its way",
  adminNotification: "New order received on LEOCHI",
} as const;

export type EmailProduct = {
  name?: string;
  size?: string;
  quantity?: number;
  price?: number;
  image?: string;
};

type OrderEmailPayload = {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  orderDate: string;
  currentStatus: string;
  paymentStatus: string;
  shippingMethod: string;
  estimatedDeliveryDate: string;
  shippingCarrier?: string;
  trackingNumber?: string;
  shippingAddress: string;
  products: EmailProduct[];
  orderTotalCad: number;
};

type ShippingEmailPayload = {
  customerEmail: string;
  customerName: string;
  orderNumber?: string;
  trackingNumber: string;
  carrier: string;
  currentStatus?: string;
  estimatedDeliveryDate: string;
  shippingAddress: string;
  products: EmailProduct[];
  orderTotalCad: number;
};

type QuoteRequestPayload = {
  customerEmail: string;
  customerName: string;
  requestNumber: string;
  dateSubmitted: string;
  quantity: number;
  garmentType: string;
  printingMethod: string;
  notes?: string;
  statusUrl: string;
};

function formatCurrency(amountCad: number) {
  return `CAD $${amountCad.toFixed(2)}`;
}

const DEFAULT_PRODUCT_IMAGES = [
  `${LEOCHI_SITE_URL}/Chem-Trail.PNG`,
  `${LEOCHI_SITE_URL}/Farsh.PNG`,
  `${LEOCHI_SITE_URL}/Leochi.PNG`,
] as const;

function toAbsoluteImageUrl(value: string | undefined, fallbackIndex: number) {
  const fallback = DEFAULT_PRODUCT_IMAGES[fallbackIndex % DEFAULT_PRODUCT_IMAGES.length];

  if (!value || value.trim().length === 0) {
    return fallback;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${LEOCHI_SITE_URL}${value}`;
  }

  return fallback;
}

function toSummaryItems(products: EmailProduct[]): OrderSummaryItem[] {
  return products.map((product, index) => {
    const quantity = Number.isFinite(product.quantity) ? Number(product.quantity) : 1;
    const unitPrice = Number.isFinite(product.price) ? Number(product.price) : 0;

    return {
      imageUrl: toAbsoluteImageUrl(product.image, index),
      name: product.name || "LEOCHI Item",
      size: product.size || "N/A",
      quantity,
      price: formatCurrency(unitPrice * quantity),
    };
  });
}

type EmailClient = {
  send: Resend["emails"]["send"];
};

export function getResendClient(apiKey: string): EmailClient {
  const resend = new Resend(apiKey);
  return {
    send: resend.emails.send.bind(resend.emails),
  };
}

function buildTrackingUrl(params: {
  orderNumber?: string;
  currentStatus?: string;
  estimatedDeliveryDate?: string;
  shippingCarrier?: string;
  trackingNumber?: string;
}) {
  const search = new URLSearchParams({
    orderNumber: params.orderNumber?.trim() || "Not available",
    currentStatus: params.currentStatus?.trim() || "Order Confirmed",
    estimatedDeliveryDate: params.estimatedDeliveryDate?.trim() || "Within 5-8 business days",
    shippingCarrier: params.shippingCarrier?.trim() || "Pending shipment",
    trackingNumber: params.trackingNumber?.trim() || "Pending shipment",
  });

  return `${LEOCHI_SITE_URL}/track-order?${search.toString()}`;
}

export async function sendOrderConfirmationEmail(client: EmailClient, payload: OrderEmailPayload) {
  const html = await render(
    createElement(OrderConfirmation, {
      customerName: payload.customerName,
      orderNumber: payload.orderNumber,
      orderDate: payload.orderDate,
      paymentStatus: payload.paymentStatus,
      shippingMethod: payload.shippingMethod,
      estimatedDeliveryDate: payload.estimatedDeliveryDate,
      shippingAddress: payload.shippingAddress,
      items: toSummaryItems(payload.products),
      total: formatCurrency(payload.orderTotalCad),
      trackingUrl: buildTrackingUrl({
        orderNumber: payload.orderNumber,
        currentStatus: payload.currentStatus,
        estimatedDeliveryDate: payload.estimatedDeliveryDate,
        shippingCarrier: payload.shippingCarrier,
        trackingNumber: payload.trackingNumber,
      }),
    })
  );

  const { error } = await client.send({
    from: "LEOCHI <orders@leochi.co>",
    to: payload.customerEmail,
    subject: EMAIL_SUBJECTS.orderConfirmation,
    html,
  });

  return error;
}

export async function sendShippingConfirmationEmail(client: EmailClient, payload: ShippingEmailPayload) {
  const html = await render(
    createElement(ShippingConfirmation, {
      customerName: payload.customerName,
      trackingNumber: payload.trackingNumber,
      carrier: payload.carrier,
      estimatedDeliveryDate: payload.estimatedDeliveryDate,
      shippingAddress: payload.shippingAddress,
      items: toSummaryItems(payload.products),
      total: formatCurrency(payload.orderTotalCad),
      trackingUrl: buildTrackingUrl({
        orderNumber: payload.orderNumber,
        currentStatus: payload.currentStatus || "Shipped",
        estimatedDeliveryDate: payload.estimatedDeliveryDate,
        shippingCarrier: payload.carrier,
        trackingNumber: payload.trackingNumber,
      }),
    })
  );

  const { error } = await client.send({
    from: "LEOCHI <orders@leochi.co>",
    to: payload.customerEmail,
    subject: EMAIL_SUBJECTS.shippingConfirmation,
    html,
  });

  return error;
}

export async function sendQuoteRequestEmail(client: EmailClient, payload: QuoteRequestPayload) {
  const html = await render(
    createElement(QuoteRequest, {
      customerName: payload.customerName,
      requestNumber: payload.requestNumber,
      dateSubmitted: payload.dateSubmitted,
      quantity: payload.quantity,
      garmentType: payload.garmentType,
      printingMethod: payload.printingMethod,
      notes: payload.notes,
      statusUrl: payload.statusUrl,
    })
  );

  const { error } = await client.send({
    from: "LEOCHI <orders@leochi.co>",
    to: payload.customerEmail,
    replyTo: LEOCHI_SUPPORT_EMAIL,
    subject: EMAIL_SUBJECTS.quoteRequest,
    html,
  });

  return error;
}

type AdminNotificationPayload = {
  heading: string;
  summary: string;
  fields: Array<{ label: string; value: string }>;
  actionUrl: string;
  actionLabel?: string;
};

export async function sendAdminNotificationEmail(client: EmailClient, payload: AdminNotificationPayload) {
  const html = await render(
    createElement(AdminNotification, {
      heading: payload.heading,
      summary: payload.summary,
      fields: payload.fields,
      actionLabel: payload.actionLabel || "OPEN ADMIN PANEL",
      actionUrl: payload.actionUrl,
    })
  );

  const { error } = await client.send({
    from: "LEOCHI <orders@leochi.co>",
    to: LEOCHI_SUPPORT_EMAIL,
    subject: EMAIL_SUBJECTS.adminNotification,
    html,
  });

  return error;
}

export function formatAddress(parts: Array<string | null | undefined>) {
  return parts
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter((part) => part.length > 0)
    .join("\n");
}
