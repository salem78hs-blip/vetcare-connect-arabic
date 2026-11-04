import { createFileRoute } from "@tanstack/react-router";

// Serves product images from the private `products` storage bucket.
// Product photos are public catalog content, so anonymous reads are intended;
// the allow-list below is the only thing exposed, so no customer or admin
// data can pass through this route.
const IMAGE_NAME = /^[a-f0-9-]{36}\.(jpg|png|webp)$/;
const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export const Route = createFileRoute("/api/public/product-image/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const name = params._splat ?? "";
        if (!IMAGE_NAME.test(name)) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("products").download(name);
        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(data, {
          headers: {
            "content-type": MIME[name.slice(-3)] ?? "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
