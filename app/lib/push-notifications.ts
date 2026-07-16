import "server-only";

type ExpoPushMessage = {
  to: string;
  sound?: "default";
  title: string;
  body: string;
  data?: Record<string, unknown>;
  priority?: "default" | "normal" | "high";
};

type ExpoPushTicket = {
  status: "ok" | "error";
  id?: string;
  details?: {
    error?: string;
    expoPushToken?: string;
  };
};

type ExpoPushResponse = {
  data: ExpoPushTicket[];
};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const PUSH_TOKEN_REGEX = /^(Expo|Exponent)PushToken\[[^\]]+\]$/;

function chunk<T>(list: T[], size: number): T[][] {
  const output: T[][] = [];

  for (let i = 0; i < list.length; i += size) {
    output.push(list.slice(i, i + size));
  }

  return output;
}

export function isValidExpoPushToken(token: string): boolean {
  return PUSH_TOKEN_REGEX.test(token);
}

export function buildNewOrderPushMessage(input: {
  orderNumber: string;
  customerName: string;
  totalCad: number;
}) {
  return {
    title: "🔥 New Order",
    body: `Order #${input.orderNumber}\nCustomer: ${input.customerName}\nTotal: $${input.totalCad.toFixed(2)} CAD`,
  };
}

export async function sendNewOrderPushNotification(input: {
  tokens: string[];
  orderNumber: string;
  customerName: string;
  totalCad: number;
  orderId: string;
}): Promise<{ invalidTokens: string[] }> {
  const validTokens = input.tokens.filter(isValidExpoPushToken);
  if (validTokens.length === 0) {
    return { invalidTokens: [] };
  }

  const { title, body } = buildNewOrderPushMessage(input);
  const messages: ExpoPushMessage[] = validTokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    priority: "high",
    data: {
      orderId: input.orderId,
      orderNumber: input.orderNumber,
      screen: "OrderDetails",
    },
  }));

  const invalidTokens = new Set<string>();

  for (const batch of chunk(messages, 100)) {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(batch),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Expo push request failed (${response.status}): ${text}`);
    }

    const payload = (await response.json()) as ExpoPushResponse;
    payload.data.forEach((ticket, index) => {
      if (ticket.status !== "error") {
        return;
      }

      const token = batch[index]?.to;
      if (!token) {
        return;
      }

      const code = ticket.details?.error;
      if (code === "DeviceNotRegistered") {
        invalidTokens.add(token);
      }
    });
  }

  return { invalidTokens: Array.from(invalidTokens) };
}
