<script lang="ts">
	import type { App } from '../app';

	import { base } from '$app/paths';
	import appIndex from '$lib/external/apps/index.json';

	const apps = Object.values(appIndex) as App[];
</script>

<h1 class="text-3xl font-bold">Apps:</h1>
<br />
<ul>
	{#each apps as app}
		<li>
			<a href="{base}/app/{app.id}">
				<img src={app.iconUrl} class="float-left h-24 w-24 object-cover" alt="" />
				<b class="underline">{app.name}</b> <br />
				Author: <i>{app.author}</i> <br />
				Tags: <i>{app.tags.join(', ')}</i>
				{#if app.license}
					<br />
					License:
					<i>{app.license.title}</i>
				{/if}
			</a>
		</li>
	{/each}
</ul>
