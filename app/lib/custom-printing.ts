export const CUSTOM_PRINTING_STORAGE_BUCKET = "custom-printing-designs";

export const CUSTOM_PRINTING_EMAIL_DESTINATION = "orders@leochi.co";

export const GARMENT_OPTIONS = [
  "T-Shirts",
  "Hoodies",
  "Crewnecks",
  "Tote Bags",
  "Workwear",
  "Event Merchandise",
  "Small Business Merchandise",
] as const;

type CustomPrintingEmailPayload = {
  requestId: string;
  name: string;
  email: string;
  company?: string;
  quantity: number;
  garmentType: string;
  notes?: string;
  fileUrl: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function sanitizeFilename(filename: string) {
  return filename
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120) || "design-file";
}

export function buildCustomPrintingEmailHtml(payload: CustomPrintingEmailPayload) {
  const name = escapeHtml(payload.name);
  const email = escapeHtml(payload.email);
  const company = payload.company ? escapeHtml(payload.company) : "Not provided";
  const garmentType = escapeHtml(payload.garmentType);
  const notes = payload.notes ? escapeHtml(payload.notes).replaceAll("\n", "<br />") : "No additional notes.";
  const fileUrl = escapeHtml(payload.fileUrl);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LEOCHI Custom Printing Inquiry</title>
      </head>
      <body style="margin:0; padding:0; background:#050505; color:#ffffff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; background:#0b0b0b; border:1px solid #1f1f1f;">
                <tr>
                  <td style="padding:40px 28px 28px; text-align:center; border-bottom:1px solid #1f1f1f;">
                    <div style="font-size:34px; letter-spacing:8px; font-weight:700; color:#ffffff;">LEOCHI</div>
                    <div style="margin-top:8px; color:#9ca3af; letter-spacing:2px; font-size:11px; text-transform:uppercase;">Custom Printing Inquiry</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;">
                    <h1 style="margin:0 0 12px; font-size:28px; letter-spacing:1px;">New Quote Request</h1>
                    <p style="margin:0 0 24px; color:#d4d4d8; line-height:1.65;">
                      A new custom printing inquiry has been submitted through the LEOCHI website.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111; border:1px solid #262626; margin-bottom:24px;">
                      <tr>
                        <td style="padding:16px 18px; color:#a3a3a3; font-size:13px;">Request ID</td>
                        <td style="padding:16px 18px; color:#ffffff; font-size:13px; text-align:right;">${payload.requestId}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 18px; color:#a3a3a3; font-size:13px; border-top:1px solid #262626;">Name</td>
                        <td style="padding:16px 18px; color:#ffffff; font-size:13px; text-align:right; border-top:1px solid #262626;">${name}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 18px; color:#a3a3a3; font-size:13px; border-top:1px solid #262626;">Email</td>
                        <td style="padding:16px 18px; color:#ffffff; font-size:13px; text-align:right; border-top:1px solid #262626;">${email}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 18px; color:#a3a3a3; font-size:13px; border-top:1px solid #262626;">Company</td>
                        <td style="padding:16px 18px; color:#ffffff; font-size:13px; text-align:right; border-top:1px solid #262626;">${company}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 18px; color:#a3a3a3; font-size:13px; border-top:1px solid #262626;">Garment</td>
                        <td style="padding:16px 18px; color:#ffffff; font-size:13px; text-align:right; border-top:1px solid #262626;">${garmentType}</td>
                      </tr>
                      <tr>
                        <td style="padding:16px 18px; color:#a3a3a3; font-size:13px; border-top:1px solid #262626;">Quantity</td>
                        <td style="padding:16px 18px; color:#ffffff; font-size:13px; text-align:right; border-top:1px solid #262626;">${payload.quantity}</td>
                      </tr>
                    </table>

                    <div style="margin-bottom:24px; padding:18px; border:1px solid #262626; background:#111111;">
                      <div style="margin-bottom:10px; color:#a3a3a3; text-transform:uppercase; letter-spacing:1px; font-size:12px;">Additional Notes</div>
                      <div style="color:#ffffff; line-height:1.7; font-size:14px;">${notes}</div>
                    </div>

                    <div style="text-align:center;">
                      <a href="${fileUrl}" style="display:inline-block; padding:12px 24px; background:#ffffff; color:#000000; text-decoration:none; letter-spacing:1px; text-transform:uppercase; font-size:12px; font-weight:700;">Open Uploaded Design</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}