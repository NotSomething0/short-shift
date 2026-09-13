<script lang="ts">
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

  async function followSeries(series: Series) {
    if (followedSeriesList.includes(series.id)) return;

    const { error } = await actions.profile.followSeriesById(series.id);

    if (error) {
      console.log(`Failed to follow series ${series.name}`);
      console.error(error.message);
      return;
    }

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

<section class="max-w-screen">
  <input
    type="text"
    placeholder="Search series..."
    bind:value={search}
    class="p-4 m-4 w-full bg-white/2 rounded-2xl border border-white/10 text-white focus:outline-none"
  />

  {#if loading}
    <p class="text-center text-white">Loading series data sit tight</p>
  {:else}
    <!-- Grid -->
    <div class="grid md:grid-cols-2 gap-5 p-4">
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
            onclick={() => followSeries(item)}
            class="w-full text-white rounded-md mt-2 bg-orange-600 hover:bg-orange-500 cursor-pointer p-1"
          >
            {item.category ? "Following" : "Follow"}
          </button>
        </div>
      {/each}
    </div>
  {/if}
</section>
