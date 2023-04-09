import wretch from 'wretch';
import { EMAIL_PASS } from '$env/static/private';

const verificationEmailTemplateId = 'd-1e4f56e196124f30876090c8a94cb5d1';
const orderConfirmationEmailTemplateId = 'd-2ce385e677bc44cdb6c51bd6f7321787';

type SendVerificationEmailOpts = {
	receiver: string;
	code: string;
	link: string;
};

type SendOrderConfirmationEmailOpts = {
	receiver: string;
	templateData: {
		order_id: number;
		full_name: string;
		first_name: string;
		"address_1": string;
		"address_2": string;
		phone_number: string;
		delivery_method: string;
		payment_method: string;
		discount_price: string;
		no_discount_price: string;
		discount: string;
	}
};

const sendGridApi = wretch('https://api.sendgrid.com/v3/mail')
	// Authorization header
	.auth(`Bearer ${EMAIL_PASS}`)
	// Cors fetch options
	.options({ credentials: 'include', mode: 'cors' })
	// Handle 403 errors
	.resolve((_) =>
		_.forbidden((err) => {
			console.error('403 error', err);
		})
	);

export const sendVerificationEmail = ({ receiver, code, link }: SendVerificationEmailOpts) => {
	console.log(receiver, code, link);
	return sendGridApi
		.url('/send')
		.post({
			personalizations: [
				{
					to: [{ email: receiver }],
					dynamic_template_data: {
						code,
						link
					}
				}
			],
			from: { email: 'no-reply@geopolis.io', name: 'Twoje Aldo 🚜' },
			subject: 'Potwierdzenie logowania',
			template_id: verificationEmailTemplateId
		})
		.fetchError((err) => console.log('fetch error', err))
		.res();
};

export const sendOrderConfirmationEmail = ({ receiver, templateData }: SendOrderConfirmationEmailOpts) => {
	console.log(receiver, templateData);
	return sendGridApi
		.url('/send')
		.post({
			personalizations: [
				{
					to: [{ email: receiver }],
					dynamic_template_data: templateData
				}
			],
			from: { email: 'no-reply@geopolis.io', name: 'Twoje Aldo 🚜' },
			subject: 'Potwierdzenie zamówienia',
			template_id: orderConfirmationEmailTemplateId
		})
		.fetchError((err) => console.log('fetch error', err))
		.res();
};