import { Buffer } from "node:buffer";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  buildCustomPrintingEmailHtml,
  CUSTOM_PRINTING_EMAIL_DESTINATION,
  CUSTOM_PRINTING_STATUS_FLOW,
  CUSTOM_PRINTING_STORAGE_BUCKET,
  formatQuoteNumber,
  sanitizeFilename,
} from "../../lib/custom-printing";
import { getSupabaseServerConfig } from "../../lib/server-env";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [".png", ".pdf", ".ai", ".psd", ".svg", ".eps", ".jpg", ".jpeg"];

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const company = formData.get("company");
    const instagramOrWebsite = formData.get("instagramOrWebsite");
    const quantity = formData.get("quantity");
    const garmentType = formData.get("garmentType");
    const desiredDeliveryDate = formData.get("desiredDeliveryDate");
    const printDetails = formData.getAll("printDetails");
    const notes = formData.get("notes");
    const designFiles = formData.getAll("designs");

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

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 5) {
      return jsonError("Minimum Order: 5 Pieces+");
    }

    if (typeof garmentType !== "string" || garmentType.trim().length === 0) {
      return jsonError("Choose a garment type.");
    }

    const normalizedDesiredDeliveryDate = typeof desiredDeliveryDate === "string" && desiredDeliveryDate.trim().length > 0 ? desiredDeliveryDate.trim() : undefined;
    const normalizedPrintDetails = printDetails.filter((item): item is string => typeof item === "string" && item.trim().length > 0);

    const normalizedFiles = designFiles.filter((item): item is File => item instanceof File && item.size > 0);

    if (normalizedFiles.length === 0) {
      return jsonError("Upload at least one design file.");
    }

    const oversizedFile = normalizedFiles.find((file) => file.size > MAX_FILE_SIZE);

    if (oversizedFile) {
      return jsonError("Design files must be smaller than 15MB.");
    }

    const invalidFile = normalizedFiles.find((file) => {
      const lowerName = file.name.toLowerCase();
      return !ACCEPTED_FILE_TYPES.some((extension) => lowerName.endsWith(extension));
    });

    if (invalidFile) {
      return jsonError("Accepted files are PNG, PDF, AI, PSD, SVG, EPS, and JPG.");
    }

    const resendApiKey = process.env.RESEND_API_KEY?.trim();

    if (!resendApiKey) {
      return jsonError("RESEND_API_KEY is required.", 500);
    }

    const { url, serviceRoleKey } = getSupabaseServerConfig();
    const supabase = createClient(url, serviceRoleKey);

    const uploadedObjectPaths: string[] = [];
    const uploadedFileUrls: string[] = [];

    for (const design of normalizedFiles) {
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
        if (uploadedObjectPaths.length > 0) {
          await supabase.storage.from(CUSTOM_PRINTING_STORAGE_BUCKET).remove(uploadedObjectPaths);
        }
        return jsonError("Failed to upload the design file.", 500);
      }

      uploadedObjectPaths.push(objectPath);

      const { data: publicFile } = supabase.storage
        .from(CUSTOM_PRINTING_STORAGE_BUCKET)
        .getPublicUrl(objectPath);

      uploadedFileUrls.push(publicFile.publicUrl);
    }

    const trimmedCompany = typeof company === "string" && company.trim() ? company.trim() : null;
    const trimmedInstagramOrWebsite = typeof instagramOrWebsite === "string" && instagramOrWebsite.trim() ? instagramOrWebsite.trim() : null;
    const trimmedNotes = typeof notes === "string" && notes.trim() ? notes.trim() : null;
    const initialStatus = CUSTOM_PRINTING_STATUS_FLOW[0];

    const { data: insertedRequest, error: insertError } = await supabase
      .from("custom_printing_requests")
      .insert({
        name: name.trim(),
        email: email.trim(),
        company: trimmedCompany,
        instagram_or_website: trimmedInstagramOrWebsite,
        quantity: parsedQuantity,
        garment_type: garmentType.trim(),
        desired_delivery_date: normalizedDesiredDeliveryDate,
        print_details: normalizedPrintDetails,
        notes: trimmedNotes,
        file_url: uploadedFileUrls[0],
        file_urls: uploadedFileUrls,
        status: initialStatus,
      })
      .select("id, quote_sequence, status")
      .single();

    if (insertError) {
      console.error("[CUSTOM_PRINTING] Insert error:", insertError);
      await supabase.storage.from(CUSTOM_PRINTING_STORAGE_BUCKET).remove(uploadedObjectPaths);
      return jsonError("Failed to save the request.", 500);
    }

    const quoteNumber = formatQuoteNumber(insertedRequest.quote_sequence);

    const resend = new Resend(resendApiKey);
    const { error: emailError } = await resend.emails.send({
      from: "LEOCHI <orders@leochi.co>",
      to: CUSTOM_PRINTING_EMAIL_DESTINATION,
      replyTo: email.trim(),
      subject: `${quoteNumber} - Custom Printing Inquiry`,
      html: buildCustomPrintingEmailHtml({
        requestId: insertedRequest.id,
        quoteNumber,
        status: insertedRequest.status,
        name: name.trim(),
        email: email.trim(),
        company: trimmedCompany ?? undefined,
        instagramOrWebsite: trimmedInstagramOrWebsite ?? undefined,
        quantity: parsedQuantity,
        garmentType: garmentType.trim(),
        desiredDeliveryDate: normalizedDesiredDeliveryDate,
        printDetails: normalizedPrintDetails,
        notes: trimmedNotes ?? undefined,
        fileUrls: uploadedFileUrls,
      }),
    });

    if (emailError) {
      console.error("[CUSTOM_PRINTING] Resend error:", emailError);
    }

    return NextResponse.json({
      success: true,
      requestId: insertedRequest.id,
      quoteNumber,
      status: insertedRequest.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process custom printing inquiry.";
    console.error("[CUSTOM_PRINTING] Fatal error:", message);
    return jsonError(message, 500);
  }
}