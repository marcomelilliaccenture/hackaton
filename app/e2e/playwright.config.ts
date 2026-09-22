import { defineConfig, devices } from "@playwright/test";

/**
 * Configurazione della verifica end-to-end.
 *
 * Un solo browser (Chromium) e un solo profilo mobile: la persona e' su uno
 * smartphone, in piedi, all'ufficio postale. Testare tre browser in cinque ore
 * costa tempo e non cambia nessuna delle risposte che ci servono.
 *
 * Avvia da solo `npm run dev` in ../app e riusa un server gia' attivo: durante
 * lo sprint il dev server e' quasi sempre gia' su.
 */
export default defineConfig({
  testDir: "./tests",
  outputDir: "./.artifacts",
  fullyParallel: true,
  forbidOnly: true,
  retries: 0, // un test instabile va riparato, non ritentato
  reporter: [["list"], ["html", { outputFolder: "./.report", open: "never" }]],

  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",
    // Il francese e' la lingua di Fatou: e' la configurazione in cui la demo
    // viene mostrata, quindi e' quella che verifichiamo.
    locale: "fr-FR",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
    {
      // Serve solo alle evidenze: gli screenshot prima/dopo e la clip si
      // guardano su un proiettore, non su un telefono.
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],

  webServer: {
    command: "npm run dev",
    cwd: "../app",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
