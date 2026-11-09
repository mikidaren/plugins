import { chromium } from "playwright";
import { mkdir, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";

const outputDir = "artifacts/browser-smoke";
await mkdir(outputDir, { recursive: true });

const targets = [
  { id: "example", url: "https://example.com/" },
  { id: "azure-students", url: "https://azure.microsoft.com/en-us/free/students/" },
  { id: "oracle-free", url: "https://www.oracle.com/cloud/free/" },
];

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const target of targets) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: "en-US" });
    const result = { id: target.id, requestedUrl: target.url };
    try {
      const response = await page.goto(target.url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(1500);
      result.httpStatus = response?.status() ?? null;
      result.finalUrl = page.url();
      result.title = await page.title();
      result.heading = await page.locator("h1").first().textContent({ timeout: 3000 }).catch(() => null);
      const filename = target.id + ".png";
      await page.screenshot({ path: path.join(outputDir, filename), fullPage: false });
      result.screenshot = filename;
    } catch (error) {
      result.error = String(error);
      try {
        const filename = target.id + "-error.png";
        await page.screenshot({ path: path.join(outputDir, filename), fullPage: false });
        result.screenshot = filename;
      } catch {
        // No screenshot is available on a failed navigation.
      }
    } finally {
      await page.close();
    }
    results.push(result);
    console.log(JSON.stringify(result));
  }
} finally {
  await browser.close();
}

await writeFile(path.join(outputDir, "results.json"), JSON.stringify(results, null, 2) + "\n");
const summary = [
  "## Playwright browser smoke test",
  "",
  "| Target | Status | Title | Screenshot |",
  "|---|---|---|---|",
  ...results.map((r) => [
    "| " + r.id,
    String(r.httpStatus ?? "ERROR"),
    (r.title ?? r.error ?? "").replaceAll("|", "/").slice(0, 100),
    r.screenshot ?? "none",
  ].join(" | ") + " |"),
  "",
  "Headless Chromium; public pages only. No credentials, forms, payment details, or private pages were accessed.",
].join("\n");
await writeFile(path.join(outputDir, "summary.md"), summary + "\n");
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
}
const baseline = results.find((r) => r.id === "example");
if (!baseline || !(baseline.httpStatus >= 200 && baseline.httpStatus < 400) || !baseline.screenshot) {
  console.error("Playwright browser baseline failed");
  process.exitCode = 1;
}
