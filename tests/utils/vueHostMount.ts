import { compile } from "@vue/compiler-dom";
import { compileScript, parse } from "@vue/compiler-sfc";
import * as VueRuntime from "vue";
import { createRenderer, nextTick, type Component } from "vue";

type EventHandler = (event: Record<string, unknown>) => unknown;

class TestNode {
  parent: TestElement | null = null;

  constructor(
    readonly kind: "text" | "comment",
    public text = "",
  ) {}
}

export class TestElement {
  readonly kind = "element" as const;
  readonly __v_skip = true;
  readonly tagName: string;
  readonly props: Record<string, unknown> = {};
  readonly attributes = new Map<string, string>();
  readonly style: Record<string, string> = {};
  readonly listeners = new Map<string, EventHandler[]>();
  readonly childNodes: Array<TestElement | TestNode> = [];
  parent: TestElement | null = null;
  value = "";
  checked = false;
  selected = false;
  disabled = false;
  private _width = 0;
  private _height = 0;
  private canvasInk = false;
  private canvasRevision = 0;
  private canvasContext: Record<string, unknown> | null = null;
  scrollTop = 0;
  scrollHeight = 0;
  focusCount = 0;
  scrollIntoViewCount = 0;

  constructor(tagName: string) {
    this.tagName = tagName.toUpperCase();
    if (this.tagName === "CANVAS") {
      this._width = 300;
      this._height = 150;
    }
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    if (this.tagName === "CANVAS") this.clearCanvasBitmap();
  }

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
    if (this.tagName === "CANVAS") this.clearCanvasBitmap();
  }

  get children(): TestElement[] {
    return this.childNodes.filter((node): node is TestElement => node instanceof TestElement);
  }

  get options(): TestElement[] {
    return this.children.filter((node) => node.tagName === "OPTION");
  }

  get textContent(): string {
    return this.childNodes.map((child) => child instanceof TestElement ? child.textContent : child.text).join("");
  }

  set textContent(value: string) {
    this.childNodes.splice(0, this.childNodes.length, new TestNode("text", value));
    this.childNodes[0]!.parent = this;
  }

  get className(): string {
    return String(this.props.class ?? this.attributes.get("class") ?? "");
  }

  setAttribute(name: string, value: unknown): void {
    this.attributes.set(name, String(value));
    if (name === "disabled") this.disabled = true;
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  getAttributeNames(): string[] {
    return [...this.attributes.keys()];
  }

  hasAttribute(name: string): boolean {
    return this.attributes.has(name);
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
    if (name === "disabled") this.disabled = false;
  }

  addEventListener(name: string, handler: EventHandler): void {
    const listeners = this.listeners.get(name) ?? [];
    listeners.push(handler);
    this.listeners.set(name, listeners);
  }

  removeEventListener(name: string, handler: EventHandler): void {
    const listeners = this.listeners.get(name) ?? [];
    this.listeners.set(name, listeners.filter((listener) => listener !== handler));
  }

  focus(): void {
    hostDocument.activeElement = this;
    this.focusCount += 1;
  }

  scrollIntoView(): void {
    this.scrollIntoViewCount += 1;
  }

  contains(target: unknown): boolean {
    if (target === this) return true;
    return this.children.some((child) => child.contains(target));
  }

  closest(selector: string): TestElement | null {
    let node: TestElement | null = this;
    while (node) {
      if (matches(node, selector)) return node;
      node = node.parent;
    }
    return null;
  }

  querySelectorAll(selector: string): TestElement[] {
    return descendants(this).filter((element) => selector.split(",").some((part) => matches(element, part.trim())));
  }

  querySelector(selector: string): TestElement | null {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  getBoundingClientRect(): DOMRect {
    const width = this.tagName === "CANVAS" ? 320 : 0;
    const height = this.tagName === "CANVAS" ? 220 : 0;
    return { x: 0, y: 0, width, height, top: 0, right: width, bottom: height, left: 0, toJSON: () => ({}) };
  }

  private clearCanvasBitmap(): void {
    this.canvasInk = false;
    this.canvasRevision += 1;
  }

  private markCanvasBitmap(): void {
    this.canvasInk = true;
    this.canvasRevision += 1;
  }

  getContext(): Record<string, unknown> | null {
    if (this.tagName !== "CANVAS") return null;
    if (this.canvasContext) return this.canvasContext;
    const context = {
      canvas: this,
      lineCap: "butt",
      lineJoin: "miter",
      lineWidth: 1,
      strokeStyle: "#000",
      setTransform: () => undefined,
      beginPath: () => undefined,
      closePath: () => undefined,
      moveTo: () => undefined,
      lineTo: () => undefined,
      quadraticCurveTo: () => undefined,
      ellipse: () => undefined,
      arc: () => undefined,
      save: () => undefined,
      restore: () => undefined,
      stroke: () => this.markCanvasBitmap(),
      clearRect: () => this.clearCanvasBitmap(),
      drawImage: (source: TestElement) => {
        this.canvasInk = source.canvasInk;
        this.canvasRevision += 1;
      },
      getImageData: () => {
        const data = new Uint8ClampedArray(Math.max(4, this.width * this.height * 4));
        if (this.canvasInk) {
          for (let index = 3; index < data.length; index += 1600) data[index] = 255;
        }
        return { data };
      },
    };
    this.canvasContext = context;
    return context;
  }

  toDataURL(): string {
    if (this.tagName !== "CANVAS") return "";
    return `data:image/png;test,${this.canvasInk ? "ink" : "blank"}-${this.canvasRevision}`;
  }
}

const descendants = (root: TestElement): TestElement[] => {
  const output: TestElement[] = [];
  const visit = (node: TestElement) => {
    for (const child of node.children) {
      output.push(child);
      visit(child);
    }
  };
  visit(root);
  return output;
};

const matches = (element: TestElement, rawSelector: string): boolean => {
  const selector = rawSelector.trim();
  if (!selector) return false;
  if (selector.startsWith(".")) return element.className.split(/\s+/).includes(selector.slice(1));
  if (selector === "[href]") return element.hasAttribute("href") || "href" in element.props;
  if (selector.startsWith("[tabindex]")) {
    const tabindex = element.getAttribute("tabindex") ?? String(element.props.tabindex ?? "");
    return tabindex !== "" && !selector.includes('tabindex="-1"') || (tabindex !== "-1" && selector.includes(":not"));
  }

  const tag = selector.match(/^[a-z]+/i)?.[0]?.toUpperCase();
  if (tag && element.tagName !== tag) return false;
  if (selector.includes(":not([disabled])") && element.disabled) return false;
  return Boolean(tag);
};

const memoryStorage = () => {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => [...values.keys()][index] ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, String(value)),
  } satisfies Storage;
};

const body = new TestElement("body");
export const hostDocument = {
  activeElement: null as TestElement | null,
  body,
  createElement: (tag: string) => new TestElement(tag),
  querySelector: (selector: string) => selector === "body" ? body : body.querySelector(selector),
};

export const attachClientRender = (component: Component, source: string): void => {
  const descriptor = parse(source).descriptor;
  const template = descriptor.template?.content;
  if (!template) throw new Error("Vue SFC template not found");
  const bindings = compileScript(descriptor, { id: "guided-demo-test" }).bindings;
  const { code } = compile(template, { mode: "function", prefixIdentifiers: true, bindingMetadata: bindings });
  (component as Component & { render?: unknown }).render = new Function("Vue", code)(VueRuntime);
};

const installEnvironment = () => {
  Object.assign(globalThis, {
    HTMLElement: TestElement,
    HTMLInputElement: TestElement,
    HTMLCanvasElement: TestElement,
    document: hostDocument,
    localStorage: memoryStorage(),
    window: {
      clearInterval,
      clearTimeout,
      devicePixelRatio: 1,
      matchMedia: () => ({ matches: false }),
      setInterval,
      setTimeout,
    },
  });
};

installEnvironment();

const renderer = createRenderer<TestElement | TestNode, TestElement>({
  patchProp(element, key, _previous, next) {
    element.props[key] = next;
    if (key === "value") element.value = String(next ?? "");
    if (key === "checked") element.checked = Boolean(next);
    if (key === "disabled") element.disabled = Boolean(next);
    if (key === "class") element.attributes.set("class", String(next ?? ""));
    if (!key.startsWith("on") && !["value", "checked", "disabled", "class"].includes(key)) {
      if (next === null || next === undefined || (next === false && !key.startsWith("aria-"))) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, key.startsWith("aria-") ? String(next) : next === true ? "" : next);
      }
    }
  },
  insert(child, parent, anchor) {
    child.parent = parent;
    const index = anchor ? parent.childNodes.indexOf(anchor) : -1;
    if (index >= 0) parent.childNodes.splice(index, 0, child);
    else parent.childNodes.push(child);
  },
  remove(child) {
    const parent = child.parent;
    if (!parent) return;
    const index = parent.childNodes.indexOf(child);
    if (index >= 0) parent.childNodes.splice(index, 1);
    child.parent = null;
  },
  createElement: (tag) => new TestElement(tag),
  createText: (text) => new TestNode("text", text),
  createComment: (text) => new TestNode("comment", text),
  setText: (node, text) => { node.text = text; },
  setElementText: (element, text) => { element.textContent = text; },
  parentNode: (node) => node.parent,
  nextSibling(node) {
    const siblings = node.parent?.childNodes;
    if (!siblings) return null;
    return siblings[siblings.indexOf(node) + 1] ?? null;
  },
  querySelector: (selector) => hostDocument.querySelector(selector),
  setScopeId: (element, id) => element.setAttribute(id, ""),
  cloneNode: (node) => node,
  insertStaticContent(content, parent, anchor) {
    const node = new TestNode("text", content);
    node.parent = parent;
    const index = anchor ? parent.childNodes.indexOf(anchor) : -1;
    if (index >= 0) parent.childNodes.splice(index, 0, node);
    else parent.childNodes.push(node);
    return [node, node];
  },
});

const eventProp = (name: string) => `on${name[0]?.toUpperCase()}${name.slice(1)}`;

export const mountVue = async (component: Component, props: Record<string, unknown> = {}) => {
  installEnvironment();
  body.childNodes.splice(0, body.childNodes.length);
  hostDocument.activeElement = null;
  const root = new TestElement("div");
  root.parent = body;
  body.childNodes.push(root);
  const app = renderer.createApp(component, props);
  app.provide(Symbol.for("v-scx"), { modules: new Set<string>() });
  app.mount(root);
  await nextTick();

  const all = () => [root, ...descendants(root), ...descendants(body).filter((node) => !root.contains(node))];
  const findByText = (text: string, tag?: string) => all().find((element) =>
    (!tag || element.tagName === tag.toUpperCase()) && element.textContent.replace(/\s+/g, " ").includes(text),
  );
  const findButton = (text: string) => all().find((element) =>
    element.tagName === "BUTTON" && element.textContent.replace(/\s+/g, " ").includes(text),
  );
  const trigger = async (element: TestElement, name: string, extra: Record<string, unknown> = {}) => {
    if (element.disabled) return;
    let prevented = false;
    const event = {
      currentTarget: element,
      target: element,
      preventDefault: () => { prevented = true; },
      stopPropagation: () => undefined,
      ...extra,
    };
    for (const listener of element.listeners.get(name) ?? []) listener(event);
    const handler = element.props[eventProp(name)];
    if (Array.isArray(handler)) handler.forEach((item) => (item as EventHandler)(event));
    else if (typeof handler === "function") (handler as EventHandler)(event);
    await nextTick();
    await Promise.resolve();
    return prevented;
  };
  const setValue = async (element: TestElement, value: string) => {
    element.value = value;
    await trigger(element, "input", { target: element });
  };

  return {
    app,
    root,
    all,
    findByText,
    findButton,
    trigger,
    setValue,
    unmount: () => app.unmount(),
  };
};
