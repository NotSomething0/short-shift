<script lang="ts">
  import type { Event, Events } from "../../../../../database/events";
  import { actions } from "astro:actions";
  import { onMount } from "svelte";
  import EditEventModal from "./EditEventModal.svelte";

  const EVENTS_PER_PAGE = 4;

  let loading = $state(false);
  let loadingError = $state(false);
  let allEvents: Events = $state([]);
  let filteredEvents = $derived(
    allEvents.filter((event) =>
      event.name.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()),
    ),
  );
  let currentPage = $state(0);
  let totalPages = $derived(Math.ceil(filteredEvents.length / EVENTS_PER_PAGE));
  let displayedPage = $derived(totalPages === 0 ? 0 : currentPage + 1);
  let pagedEvents = $derived(
    filteredEvents.slice(
      currentPage * EVENTS_PER_PAGE,
      (currentPage + 1) * EVENTS_PER_PAGE,
    ),
  );
  let searchQuery = $state("");
  let editingEvent: Event | null = $state(null);

  async function updateEvent(event: Event) {
    const { data: updatedEvent, error } =
      await actions.events.updateEvent(event);

    if (error) {
      console.error(`Failed to update event ${event.id} ${error.message}`);
      return;
    }

    allEvents = allEvents.map((_event) =>
      _event.id == event.id ? { ..._event, ...updatedEvent } : _event,
    );
    editingEvent = null;
  }

  onMount(async () => {
    loading = true;

    const { data, error } = await actions.administration.getAllEvents();

    if (error) {
      loadingError = true;
      loading = false;
      return;
    }

    allEvents = data;
    loading = false;
  });
</script>

<div class="bg-[#111111] border border-white/10 w-full p-4">
  <div class="flex justify-between mb-2">
    <h1 class="text-xl font-bold text-white">Events Manager</h1>
    <button
      onclick={() => console.log("not implemented yet")}
      class="p-2 rounded-md bg-orange-600 hover:bg-orange-500 text-white font-bold cursor-pointer"
      >Create Event</button
    >
  </div>

  <input
    type="text"
    name="seriesSearch"
    placeholder="Search events..."
    bind:value={searchQuery}
    oninput={() => (currentPage = 0)}
    class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 mb-4 focus:outline-none"
  />

  <div class="border border-white/10 rounded-2xl bg-white/2">
    <table class="w-full">
      <thead>
        <tr class="text-white uppercase font-semibold">
          <th class="p-4">Name</th>
          <th class="p-4">Track</th>
          <th class="p-4">Starts</th>
          <th class="p-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#if loading}
          <tr>
            <td
              colspan="4"
              class="border-t border-white/10 p-3 text-center text-white"
            >
              Loading Events...
            </td>
          </tr>
        {:else if loadingError}
          <tr>
            <td colspan="4" class="p-3 text-center text-zinc-400">
              An error occured while loading.
            </td>
          </tr>
        {:else}
          {#each pagedEvents as pagedEvent}
            <tr class="border-t border-white/5">
              <th scope="row" class="font-medium text-white">
                {pagedEvent.name}
              </th>
              <td class="text-center">
                <span
                  class="px-2 py-1 rounded-md bg-[#00A0DE]/10 text-[#00A0DE] border border-[#00A0DE]/20"
                >
                  {pagedEvent.track ?? "Not set"}
                </span>
              </td>
              <td class="text-center text-white"
                >{new Date(pagedEvent.start_at).toLocaleTimeString()}</td
              >
              <td class="flex flex-col items-center">
                <button
                  onclick={() => (editingEvent = pagedEvent)}
                  class="text-white cursor-pointer bg-blue-600 hover:bg-blue-700 rounded-md px-8 py-2 m-2"
                >
                  Edit
                </button>
                <button
                  onclick={() => console.log("I want to delete!")}
                  class="text-white cursor-pointer bg-red-500 hover:bg-red-600 rounded-md px-5 py-2 mb-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
          {#each Array.from({ length: EVENTS_PER_PAGE - pagedEvents.length })}
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

{#if editingEvent}
  <EditEventModal
    event={editingEvent}
    save={updateEvent}
    close={() => (editingEvent = null)}
  />
{/if}
