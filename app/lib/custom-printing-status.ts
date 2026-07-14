import { CUSTOM_PRINTING_STATUS_FLOW, type CustomPrintingStatus } from "./custom-printing";

type StatusEmailTemplate = {
  subject: string;
  heading: string;
  body: string;
};

const STATUS_EMAIL_TEMPLATES: Record<CustomPrintingStatus, StatusEmailTemplate> = {
  "Quote Requested": {
    subject: "Your LEOCHI Request Has Been Received",
    heading: "Quote Requested",
    body: "We received your custom printing request and our team is now reviewing your project details.",
  },
  "Quote Sent": {
    subject: "Your LEOCHI Quote Is Ready",
    heading: "Quote Sent",
    body: "Your custom printing quote is now ready for review.",
  },
  Approved: {
    subject: "Order Approved",
    heading: "Approved",
    body: "Your custom printing order has been approved and will move into production soon.",
  },
  "In Production": {
    subject: "Your Order Is In Production",
    heading: "In Production",
    body: "Your custom printing order is now being produced.",
  },
  Completed: {
    subject: "Order Completed",
    heading: "Completed",
    body: "Your custom printing order has been completed and is ready.",
  },
};

type CustomPrintingStatusEmailPayload = {
  status: CustomPrintingStatus;
  customerName: string;
  quoteNumber: string;
  quantity: number;
  garmentType: string;
  fileUrls: string[];
  statusUrl: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function isCustomPrintingStatus(value: string): value is CustomPrintingStatus {
  return (CUSTOM_PRINTING_STATUS_FLOW as readonly string[]).includes(value);
}

function renderFileLinks(fileUrls: string[]) {
  if (fileUrls.length === 0) {
    return "<p style=\"margin:8px 0 0; color:#a1a1aa; font-size:13px;\">No files attached.</p>";
  }

  return fileUrls
    .map((url, index) => {
      const safeUrl = escapeHtml(url);
      return `<a href=\"${safeUrl}\" style=\"display:block; margin-top:8px; color:#ffffff; text-decoration:none; border-bottom:1px solid #404040; padding-bottom:3px; font-size:13px;\">Uploaded File ${index + 1}</a>`;
    })
    .join("");
}

export function getCustomPrintingStatusEmail(payload: CustomPrintingStatusEmailPayload) {
  const template = STATUS_EMAIL_TEMPLATES[payload.status];
  const safeName = escapeHtml(payload.customerName.trim() || "there");
  const safeBody = escapeHtml(template.body);
  const safeHeading = escapeHtml(template.heading);
  const safeQuoteNumber = escapeHtml(payload.quoteNumber);
  const safeGarmentType = escapeHtml(payload.garmentType);
  const safeStatusUrl = escapeHtml(payload.statusUrl);
  const fileLinks = renderFileLinks(payload.fileUrls);

  return {
    subject: template.subject,
    text: `${template.body}\n\nQuote Number: ${payload.quoteNumber}\nQuantity: ${payload.quantity}\nGarment Type: ${payload.garmentType}\n\nView Request Status: ${payload.statusUrl}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${escapeHtml(template.subject)}</title>
        </head>
        <body style="margin:0; padding:0; background:#050505; color:#ffffff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;">
            <tr>
              <td align="center" style="padding:32px 16px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; border:1px solid #1f1f1f; background:#0b0b0b;">
                  <tr>
                    <td style="padding:32px 28px; border-bottom:1px solid #1f1f1f; text-align:center;">
                      <div style="font-size:30px; letter-spacing:8px; font-weight:700; color:#ffffff;">LEOCHI</div>
                      <div style="margin-top:8px; color:#9ca3af; letter-spacing:2px; font-size:11px; text-transform:uppercase;">Custom Printing Status Update</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px;">
                      <p style="margin:0 0 16px; color:#d4d4d8; font-size:14px; line-height:1.6;">Hi ${safeName},</p>

                      <div style="margin:0 0 18px; padding:12px 14px; border:1px solid #2a2a2a; background:#111111; color:#f5e7d0; font-size:12px; letter-spacing:1.3px; text-transform:uppercase;">
                        ${safeHeading}
                      </div>

                      <p style="margin:0; color:#ffffff; font-size:15px; line-height:1.7;">${safeBody}</p>

                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px; border:1px solid #262626; background:#111111;">
                        <tr>
                          <td style="padding:12px 14px; color:#a3a3a3; font-size:12px; border-bottom:1px solid #262626;">Quote Number</td>
                          <td style="padding:12px 14px; color:#ffffff; font-size:12px; text-align:right; border-bottom:1px solid #262626;">${safeQuoteNumber}</td>
                        </tr>
                        <tr>
                          <td style="padding:12px 14px; color:#a3a3a3; font-size:12px; border-bottom:1px solid #262626;">Quantity</td>
                          <td style="padding:12px 14px; color:#ffffff; font-size:12px; text-align:right; border-bottom:1px solid #262626;">${payload.quantity}</td>
                        </tr>
                        <tr>
                          <td style="padding:12px 14px; color:#a3a3a3; font-size:12px;">Garment Type</td>
                          <td style="padding:12px 14px; color:#ffffff; font-size:12px; text-align:right;">${safeGarmentType}</td>
                        </tr>
                      </table>

                      <div style="margin-top:22px; padding:16px; border:1px solid #262626; background:#111111;">
                        <div style="margin-bottom:6px; color:#a3a3a3; text-transform:uppercase; letter-spacing:1px; font-size:11px;">Uploaded Files</div>
                        ${fileLinks}
                      </div>

                      <div style="margin-top:24px; text-align:center;">
                        <a href="${safeStatusUrl}" style="display:inline-block; padding:12px 22px; border-radius:999px; background:#f3e5cf; color:#050505; text-decoration:none; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; font-weight:700;">
                          View Request Status
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };
}
