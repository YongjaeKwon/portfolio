import { ref } from "vue";
import type { FocusTrackId } from "@/data/portfolio";

const trackIds = new Set<FocusTrackId>(["all", "frontend", "backend"]);
const DEFAULT_TRACK: FocusTrackId = "all";

const readTrackFromUrl = (): FocusTrackId => {
  if (typeof window === "undefined") return DEFAULT_TRACK;

  const params = new URLSearchParams(window.location.search);
  const value = (params.get("focus") ?? params.get("track") ?? "").toLowerCase();
  return trackIds.has(value as FocusTrackId) ? (value as FocusTrackId) : DEFAULT_TRACK;
};

const activeTrack = ref<FocusTrackId>(readTrackFromUrl());
let listening = false;

const replaceTrackInUrl = (track: FocusTrackId) => {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.delete("track");
  if (track === DEFAULT_TRACK) {
    url.searchParams.delete("focus");
  } else {
    url.searchParams.set("focus", track);
  }
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
};

export function useFocusTrack() {
  if (typeof window !== "undefined" && !listening) {
    window.addEventListener("popstate", () => {
      activeTrack.value = readTrackFromUrl();
    });
    listening = true;
  }

  const setActiveTrack = (track: FocusTrackId) => {
    activeTrack.value = track;
    replaceTrackInUrl(track);
  };

  return { activeTrack, setActiveTrack };
}
