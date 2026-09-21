import type { Tables } from "../../types/supabase.ts";

export type Event = Tables<'events'>
export type Events = Event[];

export { getAllEvents } from "./getAllEvents.ts";
export { getEventsBySeriesId } from "./getEventsBySeriesId.ts";
export { createEvent } from "./createEvent.ts";
export { updateEvent } from "./updateEvent.ts";
