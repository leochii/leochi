import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { getSiteUrl, getSupabaseServerConfig } from "../../../lib/server-env";
import { getCustomPrintingStatusEmail, isCustomPrintingStatus } from "../../../lib/custom-printing-status";
import { formatQuoteNumber } from "../../../lib/custom-printing";

export const runtime = "nodejs";

type StatusUpdateBody = {
  requestId?: string;
  status?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get("admin-auth")?.value !== "true") {
      return jsonError("Unauthorized.", 401);
    }

    const body = (await request.json()) as StatusUpdateBody;
    const requestId = body.requestId?.trim();
    const status = body.status?.trim();

    if (!requestId) {
      return jsonError("requestId is required.");
    }

    if (!status) {
      return jsonError("status is required.");
    }

    if (!isCustomPrintingStatus(status)) {
      return jsonError("Invalid status value.");
    }

    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const { data: updatedRequest, error: updateError } = await supabase
      .from("custom_printing_requests")
      .update({ status })
      .eq("id", requestId)
      .select("id, email, name, status, quote_sequence, quantity, garment_type, file_url, file_urls")
      .single();

    if (updateError) {
      console.error("[CUSTOM_PRINTING_STATUS] Supabase update error:", updateError);
      return jsonError("Failed to update request status.", 500);
    }

    const siteUrl = getSiteUrl(new URL(request.url).origin);
    const quoteNumber = formatQuoteNumber(updatedRequest.quote_sequence ?? 0);
    const statusUrl = `${siteUrl}/custom-printing/success?request=${encodeURIComponent(updatedRequest.id)}&quote=${encodeURIComponent(quoteNumber)}&status=${encodeURIComponent(updatedRequest.status)}`;
    const fileUrls = Array.isArray(updatedRequest.file_urls)
      ? updatedRequest.file_urls.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [];

    const normalizedFileUrls = fileUrls.length > 0
      ? fileUrls
      : typeof updatedRequest.file_url === "string" && updatedRequest.file_url.trim().length > 0
        ? [updatedRequest.file_url]
        : [];

    const emailContent = getCustomPrintingStatusEmail({
      status: updatedRequest.status,
      customerName: updatedRequest.name,
      quoteNumber,
      quantity: updatedRequest.quantity,
      garmentType: updatedRequest.garment_type,
      fileUrls: normalizedFileUrls,
      statusUrl,
    });

    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    if (!resendApiKey) {
      return jsonError("RESEND_API_KEY is required.", 500);
    }

    const resend = new Resend(resendApiKey);
    const { error: emailError } = await resend.emails.send({
      from: "LEOCHI <orders@leochi.co>",
      to: updatedRequest.email,
      replyTo: "support@leochi.co",
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (emailError) {
      console.error("[CUSTOM_PRINTING_STATUS] Resend error:", emailError);
      return jsonError("Status updated, but notification email failed to send.", 500);
    }

    return NextResponse.json({ success: true, status: updatedRequest.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    console.error("[CUSTOM_PRINTING_STATUS] API error:", message);
    return jsonError(message, 500);
  }
}
