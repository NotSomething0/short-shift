import type { Tables, TablesInsert, TablesUpdate } from "../../types/supabase";

export type Series = Tables<"series">;
export type SeriesInsert = TablesInsert<"series">;
export type SeriesUpdate = TablesUpdate<"series">;
export type SeriesList = Series[];

export { createSeries } from "./createSeries";
export { getSeriesById } from "./getSeriesById";
export { getAllSeries } from "./getAllSeries";
export { getSeriesOptions } from "./getSeriesOptions";
export { updateSeries } from "./updateSeries";
export { deleteSeriesById } from "./deleteSeriesById";
