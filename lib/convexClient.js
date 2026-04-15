import { ConvexHttpClient } from "convex/browser";

let client;

export function getConvexClient() {
  if (!client) {
    const url = process.env.CONVEX_URL;
    const key = process.env.CONVEX_ADMIN_KEY;

    if (!url || !key) {
      throw new Error("Convex env missing");
    }

    client = new ConvexHttpClient(url);
    client.setAdminAuth(key);
  }

  return client;
}
