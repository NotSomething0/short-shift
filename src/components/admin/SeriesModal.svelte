<script lang="ts">
  import type { SeriesWithNextEvent } from "../../database/series";
  import SeriesEventList from "./SeriesEventList.svelte";

  let dialog: HTMLDialogElement;
  let mouseDownTarget: EventTarget | null = null;

  let {
    series,
    closeModal,
    onCommit,
    categories,
    statuses,
  }: {
    series:
      | { mode: "add"; data: null }
      | { mode: "edit"; data: SeriesWithNextEvent }
      | null;
    categories: any;
    statuses: any;
    closeModal: VoidFunction;
    onCommit: (series: SeriesWithNextEvent) => void;
  } = $props();

  let draft = $state<SeriesWithNextEvent>({
    id: "",
    name: "",
    description: "",
    status: null,
    category: null,
    next_event: null,
  });

  $effect(() => {
    if (series?.mode == "edit") {
      dialog.showModal();
      draft = { ...series.data };
    } else if (series?.mode == "add") {
      dialog.showModal();
    } else {
      dialog.close();
    }
  });

  async function commitSeries() {
    if (!draft.name) {
      alert("Name cannot be empty");
      return;
    }

    if (!draft.description) {
      alert("Description cannot be empty");
      return;
    }

    if (series?.mode === "edit" && !draft.id) {
      alert(
        `Can't save series ${draft.name} the id is missing. Are you sure this series has been created?`,
      );
      return;
    }

    onCommit(draft);
  }
</script>

<dialog
  bind:this={dialog}
  onclose={closeModal}
  class="m-auto bg-[#111111] rounded-2xl min-w-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
  onclick={(e) => {
    if (e.target == dialog && mouseDownTarget == dialog) closeModal();
  }}
  onmousedown={(e) => (mouseDownTarget = e.target)}
>
  <h1 class="text-white text-2xl font-bold p-4">
    {series?.mode === "edit" ? "Editing" : "Creating"}
    {draft.name}
  </h1>

  <form action="" class="bg-white/5 rounded-2xl mx-6 mb-6 p-4">
    <fieldset class="flex flex-col">
      <legend class="text-white font-bold text-center text-xl"
        >Series Information</legend
      >

      <label for="" class="text-white flex flex-col mb-1">
        Name:
        <input
          type="text"
          class="w-full px-4 py-2 rounded-xl bg-white/5 text-white focus:outline-none mt-1"
          bind:value={draft.name}
        />
      </label>

      <label for="" class="text-white flex flex-col mb-1">
        Description:
        <textarea
          name=""
          id=""
          class="w-full px-4 py-2 rounded-xl bg-white/5 text-white focus:outline-none mt-1"
          bind:value={draft.description}></textarea>
      </label>

      <label for="" class="text-white">
        Status:
        <select
          bind:value={draft.status}
          name=""
          id=""
          class="w-full px-4 py-2 rounded-xl bg-white/5 text-white focus:outline-none mt-1 cursor-pointer"
        >
          {#each statuses as status}
            <option value={status} class="text-black">{status}</option>
          {/each}
        </select>
      </label>

      <label for="" class="text-white">
        Category:
        <select
          bind:value={draft.category}
          name=""
          id=""
          class="w-full px-4 py-2 rounded-xl bg-white/5 text-white focus:outline-none mt-1 cursor-pointer"
        >
          {#each categories as category}
            <option value={category} class="text-black">{category}</option>
          {/each}
        </select>
      </label>
    </fieldset>

    <div class="flex justify-end gap-3 pl-2 pt-3">
      <button
        type="button"
        onclick={closeModal}
        class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white cursor-pointer"
        >Cancel</button
      >
      <button
        type="button"
        onclick={commitSeries}
        class="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-md text-white cursor-pointer"
        >{series?.mode === "edit" ? "Save" : "Add"}</button
      >
    </div>
  </form>

  <!-- Events Section (Replaced table with EventSelectionCard) -->
  <!-- <SeriesEventList series={seriesData} /> -->
</dialog>
