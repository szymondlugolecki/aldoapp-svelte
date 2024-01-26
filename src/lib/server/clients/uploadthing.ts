import { UPLOADTHING_SECRET } from '$env/static/private';
import { UTApi } from 'uploadthing/server';

export const utapi = new UTApi({ apiKey: UPLOADTHING_SECRET, logLevel: 'debug' });
