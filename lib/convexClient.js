import { ConvexHttpClient } from "convex/browser";

let client;

export function getConvexClient() {
  if (!client) {
    const key = process.env.CONVEX_SERVER_KEY;
    const url = process.env.CONVEX_PROJECT_URL;
    if (!key || !url) {
      throw new Error(
        "CONVEX_SERVER_KEY and CONVEX_PROJECT_URL must be set in environment",
      );
    }
    client = new ConvexHttpClient(url, { auth: { key } });
  }
  return client;
}
