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

  assert.match(ppsFrontend.detail.caseStudy.problem, /화면/);
  assert.match(ppsBackend.detail.caseStudy.problem, /HTTP 요청/);
  assert.match(ppsAll.detail.caseStudy.problem, /300~400건/);
  assert.match(tsmsFrontend.detail.caseStudy.outcome[0], /119개 학교/);
  assert.equal(tsmsBackend.detail.caseStudy.outcome[0], "공통 연계 경로를 25개 화면에서 사용합니다.");
  assert.notEqual(ppsFrontend.detail.caseStudy.problem, ppsBackend.detail.caseStudy.problem);

  console.log("Project presentation verification passed.");
} finally {
  await server.close();
}
