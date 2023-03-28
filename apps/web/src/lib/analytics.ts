import mixpanel from "mixpanel-browser";
import { getBaseUrl } from "../utils/base-url";
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
    api_host: `${getBaseUrl()}/mp`,
  });
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (isProduction) {
    mixpanel.track(event, properties);
  }
}

export function page(url: string) {
  if (isProduction) {
    mixpanel.track("Page Viewed", {
      url,
    });
  }
}

export function identify(identifier: string) {
  if (isProduction) {
    mixpanel.identify(identifier);
  }
}
