<script lang="ts">
	import { base } from '$app/paths';

	export let data: import('./$types').PageData;

	const app = data.app;
</script>

<a href="{base}/" class="underline"> Go back </a>

<table>
	<tr class="w-full">
		<td class="float-start w-72">
			<img class="h-auto" src={app.iconUrl} alt="" />

			<h2 class="text-2xl">Downloads</h2>
			<br />
			<ul class="list-disc">
				{#each app.downloads as download, idx}
					<li>
						<a href={download.downloadUrl} target="_blank">
							<p class="underline">
								{download.name}
							</p>
							<sup>
								{#if idx == 0}
									<b>Most recent</b>
									&bull;
								{/if}
								{download.sizeStr}
							</sup>
						</a>
					</li>
				{/each}
			</ul>
		</td>
		<td class="pl-12">
			<h1 class="font-bold underline">{app.name}</h1>
			Author:<i>{app.author}</i> <br />
			Tags: <i>{app.tags.join(', ')}</i>
			{#if app.license}
				<br />
				License:
				<i><a href={app.license.url} target="_blank" class="underline"> {app.license.title} </a></i>
			{/if}

			<br />
			<br />
			<br />
			<br />

			<div>
				{@html app.description.html}
			</div>
		</td>
	</tr>
</table>
