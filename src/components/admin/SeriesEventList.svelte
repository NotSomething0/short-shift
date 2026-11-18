<script lang="ts">
  import { type Event } from "../../types/database";
  import { ActionInputError, actions } from "astro:actions";
  import { onMount } from "svelte";
  import EditEventModal from "./dashboard/manage/event/EditEventModal.svelte";
  import EventCard from "./EventCard.svelte";

  const ITEMS_PER_PAGE = 3;

  let { series } = $props();

  let isNewEventModalOpen = $state(false);
  let events: Event[] = $state([]);
  let currentPage = $state(1);

  let totalPages = $derived(
    Math.max(1, Math.ceil(events.length / ITEMS_PER_PAGE)),
  );

  function getPagedEvents() {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    if (!events.length) return [];

    return events.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }

  function nextPage() {
    if (currentPage < totalPages) currentPage++;
  }

  function prevPage() {
    if (currentPage > 1) currentPage--;
  }

  function handleRemoveEvent(id: string) {
    events = events.filter((event) => event.id !== id);
  }

  async function handleEditEvent(event: Event) {
    const { data, error } = await actions.events.updateEvent(event);

    if (error) {
      //@TODO: Helpful user validation messages
      console.log("Failed to update event", error);
      return;
    }

    events = events.map((e) => (e.id === data.id ? data : e));
  }

  async function createNewEvent(event: Event) {
    event.series_id = series.id;

    const { data, error } = await actions.events.createEvent(event);

    if (error) {
      if (error instanceof ActionInputError) {
        //@TODO: Helpful user validation messages
        console.log("Failed validation", error);
        return;
      }

      throw error;
    }

    events = [...events, data];
    isNewEventModalOpen = false;
  }

  onMount(async () => {
    const { data, error } = await actions.events.getEventsBySeriesId({
      seriesId: series.id,
    });

    if (error) return;

    if (data.length > 0) {
      data.sort(
        (eventA: Event, eventB: Event) =>
          new Date(eventA.start_at).getTime() -
          new Date(eventB.start_at).getTime(),
      );
    }

    events = data;
  });
</script>

<EditEventModal
  event={{}}
  onSave={createNewEvent}
  onCancel={() => (isNewEventModalOpen = false)}
  isOpen={isNewEventModalOpen}
/>

<div class="min-h-80 flex flex-col">
  {#if events.length < 1}
    <div
      class="p-6 text-center text-gray-500 flex-1 flex flex-col justify-center"
    >
      <p class="text-lg font-medium mb-1">
        This series does not contain any events.
      </p>

      <button
        onclick={() => (isNewEventModalOpen = true)}
        class="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-white transition mt-2"
      >
        Create First Event!
      </button>
    </div>
  {:else}
    <div class="flex-1 space-y-4">
      {#each getPagedEvents() as event (event.id)}
        <EventCard
          eventData={event}
          onRemove={() => handleRemoveEvent(event.id)}
          onEdit={handleEditEvent}
        />
      {/each}
    </div>

    <!-- Controls Row -->
    <div class="flex flex-col md:flex-row items-center mt-6 gap-4">
      <!-- Spacer (only useful on md+) -->
      <div class="hidden md:block flex-1"></div>

      <!-- Pagination Controls -->
      <div
        class="flex justify-center items-center flex-wrap gap-3 md:space-x-4"
      >
        <button
          onclick={prevPage}
          disabled={currentPage === 1}
          class="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        <span class="text-gray-200 font-medium self-center">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onclick={nextPage}
          disabled={currentPage === totalPages}
          class="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>

      <!-- Create Event -->
      <div class="flex justify-center md:justify-end md:flex-1">
        <button
          onclick={() => (isNewEventModalOpen = true)}
          class="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-white transition"
        >
          + Create Event
        </button>
      </div>
    </div>
  {/if}
</div>
