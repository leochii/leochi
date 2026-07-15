import { Column, Link, Row, Section, Text } from "@react-email/components";
import { emailTheme } from "./theme";

const supportLinks = [
  {
    icon: "WA",
    label: "WhatsApp",
    href: "https://wa.me/15877772748",
    note: "Chat with our studio team",
  },
  {
    icon: "ME",
    label: "Messenger",
    href: "https://m.me/nima.didar.5",
    note: "Real-time support replies",
  },
  {
    icon: "FB",
    label: "Facebook",
    href: "https://facebook.com/",
    note: "Announcements and updates",
  },
  {
    icon: "@",
    label: "Email Support",
    href: "mailto:support@leochi.co",
    note: "support@leochi.co",
  },
] as const;

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/",
  },
  {
    label: "Messenger",
    href: "https://m.me/nima.didar.5",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/15877772748",
  },
] as const;

export function EmailFooter() {
  return (
    <Section style={footerShell}>
      <Text style={helpTitle}>NEED HELP?</Text>
      <Text style={helpSubtitle}>We are here to help.</Text>

      {supportLinks.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          style={supportCardLinkWrap}
          className="support-card-link"
        >
          <Section style={supportCard} className="support-card">
            <Text style={supportIcon}>{item.icon}</Text>
            <Text style={supportCardTitle}>{item.label}</Text>
            <Text style={supportCardText}>{item.note}</Text>
          </Section>
        </Link>
      ))}

      <Text style={socialTitle}>FOLLOW US</Text>
      <Row style={socialRow}>
        {socialLinks.map((item) => (
          <Column key={item.label} style={socialCol}>
            <Link href={item.href} style={socialLink}>
              {item.label}
            </Link>
          </Column>
        ))}
      </Row>

      <Text style={supportEmail}>support@leochi.co</Text>

      <Section style={legalBlock}>
        <Text style={copyright}>© 2026 LEOCHI. All rights reserved.</Text>
        <Text style={legalLinks}>
          <Link href="https://leochi.co/privacy" style={legalLinkItem}>
            Privacy Policy
          </Link>
          <span> · </span>
          <Link href="https://leochi.co/shipping-returns" style={legalLinkItem}>
            Shipping & Returns
          </Link>
          <span> · </span>
          <Link href="https://leochi.co/contact" style={legalLinkItem}>
            Contact Us
          </Link>
        </Text>
      </Section>
    </Section>
  );
}

const footerShell = {
  padding: "28px 28px 36px",
  borderTop: `1px solid ${emailTheme.softBorder}`,
};

const helpTitle = {
  margin: "0",
  color: emailTheme.text,
  fontFamily: emailTheme.serif,
  fontSize: "19px",
  letterSpacing: "1.6px",
  textTransform: "uppercase" as const,
};

const helpSubtitle = {
  margin: "9px 0 24px",
  color: "#5A5043",
  fontSize: "14px",
  lineHeight: "1.65",
};

const supportCardLinkWrap = {
  textDecoration: "none",
  display: "block",
};

const supportCard = {
  border: `1px solid ${emailTheme.softBorder}`,
  marginBottom: "12px",
  padding: "14px 16px",
  backgroundColor: emailTheme.panelMuted,
};

const supportIcon = {
  margin: "0 0 8px",
  display: "inline-block",
  width: "26px",
  height: "26px",
  lineHeight: "26px",
  textAlign: "center" as const,
  border: `1px solid ${emailTheme.softBorder}`,
  color: "#4D4437",
  fontSize: "11px",
  letterSpacing: "0.5px",
  backgroundColor: "#FCF8F1",
};

const supportCardTitle = {
  margin: "0 0 4px",
  color: emailTheme.text,
  fontSize: "13px",
  fontWeight: "600",
  letterSpacing: "0.4px",
};

const supportCardText = {
  margin: "0",
  color: "#6E5F4B",
  fontSize: "12px",
  lineHeight: "1.5",
};

const socialTitle = {
  margin: "20px 0 11px",
  color: emailTheme.text,
  fontSize: "11px",
  letterSpacing: "2.2px",
  textTransform: "uppercase" as const,
};

const socialRow = {
  marginBottom: "6px",
};

const socialCol = {
  paddingRight: "8px",
};

const socialLink = {
  display: "inline-block",
  border: "1px solid #C7B499",
  backgroundColor: "#EDE1CF",
  color: "#2C261F",
  fontSize: "12px",
  textDecoration: "none",
  padding: "9px 12px",
  letterSpacing: "0.5px",
};

const supportEmail = {
  margin: "16px 0 0",
  color: emailTheme.accent,
  fontSize: "12px",
  letterSpacing: "0.6px",
};

const legalBlock = {
  marginTop: "24px",
  borderTop: `1px solid ${emailTheme.softBorder}`,
  paddingTop: "16px",
};

const copyright = {
  margin: "0",
  color: "#6A604F",
  fontSize: "11px",
};

const legalLinks = {
  margin: "7px 0 0",
  color: "#6A604F",
  fontSize: "11px",
};

const legalLinkItem = {
  color: "#6A604F",
  textDecoration: "none",
};
