import { expect, test } from "@playwright/test";

test("la pantalla de prueba no tiene texto y el botón responde", async ({ page }) => {
  await page.goto("/");
  const boton = page.getByTestId("jugar");
  await expect(boton).toBeVisible();
  // Adriel no lee: no puede haber texto visible.
  expect((await page.locator("body").innerText()).trim()).toBe("");
  const caja = (await boton.boundingBox())!;
  expect(caja.width).toBeGreaterThanOrEqual(64);
  expect(caja.height).toBeGreaterThanOrEqual(64);
  // El botón late todo el tiempo, así que no esperamos a que se quede quieto.
  await boton.tap({ force: true });
  await expect(page.locator(".teddy.feliz")).toBeVisible();
});

test("es instalable: manifest, íconos y service worker", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  const manifest = await (await request.get(href!)).json();
  expect(manifest.display).toBe("standalone");
  for (const icono of manifest.icons) {
    expect((await request.get("/" + icono.src)).ok()).toBe(true);
  }
  await page.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration())?.active);
});

test("funciona sin internet después de la primera carga", async ({ page, context }) => {
  await page.goto("/");
  await page.waitForFunction(() => navigator.serviceWorker.controller?.state === "activated");
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByTestId("jugar")).toBeVisible();
});
