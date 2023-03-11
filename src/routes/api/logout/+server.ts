import { accessTokenExpiryDate, jwtName, refreshTokenExpiryDate } from '$lib/server/constants/auth';
import { json } from '@sveltejs/kit';

export function POST(event) {
	event.cookies.delete(jwtName.access, {
		expires: accessTokenExpiryDate(),
		path: '/'
	});
	event.cookies.delete(jwtName.refresh, {
		expires: refreshTokenExpiryDate(),
		path: '/'
	});
	event.locals.session = null;

	return json({ success: true, message: 'Zostałeś wylogowany' });
}
