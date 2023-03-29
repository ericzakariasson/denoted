import mixpanel from "mixpanel-browser";
import { getBaseUrl } from "../utils/base-url";
import { sha256 } from "../utils/hash";

// `NODE_ENV` will be `production` in Vercel Preview and Production environment. Set `NODE_ENV=production` if you want to test locally
const isProductionRuntime = process.env.NODE_ENV === "production";

if (isProductionRuntime) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
    api_host: `${getBaseUrl()}/mp`,
  });
}

type EventName =
  | "Email Signed Up"
  | "Wallet Connected"
  | "Wallet Disconnected"
  | "Command Handled"
  | "Ceramic Authenticated";

export function trackEvent(
  event: EventName,
  properties?: Record<string, unknown>
) {
  if (isProductionRuntime) {
    mixpanel.track(event, properties);
  }
}

export function trackPage(url: string) {
  if (isProductionRuntime) {
    mixpanel.track("Page Viewed", {
      url,
    });
  }
}

export async function identify(identifier: string) {
  if (isProductionRuntime) {
    const hashedIdentifier = await sha256(identifier);
    mixpanel.identify(hashedIdentifier);
  }
}
