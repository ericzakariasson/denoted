import mixpanel from "mixpanel-browser";
import { getBaseUrl } from "../utils/base-url";

// `NODE_ENV` will be `production` in Vercel Preview and Production environment. Set `NODE_ENV=production` if you want to test locally
const isProductionRuntime = process.env.NODE_ENV === "production";

if (isProductionRuntime) {
  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string, {
    api_host: `${getBaseUrl()}/mp`,
    debug: !isProductionRuntime,
  });
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (isProductionRuntime) {
    mixpanel.track(event, properties);
  }
}

export function page(url: string) {
  if (isProductionRuntime) {
    mixpanel.track("Page Viewed", {
      url,
    });
  }
}

export function identify(identifier: string) {
  if (isProductionRuntime) {
    mixpanel.identify(identifier);
  }
}
