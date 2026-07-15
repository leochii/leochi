import { Section, Text } from "@react-email/components";
import { emailTheme } from "./theme";

export type OrderSummaryItem = {
  imageUrl?: string;
  name: string;
  size: string;
  quantity: number;
  price: string;
};

type OrderSummaryCardProps = {
  items: OrderSummaryItem[];
  total: string;
  title?: string;
};

export function OrderSummaryCard({
  items,
  total,
  title = "ORDER SUMMARY",
}: OrderSummaryCardProps) {
  return (
    <Section style={card}>
      <Text style={heading}>{title}</Text>

      {items.map((item, index) => (
        <Section key={`${item.name}-${index}`} style={itemRow}>
          <Section style={imageShell(item.imageUrl)}>
            <Text style={placeholderText}>LEOCHI</Text>
          </Section>

          <Section style={itemDetails}>
            <Text style={itemName}>{item.name}</Text>
            <Text style={itemMeta}>Size: {item.size}</Text>
            <Text style={itemMeta}>Quantity: {item.quantity}</Text>
            <Text style={itemPrice}>{item.price}</Text>
          </Section>
        </Section>
      ))}

      <Section style={totalRow}>
        <Text style={totalLabel}>Total</Text>
        <Text style={totalValue}>{total}</Text>
      </Section>
    </Section>
  );
}

const card = {
  border: `1px solid ${emailTheme.softBorder}`,
  backgroundColor: emailTheme.panelMuted,
  padding: "18px",
  margin: "22px 0 24px",
};

const heading = {
  margin: "0 0 16px",
  color: emailTheme.text,
  fontSize: "11px",
  letterSpacing: "2.4px",
  textTransform: "uppercase" as const,
};

const itemRow = {
  borderTop: `1px solid ${emailTheme.softBorder}`,
  padding: "16px 0",
};

const imageShell = (imageUrl?: string) => ({
  width: "84px",
  height: "108px",
  display: "inline-block",
  verticalAlign: "top" as const,
  border: `1px solid ${emailTheme.softBorder}`,
  backgroundColor: "#EDE2CF",
  backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  textAlign: "center" as const,
});

const placeholderText = {
  margin: "46px 0 0",
  color: "#675845",
  fontSize: "10px",
  letterSpacing: "1.8px",
  textShadow: "0 1px 0 rgba(252,248,241,0.8)",
};

const itemDetails = {
  display: "inline-block",
  verticalAlign: "top" as const,
  marginLeft: "16px",
  width: "calc(100% - 108px)",
};

const itemName = {
  margin: "0 0 7px",
  color: emailTheme.text,
  fontSize: "15px",
  fontWeight: "600",
  lineHeight: "1.45",
};

const itemMeta = {
  margin: "0 0 3px",
  color: "#5E5243",
  fontSize: "12px",
  lineHeight: "1.45",
};

const itemPrice = {
  margin: "10px 0 0",
  color: emailTheme.text,
  fontSize: "14px",
  fontWeight: "600",
};

const totalRow = {
  borderTop: `1px solid ${emailTheme.softBorder}`,
  paddingTop: "14px",
};

const totalLabel = {
  margin: "0",
  display: "inline-block",
  color: "#5E5243",
  fontSize: "13px",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
};

const totalValue = {
  margin: "0",
  float: "right" as const,
  color: emailTheme.text,
  fontSize: "20px",
  fontFamily: emailTheme.serif,
};
