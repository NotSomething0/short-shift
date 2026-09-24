<script lang="ts">
  let { event, save, close } = $props();

  let dialog: HTMLDialogElement;
  let mouseDownTarget: EventTarget | null = null;

  let draft = $state({
    id: "",
    name: "",
    series_id: "",
    start_at: "",
    end_at: "",
    timezone: "",
    track: "",
    session: "",
  });

  $effect(() => {
    if (event) {
      dialog.showModal();
      draft = { ...event };
      return;
    }

    dialog.close();
  });

  const timezones = Intl.supportedValuesOf?.("timeZone") ?? [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Asia/Tokyo",
  ];
</script>

<dialog
  bind:this={dialog}
  onclose={close}
  onclick={(e) => {
    if (e.target === dialog && mouseDownTarget == dialog) close();
  }}
  onmousedown={(e) => (mouseDownTarget = e.target)}
  class="m-auto bg-[#111111] rounded-2xl min-w-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
>
  <h1 class="text-white text-2xl font-bold p-4">Editing {draft?.name}</h1>

  <form action="" class="bg-white/5 rounded-2xl mx-6 mb-6 p-4">
    <fieldset>
      <legend class="text-white font-bold text-center text-xl"
        >Event Information</legend
      >

      <label for="name" class="text-white flex flex-col mb-1">
        Name:
        <input
          name="name"
          type="text"
          class="w-full px-4 py-2 rounded-xl bg-white/5 text-white focus:outline-none mt-1"
          bind:value={draft.name}
        />
      </label>

      <label for="session" class="text-white flex flex-col mb-1">
        Session:
        <input
          name="session"
          type="text"
          class="w-full px-4 py-2 rounded-xl bg-white/5 text-white focus:outline-none mt-1"
          bind:value={draft.session}
        />
      </label>

      <label for="startDate" class="text-white flex flex-col mb-1">
        Starting Date:
        <input
          type="date"
          name="startDate"
          class="w-full px-4 py-2 rounded-xl bg-white/5 text-white focus:outline-none mt-1"
          bind:value={draft.start_at}
        />
      </label>

      <label for="startTime" class="text-white flex flex-col mb-1">
        Starting Time:
        <input
          type="time"
          name="startTime"
          class="w-full px-4 py-2 rounded-xl bg-white/5 text-white focus:outline-none mt-1"
        />
      </label>

      <label for="endDate" class="text-white flex flex-col mb-1">
        Ending Date:
        <input
          type="date"
          name="endDate"
          class="w-full px-4 py-2 rounded-xl bg-white/5 text-white focus:outline-none mt-1"
          bind:value={draft.end_at}
        />
      </label>

      <label for="endTime" class="text-white flex flex-col mb-1">
        Ending Time:
        <input
          type="time"
          name="endTime"
          class="w-full px-4 py-2 rounded-xl bg-white/5 text-white focus:outline-none mt-1"
        />
      </label>

      <label class="text-gray-500 text-sm block mb-2">
        Timezone

        <select
          bind:value={draft.timezone}
          class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#FF8000]/50 transition"
        >
          {#each timezones as tz}
            <option class="text-black" value={tz}>{tz}</option>
          {/each}
        </select>
      </label>
    </fieldset>

    <div class="flex justify-end gap-3 pl-2 pt-3">
      <button
        type="button"
        onclick={close}
        class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white cursor-pointer"
        >Cancel</button
      >
      <button
        type="button"
        onclick={save(draft)}
        class="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-md text-white cursor-pointer"
      >
        Save
      </button>
    </div>
  </form>
</dialog>
