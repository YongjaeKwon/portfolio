import { ref } from "vue";
import type { FocusTrackId } from "@/data/portfolio";

const trackIds = new Set<FocusTrackId>(["frontend", "product", "fullstack"]);

const DEFAULT_TRACK: FocusTrackId = "frontend";

const replaceTrackInUrl = (track: FocusTrackId) => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (track === DEFAULT_TRACK) {
    url.searchParams.delete("track");
  } else {
    url.searchParams.set("track", track);
  }
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
};

const readTrackFromUrl = (): FocusTrackId => {
  if (typeof window === "undefined") return DEFAULT_TRACK;
  const value = new URLSearchParams(window.location.search).get("track");
  const normalized = value?.toLowerCase();
  const track = trackIds.has(normalized as FocusTrackId)
    ? (normalized as FocusTrackId)
    : DEFAULT_TRACK;
  if (value !== null && (value !== track || track === DEFAULT_TRACK)) {
    replaceTrackInUrl(track);
  }
  return track;
};

const activeTrack = ref<FocusTrackId>(readTrackFromUrl());
let listening = false;

const writeTrackToUrl = (track: FocusTrackId) => {
  replaceTrackInUrl(track);
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
    writeTrackToUrl(track);
  };

  return { activeTrack, setActiveTrack };
}
