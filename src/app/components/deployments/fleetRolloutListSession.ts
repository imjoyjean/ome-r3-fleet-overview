/** In-memory only: survives client-side routing, resets on full page refresh. */

let listPopulatedThisLoad = false;

export function isFleetRolloutListPopulated(): boolean {
  return listPopulatedThisLoad;
}

export function setFleetRolloutListPopulated(value: boolean): void {
  listPopulatedThisLoad = value;
}
