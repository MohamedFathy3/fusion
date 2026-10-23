import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { join, relative } from "node:path";
import { createServer } from "node:net";
import { randomUUID } from "node:crypto";

const root = process.cwd();
await mkdir(join(root, "data"), { recursive: true });
const dataDir = await mkdtemp(join(root, "data", "api-test-"));
const databaseUrl = `file:${relative(root, join(dataDir, "nested", "db", "fusionxtech.sqlite")).replaceAll("\\", "/")}`;
const databaseEnv = { ...process.env, DATABASE_URL: databaseUrl, DATA_DIR: dataDir };
try {
  execFileSync(process.execPath, [join(root, "scripts", "migrate-database.mjs")], {
    cwd: root,
    env: databaseEnv,
    stdio: "inherit",
  });
} catch (error) {
  await rm(dataDir, { recursive: true, force: true });
  throw error;
}
const port = await new Promise((resolve, reject) => {
  const server = createServer();
  server.once("error", reject);
  server.listen(0, "127.0.0.1", () => {
    const address = server.address();
    server.close((error) => (error ? reject(error) : resolve(address.port)));
  });
});
const password = `integration-${randomUUID()}-Strong!`;
let serverOutput = "";
const sessionSecret = randomUUID() + randomUUID();
function startServer() {
  const child = spawn(process.execPath, [".output/server/index.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      HOST: "127.0.0.1",
      PORT: String(port),
      NITRO_HOST: "127.0.0.1",
      NITRO_PORT: String(port),
      ADMIN_EMAIL: "admin@admin.com",
      ADMIN_PASSWORD: password,
      SESSION_SECRET: sessionSecret,
      DATA_DIR: dataDir,
      DATABASE_URL: databaseUrl,
      PUBLIC_SITE_URL: "https://fusionteck-test.invalid",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (data) => (serverOutput += data));
  child.stderr.on("data", (data) => (serverOutput += data));
  return child;
}
async function stopServer(child) {
  child.kill("SIGTERM");
  await new Promise((resolve) => {
    if (child.exitCode !== null) return resolve();
    child.once("exit", resolve);
    setTimeout(resolve, 2_000).unref();
  });
}
let server = startServer();
const base = `http://127.0.0.1:${port}`;

async function waitUntilReady() {
  const started = Date.now();
  while (Date.now() - started < 15_000) {
    try {
      const response = await fetch(`${base}/api/health`);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    if (server.exitCode !== null) throw new Error(`Server exited early.\n${serverOutput}`);
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Server did not become ready.\n${serverOutput}`);
}

async function expectStatus(response, status, label) {
  assert.equal(response.status, status, `${label}: expected ${status}, got ${response.status}`);
}

try {
  await waitUntilReady();

  const health = await fetch(`${base}/api/health`).then((response) => response.json());
  assert.equal(health.ok, true);
  assert.equal(health.runtime, "node");
  assert.equal(health.storage, "sqlite");

  const publicConfig = await fetch(`${base}/api/site`).then((response) => response.json());
  assert.equal(
    publicConfig.sections.services,
    true,
    "Technology services should be shown on the homepage",
  );
  assert.equal(publicConfig.brand.name, "Fusion X.tech");
  assert.equal(publicConfig.sections.portfolio, true);
  assert.equal(publicConfig.sections.clients, true);
  assert.equal(
    publicConfig.portfolio.length,
    31,
    "Imported websites and UI/UX projects should be published",
  );
  assert.equal(
    publicConfig.clients.length,
    20,
    "Verified project client logos should be published",
  );
  assert.equal(
    publicConfig.portfolio.filter((project) => project.projectCategory === "websites").length,
    25,
  );
  assert.equal(
    publicConfig.portfolio.filter((project) => project.projectCategory === "ui-ux").length,
    6,
  );
  const homePage = await fetch(base).then((response) => response.text());
  assert.ok(homePage.includes("Fusion X.tech"), "Homepage should render the new brand");
  assert.ok(!homePage.includes("Viral Zoom"), "Homepage should not contain the previous brand");
  assert.ok(homePage.includes('type="video/mp4"'), "Homepage hero should render an MP4 video");
  assert.ok(
    !homePage.includes("whatsapp-float"),
    "Floating WhatsApp button should be hidden without a number",
  );
  const servicePage = await fetch(`${base}/services/web-app-development`).then((response) =>
    response.text(),
  );
  assert.ok(servicePage.includes("Websites &amp; Applications"));
  assert.ok(servicePage.includes("Fusion X.tech"));

  const deniedWrite = await fetch(`${base}/api/site`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(publicConfig),
  });
  await expectStatus(deniedWrite, 401, "Unauthenticated content write");

  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://attacker.invalid",
    },
    body: JSON.stringify({ email: "admin@admin.com", password }),
  });
  await expectStatus(login, 403, "Cross-origin admin login");

  const trustedLogin = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://fusionteck-test.invalid",
    },
    body: JSON.stringify({ email: "admin@admin.com", password }),
  });
  await expectStatus(trustedLogin, 200, "Admin login through configured public origin");
  const setCookie = trustedLogin.headers.get("set-cookie");
  assert.ok(setCookie?.includes("HttpOnly"), "Session cookie should be HttpOnly");
  const cookie = setCookie.split(";")[0];
  const adminConfig = await fetch(`${base}/api/site`, { headers: { cookie } }).then((response) =>
    response.json(),
  );
  assert.equal(adminConfig.portfolio.length, 31, "Admin should see all imported projects");
  assert.equal(adminConfig.clients.length, 20, "Admin should see all imported client logos");

  const contact = await fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: base },
    body: JSON.stringify({
      name: "Integration Visitor",
      email: "visitor@example.com",
      subject: "Website project",
      message: "Please contact me about a new site.",
      website: "https://fusionteck.online/",
    }),
  });
  await expectStatus(contact, 200, "Contact message receipt");
  assert.deepEqual(await contact.json(), { received: true });
  await expectStatus(await fetch(`${base}/api/inbox`), 401, "Unauthenticated inbox access");
  const inbox = await fetch(`${base}/api/inbox`, { headers: { cookie } }).then((response) =>
    response.json(),
  );
  assert.equal(inbox.length, 1);
  assert.equal(inbox[0].name, "Integration Visitor");
  assert.equal(inbox[0].read, false);
  const markRead = await fetch(`${base}/api/inbox/${inbox[0].id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify({ read: true }),
  });
  await expectStatus(markRead, 200, "Mark inbox message as read");
  const deleteMessage = await fetch(`${base}/api/inbox/${inbox[0].id}`, {
    method: "DELETE",
    headers: { cookie },
  });
  await expectStatus(deleteMessage, 200, "Delete inbox message");
  const emptyInbox = await fetch(`${base}/api/inbox`, { headers: { cookie } }).then((response) =>
    response.json(),
  );
  assert.equal(emptyInbox.length, 0, "Deleted inbox message should no longer be listed");

  const savedConfig = structuredClone(adminConfig);
  savedConfig.sections.services = true;
  savedConfig.contact.whatsapp = "01064621943";
  const save = await fetch(`${base}/api/site`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      cookie,
      origin: "https://fusionteck-test.invalid",
    },
    body: JSON.stringify({ config: savedConfig }),
  });
  await expectStatus(save, 200, "Authenticated content save");
  const persistedConfig = await fetch(`${base}/api/site`, { headers: { cookie } }).then(
    (response) => response.json(),
  );
  assert.equal(persistedConfig.sections.services, true, "CMS content should persist on the server");
  const whatsappHomePage = await fetch(base).then((response) => response.text());
  assert.ok(
    whatsappHomePage.includes('href="https://wa.me/201064621943"'),
    "A configured local WhatsApp number should render a working floating link",
  );

  const project = {
    id: "integration-test-project",
    name: { en: "Integration Test", ar: "اختبار تكامل" },
    description: { en: "Test description", ar: "وصف تجريبي" },
    image: "",
    enabled: true,
    projectKind: "case-study",
    projectCategory: "social-media",
    imageGallery: [],
  };
  const createProject = await fetch(`${base}/api/projects`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify(project),
  });
  await expectStatus(createProject, 201, "Project CRUD create");
  assert.equal((await createProject.json()).projectCategory, "social-media");

  const form = new FormData();
  form.set(
    "file",
    new Blob([Buffer.from("small-image-fixture")], { type: "image/png" }),
    "fixture.png",
  );
  const upload = await fetch(`${base}/api/uploads`, {
    method: "POST",
    headers: { cookie },
    body: form,
  });
  await expectStatus(upload, 201, "Media upload");
  const uploaded = await upload.json();
  assert.ok(uploaded.url.startsWith("/uploads/"));
  const media = await fetch(new URL(uploaded.url, base));
  await expectStatus(media, 200, "Uploaded media delivery");
  assert.equal(media.headers.get("content-type"), "image/png");

  const sitemap = await fetch(`${base}/sitemap.xml`).then((response) => response.text());
  assert.ok(sitemap.includes("https://fusionteck-test.invalid/projects/integration-test-project"));
  const robots = await fetch(`${base}/robots.txt`).then((response) => response.text());
  assert.ok(robots.includes("Disallow: /admin"));

  const legacyConfig = structuredClone(persistedConfig);
  legacyConfig.portfolio = [];
  legacyConfig.clients = [];
  legacyConfig.sections.portfolio = false;
  legacyConfig.sections.clients = false;
  legacyConfig.content.showcaseSeedVersion = 0;
  const saveLegacyConfig = await fetch(`${base}/api/site`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      cookie,
      origin: "https://fusionteck-test.invalid",
    },
    body: JSON.stringify({ config: legacyConfig }),
  });
  await expectStatus(saveLegacyConfig, 200, "Legacy content fixture save");
  await stopServer(server);
  serverOutput = "";
  server = startServer();
  await waitUntilReady();
  const migratedConfig = await fetch(`${base}/api/site`).then((response) => response.json());
  assert.equal(migratedConfig.sections.portfolio, true);
  assert.equal(migratedConfig.sections.clients, true);
  assert.equal(migratedConfig.portfolio.length, 31, "Existing empty sites should receive defaults");
  assert.equal(migratedConfig.clients.length, 20, "Existing sites should receive client logos");

  console.log(
    "API integration passed: SQLite persistence, inbox receipt and access control, admin session, CMS edits, project CRUD, media upload, sitemap and robots rules.",
  );
} finally {
  await stopServer(server);
  await rm(dataDir, { recursive: true, force: true });
}
