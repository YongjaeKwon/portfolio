import { ref } from "vue";
import type { FocusTrackId } from "@/data/portfolio";

const trackIds = new Set<FocusTrackId>(["frontend", "product", "fullstack"]);

const DEFAULT_TRACK: FocusTrackId = "frontend";

const readTrackFromUrl = (): FocusTrackId => {
  if (typeof window === "undefined") return DEFAULT_TRACK;
  const value = new URLSearchParams(window.location.search).get("track");
  return trackIds.has(value as FocusTrackId) ? (value as FocusTrackId) : DEFAULT_TRACK;
};

const activeTrack = ref<FocusTrackId>(readTrackFromUrl());
let listening = false;

const writeTrackToUrl = (track: FocusTrackId) => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (track === DEFAULT_TRACK) {
    url.searchParams.delete("track");
  } else {
    url.searchParams.set("track", track);
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
    writeTrackToUrl(track);
  };

  return { activeTrack, setActiveTrack };
}
