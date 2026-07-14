import { CUSTOM_PRINTING_STATUS_FLOW, type CustomPrintingStatus } from "./custom-printing";

type StatusEmailTemplate = {
  subject: string;
  body: string;
};

const STATUS_EMAIL_TEMPLATES: Partial<Record<CustomPrintingStatus, StatusEmailTemplate>> = {
  "Quote Sent": {
    subject: "Your LEOCHI Quote Is Ready",
    body: "Your custom printing quote is now ready for review.",
  },
  Approved: {
    subject: "Order Approved",
    body: "Your custom printing order has been approved and will move into production soon.",
  },
  "In Production": {
    subject: "Your Order Is In Production",
    body: "Your custom printing order is now being produced.",
  },
  Completed: {
    subject: "Order Completed",
    body: "Your custom printing order has been completed and is ready.",
  },
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

export function getCustomPrintingStatusEmail(status: CustomPrintingStatus, customerName: string) {
  const template = STATUS_EMAIL_TEMPLATES[status];

  if (!template) {
    return null;
  }

  const safeName = escapeHtml(customerName.trim() || "there");
  const safeBody = escapeHtml(template.body);

  return {
    subject: template.subject,
    text: template.body,
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
                      <div style="font-size:28px; letter-spacing:6px; font-weight:700; color:#ffffff;">LEOCHI</div>
                      <div style="margin-top:8px; color:#9ca3af; letter-spacing:2px; font-size:11px; text-transform:uppercase;">Custom Printing Status Update</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px;">
                      <p style="margin:0 0 16px; color:#d4d4d8; font-size:14px; line-height:1.6;">Hi ${safeName},</p>
                      <p style="margin:0; color:#ffffff; font-size:15px; line-height:1.7;">${safeBody}</p>
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
