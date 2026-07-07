import "./globals.css";
import { getSettings } from "@/lib/api";

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings?.seo?.metaTitle || settings?.siteName || "Lucent Glass",
    description: settings?.seo?.metaDescription || settings?.tagline || "",
    icons: settings?.faviconUrl ? [{ url: settings.faviconUrl }] : undefined,
  };
}

// Google Fonts phổ biến hỗ trợ sẵn — admin chọn tên font trong Cài đặt giao diện
const GOOGLE_FONTS = [
  "Montserrat", "Inter", "Poppins", "Roboto", "Playfair Display",
  "Lora", "Nunito", "Raleway", "Open Sans", "Merriweather",
];

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  const headingFont = settings?.fonts?.heading || "Montserrat";
  const bodyFont = settings?.fonts?.body || "Inter";
  const fontFamilies = Array.from(new Set([headingFont, bodyFont])).filter((f) => GOOGLE_FONTS.includes(f));
  const fontsHref = fontFamilies.length
    ? `https://fonts.googleapis.com/css2?${fontFamilies
        .map((f) => `family=${f.replace(/ /g, "+")}:wght@400;500;600;700;800`)
        .join("&")}&display=swap`
    : null;

  const themeStyle = `
    :root {
      --color-primary: ${settings?.colors?.primary || "#5f5f59"};
      --color-secondary: ${settings?.colors?.secondary || "#fae519"};
      --color-background: ${settings?.colors?.background || "#fbf9f9"};
      --color-on-background: ${settings?.colors?.onBackground || "#1b1c1c"};
      --color-surface: ${settings?.colors?.surface || "#efeded"};
      --color-outline: ${settings?.colors?.outline || "#777770"};
      --font-heading: "${headingFont}", sans-serif;
      --font-body: "${bodyFont}", sans-serif;
    }
  `;

  return (
    <html lang="vi">
      <head>
        {fontsHref && <link rel="stylesheet" href={fontsHref} />}
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined" />
        <style dangerouslySetInnerHTML={{ __html: themeStyle }} />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
