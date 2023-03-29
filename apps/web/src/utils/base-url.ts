export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return "https://denoted.xyz";
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
