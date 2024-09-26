import type { PageLoad } from './$types';
import type { App } from '../../../app';

import appIndex from '$lib/external/apps/index.json';

export const load = (async ({ params }) => {
    return {
        // @ts-ignore
        app: appIndex[params.id] as App
    };
}) satisfies PageLoad;