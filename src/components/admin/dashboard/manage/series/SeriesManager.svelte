<script lang="ts">
  import type { Series, SeriesList } from "../../../../../database/series";

  import { onMount } from "svelte";
  import { actions } from "astro:actions";
  import SeriesModal from "../../../SeriesModal.svelte";
  import DeleteConfirmationModal from "./DeleteConfirmationModal.svelte";

  const SERIES_PER_PAGE = 4;

  let loading = $state(false);
  let loadingError = $state(false);
  let seriesModalState:
    { mode: "add"; data: null } | { mode: "edit"; data: Series } | null =
    $state(null);
  let seriesStatuses = $state();
  let seriesCategories = $state();

  let allSeries = $state<SeriesList>([]);
  let filteredSeries = $state<SeriesList>([]);

  let currentPage = $state(0);
  let totalPages = $derived(Math.ceil(filteredSeries.length / SERIES_PER_PAGE));
  let displayedPage = $derived(totalPages === 0 ? 0 : currentPage + 1);
  let pagedSeries = $derived(
    filteredSeries.slice(
      currentPage * SERIES_PER_PAGE,
      (currentPage + 1) * SERIES_PER_PAGE,
    ),
  );

  let seriesToDelete = $state<Series | null>(null);
  let searchTerm = $state("");

  $effect(() => {
    filteredSeries = allSeries?.filter((series) =>
      series.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  async function createNewSeries(series: any) {
    const { data, error } = await actions.series.createSeries(series);

    if (error) {
      console.error("Failed to create series:", error);
      return;
    }

    allSeries = [...allSeries, data];
  }

  async function deleteSeries(series: Series) {
    const { error } = await actions.series.deleteSeriesById(series.id);

    if (error) {
      console.error("Failed to delete series:", error);
      return;
    }

    allSeries = allSeries.filter((_series) => _series.id !== series.id);
    seriesToDelete = null;
  }

  async function updateSeries(series: Series) {
    const { data, error } = await actions.series.updateSeries(series);

    if (error) {
      console.error("Failed to update series:", error);
      return;
    }

    allSeries = allSeries.map((_series) =>
      _series.id === data.id ? { ..._series, ...data } : _series,
    );
    seriesModalState = null;
  }

  async function load() {
    try {
      loading = true;
      loadingError = false;

      const [series, options] = await Promise.all([
        actions.series.getAllSeries(),
        actions.administration.getSeriesOptions(),
      ]);

      if (series.error) throw series.error;
      if (options.error) throw options.error;

      allSeries = series.data ?? [];
      seriesStatuses = options.data?.statuses ?? [];
      seriesCategories = options.data?.categories ?? [];
    } catch (error) {
      console.error("Failed to load:", error);
      loadingError = true;
    } finally {
      loading = false;
    }
  }

  onMount(load);
</script>

<div class="bg-[#111111] border border-white/10 w-screen p-4">
  <div class="flex justify-between mb-2">
    <h1 class="text-xl font-bold text-white">Series Manager</h1>
    <button
      aria-label="Add new series"
      class="p-2 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-bold cursor-pointer"
      onclick={() => (seriesModalState = { mode: "add", data: null })}
    >
      Create Series
  </button>
  </div>

  <input
    type="text"
    name="seriesSearch"
    placeholder="Search series..."
    bind:value={searchTerm}
    class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 mb-4 focus:outline-none"
  />

  <div class="border border-white/10 rounded-2xl bg-white/2">
    <table class="w-full">
      <thead>
        <tr class="text-gray-400 uppercase font-semibold">
          <th class="p-4">Name</th>
          <th class="p-4">Category</th>
          <th class="p-4">Status</th>
          <th class="p-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#if loading}
          <tr>
            <td colspan="4" class="p-3 text-center text-zinc-400">
              Loading Series...
            </td>
          </tr>
        {:else if loadingError}
          <tr>
            <td colspan="4" class="p-3 text-center text-zinc-400">
              An error occured while loading.
            </td>
          </tr>
        {:else if filteredSeries.length < 1}
          <tr>
            <td colspan="4" class="p-3 text-center text-zinc-400">
              No Series found maybe you should create some?
            </td>
          </tr>
        {:else}
          {#each pagedSeries as series (series.id)}
            <tr class="border-t border-white/5">
              <th scope="row" class="font-medium text-white">
                {series.name}
              </th>
              <td class="text-center">
                <span
                  class="px-2 py-1 rounded-md bg-[#00A0DE]/10 text-[#00A0DE] border border-[#00A0DE]/20"
                >
                  {series.category}
                </span>
              </td>
              <td class="text-center text-white">{series.status}</td>
              <td class="flex flex-col items-center">
                <button
                  onclick={() =>
                    (seriesModalState = { mode: "edit", data: series })}
                  class="text-white cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-md px-8 py-2 m-2"
                >
                  Edit
                </button>
                <button
                  onclick={() => (seriesToDelete = series)}
                  class="text-white cursor-pointer bg-red-500 hover:bg-red-600 rounded-md px-5 py-2 mb-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
          {#each Array.from({ length: SERIES_PER_PAGE - pagedSeries.length })}
            <tr aria-hidden="true" class="border-t border-white/5">
              <td colspan="4" class="h-26"></td>
            </tr>
          {/each}
        {/if}
      </tbody>
       <tfoot>
        <tr>
          <td colspan="3" class="border-t border-white/10 text-white p-5">
            Page {displayedPage} of {totalPages}
          </td>
          <td class="border-t border-white/10 text-right p-5">
            <div class="flex justify-end gap-2">
              <button
                onclick={() => (currentPage -= 1)}
                disabled={currentPage < 1}
                class="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >Previous</button
              >
              <button
                onclick={() => (currentPage += 1)}
                disabled={currentPage + 1 >= totalPages}
                class="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >Next</button
              >
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>

{#if seriesModalState}
  <SeriesModal
    series={seriesModalState}
    categories={seriesCategories}
    statuses={seriesStatuses}
    closeModal={() => (seriesModalState = null)}
    onCommit={seriesModalState.mode === "edit" ? updateSeries : createNewSeries}
  />
{/if}

{#if seriesToDelete}
  <DeleteConfirmationModal
    showModal={seriesToDelete != null}
    {seriesToDelete}
    {deleteSeries}
    closeModal={() => (seriesToDelete = null)}
  />
{/if}
