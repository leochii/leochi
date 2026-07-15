import { Button, Hr, Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";
import { OrderSummaryCard, OrderSummaryItem } from "./OrderSummaryCard";
import { ProgressTracker } from "./ProgressTracker";
import { emailTheme } from "./theme";

type OrderConfirmationProps = {
  customerName?: string;
  orderNumber?: string;
  orderDate?: string;
  paymentStatus?: string;
  shippingMethod?: string;
  estimatedDeliveryDate?: string;
  shippingAddress?: string;
  items?: OrderSummaryItem[];
  total?: string;
  trackingUrl?: string;
};

const defaultItems: OrderSummaryItem[] = [
  {
    imageUrl: "https://leochi.co/Chem-Trail.PNG",
    name: "Chem-Trail",
    size: "M",
    quantity: 1,
    price: "CAD $60.00",
  },
];

export function OrderConfirmation({
  customerName = "Nima",
  orderNumber = "LEO-48291",
  orderDate = "July 15, 2026",
  paymentStatus = "Paid",
  shippingMethod = "Express",
  estimatedDeliveryDate = "July 22, 2026",
  shippingAddress = "180 Bloor Street West\nToronto, ON M5S 2V6\nCanada",
  items = defaultItems,
  total = "CAD 60.00",
  trackingUrl = "https://leochi.co/track-order",
}: OrderConfirmationProps) {
  return (
    <EmailLayout
      title="LEOCHI Order Confirmation"
      preview={`Order ${orderNumber} confirmed`}
    >
      <Text style={greeting}>Hello {customerName},</Text>
      <Text style={copy}>Thank you for your order.</Text>
      <Text style={copyMuted}>We will notify you once your order has been shipped.</Text>

      <ProgressTracker
        title="Order Progress"
        steps={[
          { label: "ORDER CONFIRMED", state: "complete" },
          { label: "IN PRODUCTION", state: "upcoming" },
          { label: "SHIPPED", state: "upcoming" },
          { label: "DELIVERED", state: "upcoming" },
        ]}
      />

      <Section style={metaCard}>
        <Text style={metaItem}>Order Number: {orderNumber}</Text>
        <Text style={metaItem}>Order Date: {orderDate}</Text>
        <Text style={metaItem}>Payment Status: {paymentStatus}</Text>
        <Text style={metaItem}>Shipping Method: {shippingMethod}</Text>
        <Text style={metaItem}>Estimated Delivery Date: {estimatedDeliveryDate}</Text>
      </Section>

      <OrderSummaryCard items={items} total={total} />

      <Section style={buttonWrap}>
        <Button href={trackingUrl} style={ctaButton}>
          TRACK MY ORDER
        </Button>
      </Section>

      <Hr style={divider} />

      <Text style={addressLabel}>Shipping Address</Text>
      <Text style={addressValue}>{shippingAddress}</Text>
    </EmailLayout>
  );
}

export default OrderConfirmation;

const greeting = {
  margin: "0 0 10px",
  color: emailTheme.text,
  fontSize: "21px",
  fontFamily: emailTheme.serif,
  letterSpacing: "0.2px",
};

const copy = {
  margin: "0 0 8px",
  color: "#544C40",
  fontSize: "14px",
  lineHeight: "1.7",
};

const copyMuted = {
  margin: "0 0 14px",
  color: "#6A5B49",
  fontSize: "13px",
  lineHeight: "1.6",
};

const metaCard = {
  border: `1px solid ${emailTheme.softBorder}`,
  backgroundColor: emailTheme.panelMuted,
  padding: "18px 18px 14px",
};

const metaItem = {
  margin: "0 0 8px",
  color: emailTheme.text,
  fontSize: "13px",
  lineHeight: "1.45",
};

const buttonWrap = {
  margin: "10px 0 10px",
  textAlign: "center" as const,
};

const ctaButton = {
  backgroundColor: "#1B1B1B",
  color: "#F5F0E5",
  borderRadius: "0px",
  padding: "14px 34px",
  fontSize: "12px",
  letterSpacing: "2.2px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};

const divider = {
  borderColor: emailTheme.softBorder,
  margin: "24px 0 16px",
};

const addressLabel = {
  margin: "0 0 8px",
  color: emailTheme.text,
  fontSize: "11px",
  letterSpacing: "2.2px",
  textTransform: "uppercase" as const,
};

const addressValue = {
  margin: "0 0 22px",
  color: "#4C4338",
  fontSize: "13px",
  lineHeight: "1.7",
  whiteSpace: "pre-line" as const,
};
