export declare type AppDownload = {
	name: string,
	downloadUrl: string,
	size: number,
	sizeStr: string,
}

export declare type App = {
	id: string,
	name: string,
	author: string,
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
