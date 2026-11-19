<script lang="ts">
  import type { Event } from "../../../../../database/events";
  import EditEventModal from "../event/EditEventModal.svelte";

  let { eventData, onRemove, onEdit } = $props();

  let isEditModalOpen = $state(false);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  async function eventModalSaved(event: Event) {
    isEditModalOpen = false;
    onEdit(event);
  }
</script>

<EditEventModal
  event={eventData}
  onSave={eventModalSaved}
  isOpen={isEditModalOpen}
  onCancel={() => (isEditModalOpen = false)}
/>

<div
  class="group relative flex items-center justify-between p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF8000]/50 transition-all duration-300"
>
  <div class="flex-1">
    <div class="flex items-center gap-3 mb-2">
      <div
        class="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF2800]/20 to-[#FF8000]/20 flex items-center justify-center"
      >
        <svg
          class="w-5 h-5 text-[#FF8000]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div>
        <h4 class="text-lg font-bold text-white">{eventData.name}</h4>
        <span class="text-sm text-gray-500">{eventData.track ?? "TBA"}</span>
      </div>
    </div>
    <div class="flex items-center gap-4 text-sm">
      <span class="flex items-center gap-1.5 text-gray-400">
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {formatDate(eventData.start_at)}
      </span>
      {#if eventData.location}
        <span class="flex items-center gap-1.5 text-gray-500">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {eventData.location}
        </span>
      {/if}
    </div>
  </div>

  <div
    class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
  >
    <button
      onclick={() => (isEditModalOpen = true)}
      aria-label={`Edit ${eventData.name}`}
      class="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center justify-center"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    </button>
    <button
      onclick={() => onRemove(eventData.id)}
      aria-label={`Delete ${eventData.name}`}
      class="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition flex items-center justify-center"
    >
      <svg
        class="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  </div>
</div>
