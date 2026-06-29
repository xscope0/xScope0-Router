"use server";

import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";

const getPiDir = () => path.join(os.homedir(), ".pi", "agent");
const getModelsPath = () => path.join(getPiDir(), "models.json");
const getSettingsPath = () => path.join(getPiDir(), "settings.json");
const PROVIDER_ID = "pi-dev";

async function readJson(file, fallback = {}) {
  try { return JSON.parse(await fs.readFile(file, "utf8")); }
  catch { return fallback; }
}

async function writeJson(file, data) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n");
}

export async function GET() {
  const modelsPath = getModelsPath();
  const settingsPath = getSettingsPath();
  const modelsJson = await readJson(modelsPath, { providers: {} });
  const settingsJson = await readJson(settingsPath, {});
  const provider = modelsJson.providers?.[PROVIDER_ID] || null;
  return NextResponse.json({
    installed: true,
    hasVansRoute: !!provider,
    providerId: PROVIDER_ID,
    modelsPath,
    settingsPath,
    provider,
    defaultProvider: settingsJson.defaultProvider || null,
    defaultModel: settingsJson.defaultModel || null,
  });
}

export async function POST(request) {
  const { baseUrl, apiKey, models, activeModel } = await request.json();
  const modelIds = (Array.isArray(models) ? models : []).filter((m) => typeof m === "string" && m.trim()).map((m) => m.trim());
  if (!baseUrl || modelIds.length === 0) {
    return NextResponse.json({ error: "baseUrl and at least one model are required" }, { status: 400 });
  }

  const normalizedBaseUrl = String(baseUrl).replace(/\/+$/, "").endsWith("/v1")
    ? String(baseUrl).replace(/\/+$/, "")
    : `${String(baseUrl).replace(/\/+$/, "")}/v1`;
  const keyToUse = apiKey || "sk_9router";
  const finalActive = activeModel || modelIds[0];

  const modelsPath = getModelsPath();
  const settingsPath = getSettingsPath();
  const modelsJson = await readJson(modelsPath, { providers: {} });
  if (!modelsJson.providers) modelsJson.providers = {};
  modelsJson.providers[PROVIDER_ID] = {
    baseUrl: normalizedBaseUrl,
    api: "openai-completions",
    apiKey: keyToUse,
    models: modelIds.map((id) => ({ id, name: id })),
  };
  await writeJson(modelsPath, modelsJson);

  const settingsJson = await readJson(settingsPath, {});
  settingsJson.defaultProvider = PROVIDER_ID;
  settingsJson.defaultModel = finalActive;
  await writeJson(settingsPath, settingsJson);

  return NextResponse.json({ success: true, providerId: PROVIDER_ID, defaultModel: finalActive });
}

export async function DELETE() {
  const modelsPath = getModelsPath();
  const settingsPath = getSettingsPath();
  const modelsJson = await readJson(modelsPath, { providers: {} });
  if (modelsJson.providers) delete modelsJson.providers[PROVIDER_ID];
  await writeJson(modelsPath, modelsJson);

  const settingsJson = await readJson(settingsPath, {});
  if (settingsJson.defaultProvider === PROVIDER_ID) {
    delete settingsJson.defaultProvider;
    delete settingsJson.defaultModel;
  }
  await writeJson(settingsPath, settingsJson);

  return NextResponse.json({ success: true });
}
