import VerificationEmail from '$lib/emails/verification-code.svelte';
import { render } from 'svelte-email';

export async function GET() {
	const html = render({
		template: VerificationEmail,
		props: {
			code: '8145',
			firstName: 'Szymon',
			device: 'iPhone 12 Pro Max',
			ip: '192.168.42.19',
			location: 'Polska',
			time: '20:34, 28 wrzesień 2023'
		}
	});

	return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
