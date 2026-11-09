import { chromium } from "playwright";
import { mkdir, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "artifacts");
await mkdir(output, { recursive: true });

// Intentionally fixed destinations: no arbitrary URLs, passwords, personal data,
// credit-card details, account logins, or authenticated screenshots.
const CASES = {
  demo: { url: "https://www.selenium.dev/selenium/web/web-form.html" },
  azure: { url: "https://azure.microsoft.com/en-us/free/students/" },
  oracle: { url: "https://www.oracle.com/cloud/free/" },
};
const selection = process.env.BROWSER_TARGET || "all";
if (!["all", ...Object.keys(CASES)].includes(selection)) {
  throw new Error("Invalid BROWSER_TARGET; must be all, demo, azure or oracle");
}

const selected = selection === "all" ? Object.keys(CASES) : [selection];
const browser = await chromium.launch({ headless: true });
const records = [];

try {
  for (const id of selected) {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
      locale: "en-US",
      timezoneId: "UTC",
      acceptDownloads: false,
    });
    const result = { id, requestedUrl: CASES[id].url };
    try {
      const response = await page.goto(CASES[id].url, {
        waitUntil: "domcontentloaded",
        timeout: 35000,
      });
      result.httpStatus = response?.status() ?? null;
      result.title = await page.title();
      result.finalUrl = page.url();

      if (id === "demo") {
        await page.locator('input[name="my-text"]').fill("Miki-BadBrowserUse public demo");
        await page.getByRole("button", { name: "Submit" }).click();
        result.finalUrl = page.url();
        result.heading = await page.locator("h1").first().textContent({ timeout: 5000 }).catch(() => null);
        result.formSubmitted = /received/i.test(result.heading ?? "");
      } else {
        await page.waitForTimeout(1200);
        result.heading = await page.locator("h1").first().textContent({ timeout: 3500 }).catch(() => null);
        const links = await page.locator("a").evaluateAll((elements) =>
          elements
            .filter((el) => el.textContent && el.href)
            .map((el) => ({ text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 60), href: el.href }))
            .filter((el) => /(get started|start free|sign up|create account|try free|students)/i.test(el.text))
            .slice(0, 8)
        );
        // Discard query strings, which can hold tracking or session parameters.
        result.publicCallsToAction = links.map((x) => {
          try {
            const url = new URL(x.href);
            return { text: x.text, url: url.origin + url.pathname };
          } catch {
            return { text: x.text, url: "(invalid URL)" };
          }
        });
      }
      result.screenshot = id + ".png";
      await page.screenshot({ path: path.join(output, result.screenshot), fullPage: false });
    } catch (error) {
      result.error = String(error).slice(0, 800);
      try {
        result.screenshot = id + "-error.png";
        await page.screenshot({ path: path.join(output, result.screenshot), fullPage: false });
      } catch {
        result.screenshot = null;
      }
    } finally {
      await page.close();
    }
    console.log(JSON.stringify(result));
    records.push(result);
  }
} finally {
  await browser.close();
}

await writeFile(path.join(output, "results.json"), JSON.stringify(records, null, 2) + "\n");

const markdown = [
  "## Miki-BadBrowserUse public browser probe",
  "",
  "| Site | HTTP | Heading | Interaction |",
  "|---|---|---|---|",
  ...records.map((r) => [
    r.id,
    String(r.httpStatus ?? "N/A"),
    String(r.heading ?? r.error ?? "N/A").replace(/\|/g, "/").replace(/\n/g, " ").slice(0, 90),
    r.id === "demo" ? (r.formSubmitted ? "Public form submitted" : "Form test failed") : "Read-only",
  ].join(" | ").replace(/^/, "| ").concat(" |")),
  "",
  "This task visits public URLs only. No login, academic verification, or payment is attempted.",
  "",
].join("\n");
await writeFile(path.join(output, "summary.md"), markdown);
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown);
}

if (records.some((r) => r.id === "demo" && !r.formSubmitted)) process.exitCode = 1;
