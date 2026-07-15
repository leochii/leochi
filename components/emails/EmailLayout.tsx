import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { ReactNode } from "react";
import { EmailFooter } from "./EmailFooter";
import { emailTheme } from "./theme";

type EmailLayoutProps = {
  preview: string;
  title: string;
  children: ReactNode;
  includeFooter?: boolean;
};

export function EmailLayout({
  preview,
  title,
  children,
  includeFooter = true,
}: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head>
        <title>{title}</title>
        <style>
          {`.support-card:hover{background:#f3ebde !important;border-color:#c9b79d !important;}
            .support-card-link:hover{color:#1b1b1b !important;}`}
        </style>
      </Head>
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={shell}>
          <Section style={header}>
            <Text style={brand}>LEOCHI</Text>
            <Text style={tagline}>DESIGNED IN CANADA</Text>
          </Section>

          <Hr style={headerRule} />

          <Section style={content}>{children}</Section>

          {includeFooter ? <EmailFooter /> : null}
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  margin: "0",
  padding: "30px 10px",
  backgroundColor: emailTheme.background,
  color: emailTheme.text,
  fontFamily: emailTheme.sans,
};

const shell = {
  width: "100%",
  maxWidth: "696px",
  margin: "0 auto",
  border: `1px solid ${emailTheme.softBorder}`,
  backgroundColor: emailTheme.panel,
};

const header = {
  padding: "50px 34px 46px",
  textAlign: "center" as const,
};

const headerRule = {
  margin: "0 24px",
  borderColor: emailTheme.softBorder,
};

const brand = {
  margin: "0",
  color: emailTheme.text,
  fontFamily: emailTheme.serif,
  fontSize: "42px",
  lineHeight: "1.05",
  letterSpacing: "5px",
  fontWeight: "500",
};

const tagline = {
  margin: "14px 0 0",
  color: emailTheme.accent,
  fontSize: "10px",
  letterSpacing: "3.3px",
  textTransform: "uppercase" as const,
};

const content = {
  padding: "38px 28px 20px",
};
