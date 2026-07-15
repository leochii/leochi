import { Section, Text } from "@react-email/components";
import { emailTheme } from "./theme";

export type ProgressStep = {
  label: string;
  state: "complete" | "current" | "upcoming";
};

type ProgressTrackerProps = {
  title?: string;
  steps: ProgressStep[];
};

export function ProgressTracker({ title, steps }: ProgressTrackerProps) {
  return (
    <Section style={trackerCard}>
      {title ? <Text style={titleStyle}>{title}</Text> : null}

      {steps.map((step, index) => {
        const isComplete = step.state === "complete";
        const isCurrent = step.state === "current";

        return (
          <Section key={`${step.label}-${index}`} style={stepRow}>
            <Text style={stepMarker(isComplete, isCurrent)}>
              {isComplete ? "✓" : isCurrent ? "●" : "○"}
            </Text>
            <Text style={stepText(isComplete, isCurrent)}>{step.label}</Text>
          </Section>
        );
      })}
    </Section>
  );
}

const trackerCard = {
  border: `1px solid ${emailTheme.softBorder}`,
  backgroundColor: emailTheme.panelMuted,
  margin: "22px 0",
  padding: "18px 18px 10px",
};

const titleStyle = {
  margin: "0 0 10px",
  color: emailTheme.text,
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "2.2px",
};

const stepRow = {
  marginBottom: "10px",
};

const stepMarker = (isComplete: boolean, isCurrent: boolean) => ({
  margin: "0",
  display: "inline-block",
  width: "22px",
  color: isComplete || isCurrent ? emailTheme.accent : "#B09E85",
  fontSize: "12px",
  lineHeight: "1.5",
});

const stepText = (isComplete: boolean, isCurrent: boolean) => ({
  margin: "0",
  display: "inline-block",
  color: isComplete || isCurrent ? emailTheme.text : "#8A7C68",
  fontSize: "12px",
  letterSpacing: "1.2px",
  textTransform: "uppercase" as const,
});
