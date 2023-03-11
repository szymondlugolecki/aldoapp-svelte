import { sequence } from '@sveltejs/kit/hooks';
import { handleAuthorization } from '$lib/server/hooks/authorization';
import { handleTokenRefresh } from '$lib/server/hooks/refreshToken';

// ? Scenarios
// * 1. accessToken cookie ✅ & token is ✅ => just continue
// * 2. accessToken cookie ✅ & token is ❌ => refresh the tokens
// * 3. accessToken cookie ❌ & refreshToken cookie ❌ => no session, just continue
// * 4. accessToken cookie ❌ & refreshToken cookie ✅ => refresh the tokens

export const handle = sequence(handleTokenRefresh, handleAuthorization);
