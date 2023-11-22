import VerificationEmail from '$lib/emails/verification-code.svelte';
import OrderStatusEmail from '$lib/emails/order-status.svelte';
import OrderCreatedEmail from '$lib/emails/order-created.svelte';
import { RESEND_API_KEY } from '$env/static/private';
import { render } from 'svelte-email';
import type { OrderProduct } from '$types';

const from = 'onboarding@resend.dev';

interface EmailData {
	to: string[];
	from?: string;
	subject?: string;
	html?: string;
}

interface OrderCreatedEmailData extends EmailData {
	props: {
		firstName: string;
		orderId: number | string;
		time: string;
		price: string | number;
		cartOwner: {
			fullName: string;
			email: string;
			phone: string;
		} | null;
		products: (OrderProduct & { quantity: number; image: string | null })[];
	};
}

interface VerificationEmailData extends EmailData {
	props: {
		code: string;
		firstName: string;
		device: string;
		ip: string;
		// location: string;
		time: string;
	};
}

interface OrderStatusEmailData extends EmailData {
	props: {
		preview: string;
		description: string;
		firstName: string;
		orderId: number | string;
		price: string | number;
		time: string;
		cartOwner: {
			fullName: string;
			email: string;
			phone: string;
		} | null;
		driver: {
			fullName: string;
			email: string;
			phone: string;
		} | null;
	};
}

const sendEmail = (body: Record<string, unknown>) => {
	return fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${RESEND_API_KEY}`
		},
		body: JSON.stringify(body)
	});
};

export const sendVerificationEmail = async ({ to, props }: VerificationEmailData) => {
	const html = render({
		template: VerificationEmail,
		props
	});

	const subject = 'Weryfikacja logowania';

	const res = await sendEmail({
		from,
		to,
		subject,
		html
	});

	const whatever = await res.json();
	console.log('response', res.ok, whatever, res.status);
	return res.ok;
};

export const sendOrderStatusEmail = async ({ to, props }: OrderStatusEmailData) => {
	const html = render({
		template: OrderStatusEmail,
		props
	});

	const subject = 'Zmiana statusu zamówienia';

	const res = await sendEmail({
		from,
		to,
		subject,
		html
	});

	const whatever = await res.json();
	console.log('response', res.ok, whatever, res.status);
	return res.ok;
};

export const sendOrderCreatedEmail = async ({ to, props }: OrderCreatedEmailData) => {
	const html = render({
		template: OrderCreatedEmail,
		props
	});

	const subject = 'Nowe zamówienie';

	const res = await sendEmail({
		from,
		to,
		subject,
		html
	});

	const whatever = await res.json();
	console.log('response', res.ok, whatever, res.status);
	return res.ok;
};
