import OrderStatusEmail from '$lib/emails/order-status.svelte';
import { render } from 'svelte-email';

export async function GET() {
	const title = 'Zmiana statusu zamówienia';
	const previews = [
		'Zamówienie w trakcie realizacji',
		'Przesyłka jest w drodze',
		'Zamówienie zrealizowane',
		'Zamówienie anulowane'
	];

	const html = render({
		template: OrderStatusEmail,
		props: {
			title,
			preview: previews[1],
			firstName: 'Szymon',
			orderId: 5,
			cartOwner: {
				fullName: 'Henryk Siekniewicz',
				email: 'henryk.sienkiewicz@wp.pl',
				phone: '123456789'
			},
			price: 500,
			time: '20:50, 30 wrzesień 2023'
		}
	});

	return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
