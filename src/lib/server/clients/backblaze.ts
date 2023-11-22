import { env } from '$env/dynamic/private';
import B2 from 'backblaze-b2';

const b2 = new B2({
	applicationKeyId: env.BACKBLAZE_KEY_ID, // or accountId: 'accountId'
	applicationKey: env.BACKBLAZE_APP_KEY, // or masterApplicationKey
	axios: {
		// overrides the axios instance default config, see https://github.com/axios/axios
	},
	retry: {
		retries: 3 // this is the default
		// for additional options, see https://github.com/softonic/axios-retry
	}
});

async function getBucket() {
	try {
		await b2.authorize(); // must authorize first (authorization lasts 24 hrs)
		const response = await b2.getBucket({ bucketName: 'aldoapp' });
		console.log(response.data);
		return response.data;
	} catch (err) {
		console.log('Error getting bucket:', err);
	}
}

let bucket: unknown;

(async () => {
	bucket = await getBucket();
})();

export const uploadFile = (opts: Parameters<(typeof b2)['uploadFile']>[0]) => {
	console.log('bucket', bucket);
	return b2.uploadFile(opts);
};

// b2.uploadFile({
//     uploadUrl: 'uploadUrl',
//     uploadAuthToken: 'uploadAuthToken',
//     fileName: 'fileName',
//     contentLength: 0, // optional data length, will default to data.byteLength or data.length if not provided
//     mime: '', // optional mime type, will default to 'b2/x-auto' if not provided
//     data: 'data', // this is expecting a Buffer, not an encoded string
//     hash: 'sha1-hash', // optional data hash, will use sha1(data) if not provided
// });
