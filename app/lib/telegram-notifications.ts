import "server-only";

type TelegramNotificationConfig = {
  botToken: string;
  chatId: string;
};

export function buildNewOrderTelegramMessage(input: {
  customerEmail: string;
  amountTotalCad: number;
  sessionId: string;
}) {
  return [
    "🚀 NEW ORDER",
    "",
    `Customer: ${input.customerEmail}`,
    `Amount: $${input.amountTotalCad.toFixed(2)}`,
    `Session ID: ${input.sessionId}`,
  ].join("\n");
}

export async function sendTelegramMessage(
  config: TelegramNotificationConfig,
  text: string
): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: config.chatId,
      text,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Telegram request failed (${response.status}): ${responseText}`);
  }
}