import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import ProjectsView from "../src/views/ProjectsView.vue";
import { attachClientRender, mountVue } from "./utils/vueHostMount";

vi.mock("@/i18n/locale", () => ({ isEn: false, t: (ko: unknown) => ko }));
vi.mock("@/composables/useFocusTrack", async () => {
  const { ref, computed } = await import("vue");
  const { focusTracks } = await import("../src/data/portfolio.ko");
  return { useFocusTrack: () => ({
    activeTrack: ref("all"),
    activeTrackData: computed(() => focusTracks.find((track) => track.id === "all")!),
  }) };
});
vi.mock("@/components/ProjectTechStack.vue", () => ({ default: { render: () => null } }));
vi.mock("@/components/ProjectDetailModal.vue", () => ({ default: { render: () => null } }));
vi.mock("@/components/demos/ProjectDemoPanel.vue", async () => {
  const { h } = await import("vue");
  return { __esModule: true, default: {
    props: ["projectId"],
    setup: (props: { projectId: string }) => () => h("div", { "data-open-demo": props.projectId }),
  } };
});

attachClientRender(ProjectsView, readFileSync(
  fileURLToPath(new URL("../src/views/ProjectsView.vue", import.meta.url)), "utf8",
));

const mountLink = async (search: string) => {
  let currentUrl = new URL(`https://www.yongjaekwon.com/${search}`);
  const replaceState = vi.fn((_state: unknown, _title: string, url: string) => {
    currentUrl = new URL(url, currentUrl);
    Object.assign(window, { location: currentUrl });
  });
  const wrapper = await mountVue(defineComponent({
    setup() {
      Object.assign(window, { location: currentUrl, history: { replaceState } });
      Object.assign(globalThis, { history: window.history });
      return () => h(ProjectsView);
    },
  }));
  await vi.dynamicImportSettled();
  await nextTick();
  return { wrapper, replaceState, url: () => currentUrl };
};

describe("PDF project demo links", () => {
  it.each(["ticketrush", "ssafast", "ddoing", "modac"])("opens only the requested %s demo", async (id) => {
    const { wrapper } = await mountLink(`?lang=ko&demo=${id}`);
    const panels = wrapper.all().filter((element) => element.hasAttribute("data-open-demo"));
    expect(panels.map((panel) => panel.getAttribute("data-open-demo"))).toEqual([id]);
    wrapper.unmount();
  });

  it.each(["", "?demo=unknown", "?demo=reachrich"])("leaves demos closed for %s", async (search) => {
    const { wrapper } = await mountLink(search);
    expect(wrapper.all().some((element) => element.hasAttribute("data-open-demo"))).toBe(false);
    wrapper.unmount();
  });

  it("closes the linked demo and removes only its query parameter", async () => {
    const { wrapper, replaceState, url } = await mountLink("?lang=ko&demo=modac&source=pdf");
    const close = wrapper.all().find((element) => element.getAttribute("aria-label") === "프로젝트 데모 닫기");
    expect(close).toBeTruthy();
    await wrapper.trigger(close!, "click");
    expect(wrapper.all().some((element) => element.hasAttribute("data-open-demo"))).toBe(false);
    expect(replaceState).toHaveBeenCalledOnce();
    expect(url().search).toBe("?lang=ko&source=pdf");
    expect(url().hash).toBe("#projects");
    wrapper.unmount();
  });
});
