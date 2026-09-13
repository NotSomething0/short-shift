<script lang="ts">
  import { navigate } from "astro/virtual-modules/transitions-router.js";
  import type { Series, SeriesList } from "../../../database/series";

  import { actions } from "astro:actions";
  import { onMount } from "svelte";

  let loading = $state(false);
  let allSeries: SeriesList = $state([]);
  let followedSeriesList: string[] = $state([]);

  let filteredSeries = $derived(
    allSeries.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  let search = $state("");

  async function followSeries(series: Series, button: HTMLButtonElement) {
    if (followedSeriesList.includes(series.id)) return;

    const orignalHTML = button.innerHTML;

    button.disabled = true;
    button.innerHTML = `<span class="animate-spin">⏳</span> Following...`;

    const { error } = await actions.profile.followSeriesById(series.id);

    if (error) {
      console.log(`Failed to follow series ${series.name}`);
      console.error(error.message);
      return;
    }

    button.innerHTML = orignalHTML;
    button.innerText = "Following";

    followedSeriesList.push(series.id);
  }

  onMount(async () => {
    loading = true;
    const { data, error } = await actions.series.getAllSeries();

    if (error) {
      loading = false;
      console.log("Failed to get all series!");
      return;
    }

    allSeries = data;
    loading = false;
  });
</script>

<section class="p-6">
  {#if loading}
    <p class="text-center text-white">Loading series data sit tight</p>
  {:else}
    <input
      type="text"
      placeholder="Search series..."
      bind:value={search}
      class="p-4 w-full bg-white/2 rounded-2xl border border-white/10 text-white focus:outline-none"
    />

    <!-- Grid -->
    <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
      {#each filteredSeries as item (item.id)}
        <div class="rounded-2xl border border-white/10 bg-white/2 p-6">
          <div class="flex flex-row justify-between">
            <h2 class="text-white font-semibold text-lg">
              {item.name}
            </h2>

            <p class=" text-white mt-3">
              {100} followers
            </p>
          </div>

          <p class="text-sm text-gray-400 mt-2">
            {item.description}
          </p>

          <button
            onclick={(event) => followSeries(item, event.currentTarget)}
            class="w-full py-2.5 mt-2 rounded-md font-bold bg-orange-600 hover:bg-orange-500 text-center text-white cursor-pointer"
          >
            Follow
          </button>
        </div>
      {/each}
    </div>

    {#if followedSeriesList.length}
      <div class="flex flex-row justify-end">
        <button class="rounded-md text-white bg-orange-600 hover:bg-orange-500 p-2 cursor-pointer" onclick={() => navigate("/app")}>Continue</button>
      </div>
    {/if}
  {/if}
</section>
