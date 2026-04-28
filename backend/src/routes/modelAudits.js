import express from "express";
import fetch from "node-fetch";

const router = express.Router();

function parseModelJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return { decision: "review", reason: text };
      }
    }
    return { decision: "review", reason: text };
  }
}

async function scoreProfileWithOllama({ modelPrompt, profile }) {
  const response = await fetch(`${process.env.OLLAMA_BASE_URL || "http://localhost:11434"}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || "llama3.1",
      stream: false,
      messages: [
        {
          role: "system",
          content: `${modelPrompt}\nReturn only compact JSON: {"decision":"approved|rejected|review","reason":"short reason"}.`
        },
        {
          role: "user",
          content: JSON.stringify(profile)
        }
      ]
    })
  });

  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  return parseModelJson(data.message?.content || data.response || "");
}

function fillTemplate(template, values) {
  return template
    .replaceAll("{{prompt}}", values.prompt)
    .replaceAll("{{profileJson}}", JSON.stringify(values.profile))
    .replaceAll("{{profile}}", JSON.stringify(values.profile));
}

function getPathValue(source, path) {
  if (!path) return source;
  return path.split(".").reduce((current, key) => {
    if (current == null) return "";
    return current[key];
  }, source);
}

async function scoreProfileWithCustomApi({ endpoint, headers, bodyTemplate, responsePath, modelPrompt, profile }) {
  const bodyText = fillTemplate(bodyTemplate, {
    prompt: `${modelPrompt}\nReturn only compact JSON: {"decision":"approved|rejected|review","reason":"short reason"}.`,
    profile
  });
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: bodyText
  });

  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  const extracted = getPathValue(data, responsePath);
  const text = typeof extracted === "string" ? extracted : JSON.stringify(extracted);
  return parseModelJson(text);
}

router.post("/run-ollama", async (req, res, next) => {
  try {
    const { modelPrompt, baseProfile, twinProfile } = req.body;
    const [base, twin] = await Promise.all([
      scoreProfileWithOllama({ modelPrompt, profile: baseProfile }),
      scoreProfileWithOllama({ modelPrompt, profile: twinProfile })
    ]);
    res.json({
      mode: "ollama",
      model: process.env.OLLAMA_MODEL || "llama3.1",
      base,
      twin,
      biased: String(base.decision).toLowerCase() !== String(twin.decision).toLowerCase()
    });
  } catch (error) {
    next(error);
  }
});

router.post("/run-custom", async (req, res, next) => {
  try {
    const { modelPrompt, baseProfile, twinProfile, endpoint, headers = {}, bodyTemplate, responsePath } = req.body;
    if (!endpoint) return res.status(400).json({ error: "Custom API endpoint is required." });
    if (!bodyTemplate) return res.status(400).json({ error: "Custom API request body template is required." });
    const [base, twin] = await Promise.all([
      scoreProfileWithCustomApi({ endpoint, headers, bodyTemplate, responsePath, modelPrompt, profile: baseProfile }),
      scoreProfileWithCustomApi({ endpoint, headers, bodyTemplate, responsePath, modelPrompt, profile: twinProfile })
    ]);
    res.json({
      mode: "custom-api",
      endpoint,
      base,
      twin,
      biased: String(base.decision).toLowerCase() !== String(twin.decision).toLowerCase()
    });
  } catch (error) {
    next(error);
  }
});

export default router;
