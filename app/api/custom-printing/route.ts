import { Buffer } from "node:buffer";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildCustomPrintingEmailHtml,
  CUSTOM_PRINTING_EMAIL_DESTINATION,
  CUSTOM_PRINTING_STORAGE_BUCKET,
  sanitizeFilename,
} from "../../lib/custom-printing";
import { getSupabaseServerConfig } from "../../lib/server-env";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_SIZE = 15 * 1024 * 1024;

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const company = formData.get("company");
    const quantity = formData.get("quantity");
    const garmentType = formData.get("garmentType");
    const notes = formData.get("notes");
    const design = formData.get("design");

    if (typeof name !== "string" || name.trim().length < 2) {
      return jsonError("Enter a valid name.");
    }

    if (typeof email !== "string" || !EMAIL_PATTERN.test(email.trim())) {
      return jsonError("Enter a valid email address.");
    }

    if (typeof quantity !== "string") {
      return jsonError("Enter a valid quantity.");
    }

    const parsedQuantity = Number.parseInt(quantity, 10);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 1) {
      return jsonError("Enter a valid quantity.");
    }

    if (typeof garmentType !== "string" || garmentType.trim().length === 0) {
      return jsonError("Choose a garment type.");
    }

    if (!(design instanceof File) || design.size === 0) {
      return jsonError("Upload a design file.");
    }

    if (design.size > MAX_FILE_SIZE) {
      return jsonError("Design files must be smaller than 15MB.");
    }

    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    if (!resendApiKey) {
      return jsonError("RESEND_API_KEY is required.", 500);
    }

    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const objectPath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${sanitizeFilename(design.name)}`;
    const designBuffer = Buffer.from(await design.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(CUSTOM_PRINTING_STORAGE_BUCKET)
      .upload(objectPath, designBuffer, {
        contentType: design.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("[CUSTOM_PRINTING] Upload error:", uploadError);
      return jsonError("Failed to upload the design file.", 500);
    }

    const { data: publicFile } = supabase.storage
      .from(CUSTOM_PRINTING_STORAGE_BUCKET)
      .getPublicUrl(objectPath);

    const fileUrl = publicFile.publicUrl;
    const trimmedCompany = typeof company === "string" && company.trim() ? company.trim() : null;
    const trimmedNotes = typeof notes === "string" && notes.trim() ? notes.trim() : null;

    const { data: insertedRequest, error: insertError } = await supabase
      .from("custom_printing_requests")
      .insert({
        name: name.trim(),
        email: email.trim(),
        company: trimmedCompany,
        quantity: parsedQuantity,
        garment_type: garmentType.trim(),
        notes: trimmedNotes,
        file_url: fileUrl,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("[CUSTOM_PRINTING] Insert error:", insertError);
      await supabase.storage.from(CUSTOM_PRINTING_STORAGE_BUCKET).remove([objectPath]);
      return jsonError("Failed to save the request.", 500);
    }

    const resend = new Resend(resendApiKey);
    const { error: emailError } = await resend.emails.send({
      from: "LEOCHI <orders@leochi.co>",
      to: CUSTOM_PRINTING_EMAIL_DESTINATION,
      replyTo: email.trim(),
      subject: `Custom Printing Inquiry - ${name.trim()}`,
      html: buildCustomPrintingEmailHtml({
        requestId: insertedRequest.id,
        name: name.trim(),
        email: email.trim(),
        company: trimmedCompany ?? undefined,
        quantity: parsedQuantity,
        garmentType: garmentType.trim(),
        notes: trimmedNotes ?? undefined,
        fileUrl,
      }),
    });

    if (emailError) {
      console.error("[CUSTOM_PRINTING] Resend error:", emailError);
    }

    return NextResponse.json({
      success: true,
      requestId: insertedRequest.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process custom printing inquiry.";
    console.error("[CUSTOM_PRINTING] Fatal error:", message);
    return jsonError(message, 500);
  }
}