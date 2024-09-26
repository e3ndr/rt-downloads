export declare type AppDownload = {
	name: string,
	downloadUrl: string,
	createdAtMs: number | -1, // -1 if no date provided.
	size: number,
	sizeStr: string,
}

export declare type AppLicense = {
	title: string,
	url: string,
}

export declare type App = {
	id: string,
	name: string,
	author: string,
	license: AppLicense | null,
	description: {
		markdown: string,
		html: string,
	},
	downloads: AppDownload[],
	tags: string[],
	iconUrl: string | null,
}

export declare type AppIndex = { [key: string]: App };

export { };
