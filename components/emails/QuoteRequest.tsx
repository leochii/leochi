import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";
import { ProgressTracker } from "./ProgressTracker";
import { emailTheme } from "./theme";

type QuoteRequestProps = {
  customerName?: string;
  requestNumber?: string;
  dateSubmitted?: string;
  quantity?: number | string;
  garmentType?: string;
  printingMethod?: string;
  notes?: string;
  statusUrl?: string;
};

export function QuoteRequest({
  customerName = "Nima",
  requestNumber = "LEO-48291",
  dateSubmitted = "July 15, 2026",
  quantity = 60,
  garmentType = "LEOCHI Signature Tee",
  printingMethod = "Screen Printing",
  notes = "Centered chest print with single-color back artwork.",
  statusUrl = "https://leochi.co/custom-printing/success",
}: QuoteRequestProps) {
  return (
    <EmailLayout
      title="Your quote request has been received."
      preview="LEOCHI Studio has received your custom printing request"
    >
      <Text style={greeting}>Hello {customerName},</Text>
      <Text style={copy}>Thank you for contacting LEOCHI Studio.</Text>
      <Text style={copy}>
        We have successfully received your custom printing request and our team
        will review it shortly.
      </Text>

      <Section style={metaCard}>
        <Text style={metaItem}>Request Number: {requestNumber}</Text>
        <Text style={metaItem}>Date Submitted: {dateSubmitted}</Text>
        <Text style={metaItem}>Quantity: {quantity}</Text>
        <Text style={metaItem}>Garment Type: {garmentType}</Text>
        <Text style={metaItem}>Printing Method: {printingMethod}</Text>
        <Text style={metaItem}>Notes: {notes}</Text>
      </Section>

      <ProgressTracker
        title="Request Progress"
        steps={[
          { label: "QUOTE REQUESTED", state: "complete" },
          { label: "UNDER REVIEW", state: "current" },
          { label: "DESIGN APPROVAL", state: "upcoming" },
          { label: "PRODUCTION", state: "upcoming" },
          { label: "COMPLETE", state: "upcoming" },
        ]}
      />

      <Section style={buttonWrap}>
        <Button href={statusUrl} style={ctaButton}>
          VIEW REQUEST STATUS
        </Button>
      </Section>
    </EmailLayout>
  );
}

export default QuoteRequest;

const greeting = {
  margin: "0 0 10px",
  color: emailTheme.text,
  fontSize: "21px",
  fontFamily: emailTheme.serif,
  letterSpacing: "0.2px",
};

const copy = {
  margin: "0 0 12px",
  color: "#544C40",
  fontSize: "14px",
  lineHeight: "1.7",
};

const metaCard = {
  border: `1px solid ${emailTheme.softBorder}`,
  backgroundColor: emailTheme.panelMuted,
  padding: "18px 18px 14px",
  marginTop: "10px",
};

const metaItem = {
  margin: "0 0 8px",
  color: emailTheme.text,
  fontSize: "13px",
  lineHeight: "1.45",
};

const buttonWrap = {
  margin: "12px 0 16px",
  textAlign: "center" as const,
};

const ctaButton = {
  backgroundColor: "#1B1B1B",
  color: "#F5F0E5",
  borderRadius: "0px",
  padding: "14px 32px",
  fontSize: "12px",
  letterSpacing: "2px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};
