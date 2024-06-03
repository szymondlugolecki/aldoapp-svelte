declare module '$lib/assets/*.[png|jpg|jpeg|webp|avif]' {
	const image: Record<string, any>[];
	export default image;
}

declare namespace EmscriptenWasm {
	type ModuleFactory<T extends Module = Module> = (moduleOverrides?: ModuleOpts) => Promise<T>;

	type EnvironmentType = 'WEB' | 'NODE' | 'SHELL' | 'WORKER';

	// Options object for modularized Emscripten files. Shoe-horned by @surma.
	// FIXME: This an incomplete definition!
	interface ModuleOpts {
		mainScriptUrlOrBlob?: string;
		noInitialRun?: boolean;
		locateFile?: (url: string) => string;
		onRuntimeInitialized?: () => void;
		instantiateWasm?: (
			imports: WebAssembly.Imports,
			successCallback: (module: WebAssembly.Module) => void
		) => WebAssembly.Exports;
	}

	interface Module {
		print(str: string): void;
		printErr(str: string): void;
		arguments: string[];
		environment: EnvironmentType;
		preInit: { (): void }[];
		preRun: { (): void }[];
		postRun: { (): void }[];
		preinitializedWebGLContext: WebGLRenderingContext;
		noInitialRun: boolean;
		noExitRuntime: boolean;
		logReadFiles: boolean;
		filePackagePrefixURL: string;
		wasmBinary: ArrayBuffer;

		destroy(object: object): void;
		getPreloadedPackage(remotePackageName: string, remotePackageSize: number): ArrayBuffer;
		instantiateWasm(
			imports: WebAssembly.Imports,
			successCallback: (module: WebAssembly.Module) => void
		): WebAssembly.Exports;
		locateFile(url: string): string;
		onCustomMessage(event: MessageEvent): void;

		Runtime: any;

		ccall(ident: string, returnType: string | null, argTypes: string[], args: any[]): any;
		cwrap(ident: string, returnType: string | null, argTypes: string[]): any;

		setValue(ptr: number, value: any, type: string, noSafe?: boolean): void;
		getValue(ptr: number, type: string, noSafe?: boolean): number;

		ALLOC_NORMAL: number;
		ALLOC_STACK: number;
		ALLOC_STATIC: number;
		ALLOC_DYNAMIC: number;
		ALLOC_NONE: number;

		allocate(slab: any, types: string, allocator: number, ptr: number): number;
		allocate(slab: any, types: string[], allocator: number, ptr: number): number;

		Pointer_stringify(ptr: number, length?: number): string;
		UTF16ToString(ptr: number): string;
		stringToUTF16(str: string, outPtr: number): void;
		UTF32ToString(ptr: number): string;
		stringToUTF32(str: string, outPtr: number): void;

		// USE_TYPED_ARRAYS == 1
		HEAP: Int32Array;
		IHEAP: Int32Array;
		FHEAP: Float64Array;

		// USE_TYPED_ARRAYS == 2
		HEAP8: Int8Array;
		HEAP16: Int16Array;
		HEAP32: Int32Array;
		HEAPU8: Uint8Array;
		HEAPU16: Uint16Array;
		HEAPU32: Uint32Array;
		HEAPF32: Float32Array;
		HEAPF64: Float64Array;

		TOTAL_STACK: number;
		TOTAL_MEMORY: number;
		FAST_MEMORY: number;

		addOnPreRun(cb: () => any): void;
		addOnInit(cb: () => any): void;
		addOnPreMain(cb: () => any): void;
		addOnExit(cb: () => any): void;
		addOnPostRun(cb: () => any): void;

		// Tools
		intArrayFromString(stringy: string, dontAddNull?: boolean, length?: number): number[];
		intArrayToString(array: number[]): string;
		writeStringToMemory(str: string, buffer: number, dontAddNull: boolean): void;
		writeArrayToMemory(array: number[], buffer: number): void;
		writeAsciiToMemory(str: string, buffer: number, dontAddNull: boolean): void;

		addRunDependency(id: any): void;
		removeRunDependency(id: any): void;

		preloadedImages: any;
		preloadedAudios: any;

		_malloc(size: number): number;
		_free(ptr: number): void;

		// Augmentations below by @surma.
		onRuntimeInitialized: () => void | null;
	}
}

// declare module 'svelte-confetti' {
// 	import { SvelteComponentTyped } from 'svelte';

// 	declare const __propDef: {
// 		props: {
// 			/**
// 			 * The max size in pixels of the individual confetti pieces.
// 			 * @default 10
// 			 */
// 			size?: number;
// 			/**
// 			 * The max horizontal range of the confetti pieces. Negative is left, positive is right. [-1, 1] would mean maximum of 200px left and 200px right.
// 			 * @default [-0.5, 0.5]
// 			 */
// 			x?: [number, number];
// 			/**
// 			 * The max vertical range of the confetti pieces. Negative is down, positive is up. [-1, 1] would mean maximum of 200px down and 200px up.
// 			 * @default [0.25, 1]
// 			 */
// 			y?: [number, number];
// 			/**
// 			 * Duration of the animation for each individual piece.
// 			 * @default 2000
// 			 */
// 			duration?: number;
// 			/**
// 			 * If set to true the animation will play indefinitely.
// 			 * @default false
// 			 */
// 			infinite?: boolean;
// 			/**
// 			 * Used to set a random delay for each piece. A large difference between each number will mean a longer spray time.
// 			 * @default [0, 50]
// 			 */
// 			delay?: [number, number];
// 			/**
// 			 * Color range on the HSL color wheel. 0 to 360 is full RGB. 75 To 150 would be only green colors.
// 			 * @default [0, 360]
// 			 */
// 			colorRange?: [number, number];
// 			/**
// 			 * Can be used to pick a random color from this array. Set just one array elements to have a single color. Accepts any viable css background property, including gradients and images.
// 			 * @default []
// 			 */
// 			colorArray?: number[];
// 			/**
// 			 * Amount of particles spawned. The larger your spray the more pieces you might want. Be careful with too many as it might impact performance.
// 			 * @default 50
// 			 */
// 			amount?: number;
// 			/**
// 			 * How many times the animation will play before stopping. Is overwritten by the "infinite" property.
// 			 * @default 1
// 			 */
// 			iterationCount?: number;
// 			/**
// 			 * How far each piece falls. Accepts any css property, px, rem, vh, etc, but not 0.
// 			 * @default "100px"
// 			 */
// 			fallDistance?: string;
// 			/**
// 			 * Set to true to make each confetti piece rounded.
// 			 * @default false
// 			 */
// 			rounded?: boolean;
// 			/**
// 			 * Set to true to make the explosion appear in a cone like shape which might feel more realistic when dealing with a larger amount.
// 			 * @default false
// 			 */
// 			cone?: boolean;
// 			/**
// 			 * Set to true to make the particles accelerate at a constant speed without "falling" down. Give it a more explosion like effect.
// 			 * @default false
// 			 */
// 			noGravity?: boolean;
// 			/**
// 			 * A number from 0 to 1 that determines how far the particles spread horizontally. A low number will mean the x near the peak and the x near the end are similar.
// 			 * @default 0.15
// 			 */
// 			xSpread?: number;
// 			/**
// 			 * By default the elements are removed when the animation is complete. Set to false to prevent this behaviour.
// 			 * @default true
// 			 */
// 			destroyOnComplete?: boolean;
// 		};
// 		events: Record<string, unknown>;
// 		slots: Record<string, unknown>;
// 	};

// 	type ConfettiProps = typeof __propDef.props;
// 	type ConfettiEvents = typeof __propDef.events;
// 	type ConfettiSlots = typeof __propDef.slots;
// 	export class Confetti extends SvelteComponentTyped<
// 		ConfettiProps,
// 		ConfettiEvents,
// 		ConfettiSlots
// 	> {}
// }
