import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "default" });
test.setTimeout(60_000);

async function readySculpture(page: Page) {
  await page.goto("/");
  const sculpture = page.locator('[data-sculpture-state="ready"]');
  await expect(sculpture).toBeVisible({ timeout: 45_000 });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  return sculpture;
}

test("reduced motion stops idle rendering and keyboard controls rotate the actual image", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const sculpture = await readySculpture(page);
  await expect(sculpture).toHaveAttribute("data-motion", "paused");
  await expect(
    page.getByRole("button", { name: "Pause sculpture motion" }),
  ).toHaveCount(0);
  const canvas = sculpture.locator("canvas");
  const before = await canvas.screenshot();
  const unchanged = await canvas.screenshot();
  expect(unchanged.equals(before)).toBe(true);

  await page.getByRole("button", { name: "Rotate sculpture right" }).focus();
  await page.keyboard.press("Enter");
  await expect
    .poll(async () => (await canvas.screenshot()).equals(before))
    .toBe(false);
});

test("motion pauses explicitly, offscreen and in a hidden document", async ({
  page,
}) => {
  const sculpture = await readySculpture(page);
  await expect(sculpture).toHaveAttribute("data-motion", "active");
  await page.getByRole("button", { name: "Pause sculpture motion" }).click();
  await expect(sculpture).toHaveAttribute("data-motion", "paused");
  await page.getByRole("button", { name: "Resume sculpture motion" }).click();
  await expect(sculpture).toHaveAttribute("data-motion", "active");

  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(sculpture).toHaveAttribute("data-motion", "paused");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(sculpture).toHaveAttribute("data-motion", "active");

  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(sculpture).toHaveAttribute("data-motion", "paused");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(sculpture).toHaveAttribute("data-motion", "active");
});

test("losing the real WebGL context restores the still illustration", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const sculpture = await readySculpture(page);
  await sculpture.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
    const context = canvas.getContext("webgl2");
    if (!context) throw new Error("Expected a live WebGL2 context");
    const extension = context.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("Context-loss extension unavailable");
    extension.loseContext();
  });
  await expect(page.locator('[data-sculpture-state="fallback"]')).toBeVisible();
  await expect(page.getByRole("status")).toContainText("still illustration");
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("mobile sculpture caps resolution and permits vertical touch scrolling", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  const sculpture = page.locator('[data-sculpture-state="ready"]');
  await expect(sculpture).toBeVisible({ timeout: 45_000 });
  await sculpture.scrollIntoViewIfNeeded();
  const ratio = await sculpture
    .locator("canvas")
    .evaluate(
      (canvas: HTMLCanvasElement) =>
        canvas.width / canvas.getBoundingClientRect().width,
    );
  expect(ratio).toBeLessThanOrEqual(1.26);
  const bounds = await sculpture.boundingBox();
  expect(bounds).not.toBeNull();
  const startY = Math.min(bounds!.y + bounds!.height * 0.65, 690);
  const startX = bounds!.x + bounds!.width / 2;
  const before = await page.evaluate(() => window.scrollY);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: startX, y: startY }],
  });
  for (let step = 1; step <= 5; step++) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: startX, y: startY - step * 28 }],
    });
  }
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(before + 40);
  await context.close();
});
