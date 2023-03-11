import { PUBLIC_WEBSITE_URL } from '$env/static/public';

export async function GET() {
	return new Response(
		`
      <?xml version="1.0" encoding="UTF-8" ?>
      <urlset
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
      >
      <url>
        <loc>${PUBLIC_WEBSITE_URL}</loc>
      </url>

      <url>
        <loc>${PUBLIC_WEBSITE_URL}/kontakty/pasze</loc>
      </url>
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/kontakty/komis</loc>
      </url>
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/kontakty/market</loc>
      </url>
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/kontakty/paliwa</loc>
      </url>
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/kontakty/maszyny</loc>
      </url>
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/kontakty/serwis</loc>
      </url>
      
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/login</loc>
      </url>
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/login/weryfikacja</loc>
      </url>

      <url>
        <loc>${PUBLIC_WEBSITE_URL}/admin/</loc>
      </url>
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/admin/analityka</loc>
      </url>
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/admin/produkty</loc>
      </url>
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/admin/uzytkownicy</loc>
      </url>
      <url>
        <loc>${PUBLIC_WEBSITE_URL}/admin/zamowienia</loc>
      </url>

      </urlset>`.trim(),
		{
			headers: {
				'Content-Type': 'application/xml'
			}
		}
	);
}
