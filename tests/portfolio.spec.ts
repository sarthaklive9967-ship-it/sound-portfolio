import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function withoutWebGL(page: Page) {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (
        type === "webgl" ||
        type === "webgl2" ||
        type === "experimental-webgl"
      )
        return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
}

test("shows the confirmed content and real destinations without invented work", async ({
  page,
}) => {
  await withoutWebGL(page);
  await page.goto("/");
  await expect(page).toHaveTitle(/Sound.*Developer/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Sound." }),
  ).toBeVisible();
  await expect(
    page.getByText("Building digital experiences that feel different."),
  ).toBeVisible();
  await expect(page.locator("#about")).toContainText(
    "I'm a developer and digital creator",
  );
  for (const name of [
    "Web Development",
    "UI/UX Design",
    "Minecraft Development",
    "Discord Development",
  ]) {
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }
  await expect(
    page.getByRole("heading", { name: /selected work|projects/i }),
  ).toHaveCount(0);
  const githubLinks = page.getByRole("link", { name: /Connect on GitHub/i });
  await expect(githubLinks).toHaveCount(2);
  for (const link of await githubLinks.all()) {
    await expect(link).toHaveAttribute(
      "href",
      "https://github.com/sarthaklive9967-ship-it",
    );
  }
  await expect(page.locator("footer")).toContainText(
    "© 2026 Sound | Developer",
  );
});

test("section links navigate and current section is indicated", async ({
  page,
}) => {
  await withoutWebGL(page);
  await page.goto("/");
  await page.getByRole("link", { name: "Explore My Expertise" }).click();
  await expect(page).toHaveURL(/#expertise$/);
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Expertise", exact: true }),
  ).toHaveAttribute("aria-current", "location");
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(
    page.getByRole("heading", { name: "Have something interesting in mind?" }),
  ).toBeInViewport();
});

test("mobile menu traps focus, closes on Escape and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await withoutWebGL(page);
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open navigation" });
  await open.click();
  const dialog = page.getByRole("dialog", { name: "Navigation" });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
  await expect
    .poll(() =>
      dialog.evaluate((node) => node.contains(document.activeElement)),
    )
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await dialog.getByRole("link", { name: "About", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about")).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
    .not.toBe("hidden");
});

test("mobile menu releases scroll lock when resized to desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await withoutWebGL(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(
    page.getByRole("dialog", { name: "Navigation" }),
  ).not.toBeVisible();
  await expect
    .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
    .not.toBe("hidden");
});

test("narrow phones, tablets and desktop have no horizontal overflow", async ({
  page,
}) => {
  await withoutWebGL(page);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Sound.", exact: true }),
    ).toBeVisible();
  }
});

test("reduced motion leaves all content readable and disables smooth scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await withoutWebGL(page);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Sound.", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    )
    .toBe("auto");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(
    page.getByRole("heading", { name: "Have something interesting in mind?" }),
  ).toBeVisible();
});

test("WebGL unavailable preserves a composed fallback and functioning page", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await withoutWebGL(page);
  await page.goto("/");
  await expect(page.locator('[data-sculpture-state="fallback"]')).toBeVisible({
    timeout: 20_000,
  });
  await page.getByRole("link", { name: "Explore My Expertise" }).click();
  await expect(page).toHaveURL(/#expertise$/);
  expect(errors).toEqual([]);
});

test("real WebGL scene renders without application errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const scene = page.locator('[data-sculpture-state="ready"]');
  await expect(scene).toBeVisible({ timeout: 45_000 });
  const canvas = scene.locator("canvas");
  await expect(canvas).toBeVisible();
  const bounds = await canvas.boundingBox();
  expect(bounds?.width).toBeGreaterThan(200);
  expect(bounds?.height).toBeGreaterThan(200);
  expect(errors).toEqual([]);
});

test("desktop and mobile navigation meet automated accessibility checks", async ({
  page,
}) => {
  await withoutWebGL(page);
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  // Measure the readable resting state, not a partially transparent reveal frame.
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {})));
  });
  const desktop = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(desktop.violations).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().map((animation) => animation.finished.catch(() => {})));
  });
  const mobile = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(mobile.violations).toEqual([]);
});

test("server-rendered content and anchors remain usable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await expect(
    page.getByRole("heading", { name: "Sound.", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#about")).toContainText(
    "developer and digital creator",
  );
  await page.getByRole("link", { name: "Explore My Expertise" }).click();
  await expect(page).toHaveURL(/#expertise$/);
  await context.close();
});

test("expertise areas expand and collapse from the keyboard", async ({
  page,
}) => {
  await withoutWebGL(page);
  await page.goto("/");
  const row = page
    .locator("details")
    .filter({
      has: page.getByRole("heading", {
        name: "Minecraft Development",
        exact: true,
      }),
    });
  const summary = row.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(row).toHaveAttribute("open", "");
  await expect(row.getByRole("list")).toContainText("Minecraft resource packs");
  await page.keyboard.press("Enter");
  await expect(row).not.toHaveAttribute("open", "");
});

test("keyboard skip link moves focus past the navigation", async ({ page }) => {
  await withoutWebGL(page);
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("metadata assets and missing-page recovery work", async ({
  page,
  request,
}) => {
  const image = await request.get("/opengraph-image");
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toContain("image/png");
  const icon = await request.get("/icon.svg");
  expect(icon.ok()).toBe(true);
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("User-Agent: *");
  await withoutWebGL(page);
  const missing = await page.goto("/this-page-does-not-exist");
  expect(missing?.status()).toBe(404);
  await page.getByRole("link", { name: "Back to Sound" }).click();
  await expect(
    page.getByRole("heading", { name: "Sound.", exact: true }),
  ).toBeVisible();
});
