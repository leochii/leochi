import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./EmailLayout";
import { emailTheme } from "./theme";

type AdminNotificationField = {
  label: string;
  value: string;
};

type AdminNotificationProps = {
  heading?: string;
  summary?: string;
  fields?: AdminNotificationField[];
  actionLabel?: string;
  actionUrl?: string;
};

const defaultFields: AdminNotificationField[] = [
  { label: "Notification", value: "New transactional event received" },
  { label: "Source", value: "LEOCHI Website" },
  { label: "Date", value: "July 15, 2026" },
];

export function AdminNotification({
  heading = "LEOCHI Studio Notification",
  summary = "A new order-related event has been recorded and may require review.",
  fields = defaultFields,
  actionLabel = "OPEN ADMIN PANEL",
  actionUrl = "https://leochi.co/admin",
}: AdminNotificationProps) {
  return (
    <EmailLayout
      title="LEOCHI Admin Notification"
      preview="A new admin notification is ready"
      includeFooter={true}
    >
      <Text style={headingStyle}>{heading}</Text>
      <Text style={summaryStyle}>{summary}</Text>

      <Section style={fieldsCard}>
        {fields.map((field, index) => (
          <Text key={`${field.label}-${index}`} style={fieldLine}>
            <strong>{field.label}:</strong> {field.value}
          </Text>
        ))}
      </Section>

      <Section style={buttonWrap}>
        <Button href={actionUrl} style={ctaButton}>
          {actionLabel}
        </Button>
      </Section>
    </EmailLayout>
  );
}

export default AdminNotification;

const headingStyle = {
  margin: "0 0 10px",
  color: emailTheme.text,
  fontSize: "24px",
  fontFamily: emailTheme.serif,
  letterSpacing: "0.5px",
};

const summaryStyle = {
  margin: "0 0 18px",
  color: "#544C40",
  fontSize: "14px",
  lineHeight: "1.7",
};

const fieldsCard = {
  border: `1px solid ${emailTheme.softBorder}`,
  backgroundColor: emailTheme.panelMuted,
  padding: "18px 18px 14px",
};

const fieldLine = {
  margin: "0 0 9px",
  color: emailTheme.text,
  fontSize: "13px",
  lineHeight: "1.45",
};

const buttonWrap = {
  margin: "16px 0 18px",
  textAlign: "center" as const,
};

const ctaButton = {
  backgroundColor: "#1B1B1B",
  color: "#F5F0E5",
  borderRadius: "0px",
  padding: "14px 28px",
  fontSize: "12px",
  letterSpacing: "2.2px",
  textDecoration: "none",
  textTransform: "uppercase" as const,
};
