import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "../../types/supabase.ts";

export type Event = Tables<"events">;
export type EventInsert = TablesInsert<"events">;
export type EventUpdate = TablesUpdate<"events">;
export type Events = Event[];

export { createEvent } from "./createEvent.ts";
export { getAllEvents } from "./getAllEvents.ts";
export { getEventsBySeriesId } from "./getEventsBySeriesId.ts";
export { updateEvent } from "./updateEvent.ts";
export { deleteEventById } from "./deleteEventById.ts";
