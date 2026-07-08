import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Buffer } from "node:buffer";
import ts from "typescript";

const source = readFileSync(new URL("../src/utils/contactEmail.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2022,
  },
});

const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
const contactEmail = await import(moduleUrl);

assert.equal(contactEmail.createMailtoUrl("me@example.com"), "mailto:me@example.com");

const gmailUrl = new URL(contactEmail.createGmailComposeUrl("me@example.com"));
assert.equal(gmailUrl.origin, "https://mail.google.com");
assert.equal(gmailUrl.pathname, "/mail/");
assert.equal(gmailUrl.searchParams.get("view"), "cm");
assert.equal(gmailUrl.searchParams.get("fs"), "1");
assert.equal(gmailUrl.searchParams.get("to"), "me@example.com");

assert.equal(contactEmail.shouldShowMailFallback(false), true);
assert.equal(contactEmail.shouldShowMailFallback(true), false);
