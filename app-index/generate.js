import { readdirSync, readFileSync, writeFileSync, statSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Marked } from "marked";
import { baseUrl } from "marked-base-url";
import { env } from 'process';

const REPO = env.GITHUB_REPOSITORY || "e3ndr/rt-downloads";
const TAG = env.GITHUB_SHA || "main";

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
    marked.use(baseUrl(rootUrl + "/"));

    // tags: string[]
    // name: string
    // author: string
    // license: {title: string, url: string} | null
    const meta = JSON.parse(readFileSync(join("./apps", id, "meta.json"), { encoding: "utf-8" }));

    let iconUrl = null;
    try {
        statSync(join("./apps", id, "icon.png")); // This throws when the file doesn't exist.
        iconUrl = `${rootUrl}/icon.png`;
    } catch (ignored) { }

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
        author: string,
        license: {
            title: string,
            url: string
        } | null,
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
        name: meta.name,
        author: meta.author,
        license: meta.license,
        description: {
            markdown: descriptionMarkdown,
            html: marked.parse(descriptionMarkdown)
        },
        downloads: downloads,
        tags: meta.tags,
        iconUrl: iconUrl
    };
    index[appInfo.id] = appInfo;
}

// Place a file to be the "api".
mkdirSync("../site/static/api/apps/", { recursive: true });
writeFileSync("../site/static/api/apps/index.json", JSON.stringify(index, null, 2));

// Place a file in the libs for the pre-rendering.
mkdirSync("../site/src/lib/external/apps/", { recursive: true });
writeFileSync("../site/src/lib/external/apps/index.json", JSON.stringify(index, null, 2));
