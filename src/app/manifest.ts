import type { MetadataRoute } from "next";

/**
 * Web app manifest — what lets iOS/Android launch the site as a standalone app
 * (no browser chrome) when it's added to the home screen. `display: standalone`
 * hides the URL bar and controls; `scope: "/"` keeps EVERY route inside the app
 * shell, so moving from the dashboard to products no longer drops back into
 * Safari with the chrome showing. Colours match the page token (#f7f4f0) so the
 * splash and status bar read as one surface with the app.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Craft Your Money",
    short_name: "Craft",
    description: "Pricing & profitability for handmade makers",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f4f0",
    theme_color: "#f7f4f0",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
