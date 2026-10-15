import assert from "node:assert/strict";
import { createServer } from "vite";

const server = await createServer({
  appType: "custom",
  logLevel: "silent",
  server: { middlewareMode: true },
});

try {
  const { featuredProjects } = await server.ssrLoadModule("/src/data/portfolio.ts");
  const { presentProject } = await server.ssrLoadModule("/src/utils/projectPresentation.ts");

  const pps = featuredProjects.find((project) => project.id === "pps");
  const tsms = featuredProjects.find((project) => project.id === "tsms");

  assert.ok(pps, "PPS project fixture is missing");
  assert.ok(tsms, "TSMS project fixture is missing");

  const ppsFrontend = presentProject(pps, "frontend");
  const ppsBackend = presentProject(pps, "backend");
  const ppsAll = presentProject(pps, "all");
  const tsmsFrontend = presentProject(tsms, "frontend");
  const tsmsBackend = presentProject(tsms, "backend");

  assert.match(ppsFrontend.card.result, /Vue/);
  assert.match(ppsBackend.card.result, /재발송 제한/);
  assert.match(ppsAll.card.result, /300~400건/);
  assert.match(tsmsFrontend.card.result, /71개교/);
  assert.match(tsmsBackend.card.result, /53초.*1.2초/);
  assert.notEqual(ppsFrontend.card.result, ppsBackend.card.result);
  // Selecting a role must not drop the full project evidence from its detail view.
  assert.deepEqual(ppsFrontend.detail.workPoints, ppsAll.detail.workPoints);

  console.log("Project presentation verification passed.");
} finally {
  await server.close();
}
