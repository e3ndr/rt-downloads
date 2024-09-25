import { readdirSync, readFileSync, writeFileSync, statSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Marked } from "marked";
import { baseUrl } from "marked-base-url";
import { env } from 'process';

const REPO = env.GITHUB_REPOSITORY || "example/rt-downloads";
const TAG = env.GITHUB_SHA || "main";
const OUTPUT_FILE = "../site/static/api/apps/index.json";  // Should be placed inside of the SvelteKit site's static resources.
mkdirSync("../site/static/api/apps/", { recursive: true });

const index = {};

function prettifySize(bytes) {
    if (bytes == 0) return "0 B";

    const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    const size = sizes[index];
    const convertedValue = (bytes / Math.pow(1024, index)).toFixed(2).replace(".00", "");
    return `${convertedValue} ${size}`;
}

const folders = readdirSync("./apps", { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .map((f) => f.name);
for (const id of folders) {
    const rootUrl = `https://raw.githubusercontent.com/${REPO}/${TAG}/app-index/apps/${id}`;

    const marked = new Marked();
    marked.use(baseUrl(rootUrl));

    let tags = [];
    try {
        // tags.json must be an array!
        tags = JSON.parse(readFileSync(join("./apps", id, "tags.json"), { encoding: "utf-8" }));
    } catch (ignored) { }

    let iconUrl = null;
    try {
        statSync(join("./apps", id, "icon.png")); // This throws when the file doesn't exist.
        iconUrl = `${rootUrl}/icon.png`;
    } catch (ignored) { }

    const name = readFileSync(join("./apps", id, "name.txt"), { encoding: "utf-8" });
    const descriptionMarkdown = readFileSync(join("./apps", id, "description.md"), { encoding: "utf-8" });

    const downloads = readdirSync(join("./apps", id, "downloads"), { withFileTypes: true })
        .filter((f) => f.isFile())
        .map((f) => {
            const stats = statSync(join("./apps", id, "downloads", f.name));
            return {
                name: f.name.replace(".zip", ""),
                downloadUrl: `${rootUrl}/downloads/${f.name}`,
                createdAtMs: Math.floor(stats.birthtimeMs),
                size: stats.size,
                sizeStr: prettifySize(stats.size),
            };
        })
        .sort((f1, f2) => f2.createdAtMs - f1.createdAtMs);

    // App info schema is as follows:
    /*
    {
        id: string,
        name: string,
        description: {
            markdown: string,
            html: string,
        },
        downloads: {
            name: string,
            downloadUrl: string,
            size: number,
            sizeStr: string,
        }[],
        tags: string[],
        iconUrl: string | null,        
    }
    */
    const appInfo = {
        id: id,
        name: name,
        description: {
            markdown: descriptionMarkdown,
            html: marked.parse(descriptionMarkdown)
        },
        downloads: downloads,
        tags: tags,
        iconUrl: iconUrl
    };
    index[appInfo.id] = appInfo;
}

// Write the folder list to OUTPUT_FILE.
writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
console.log(JSON.stringify(index, null, 2), ">", OUTPUT_FILE);