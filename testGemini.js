import "dotenv/config";

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  console.log("Fetching available models...\n");
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1/models",
    {
      method: "GET",
      headers: {
        "x-goog-api-key": API_KEY,
      },
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  const data = await res.json();
  console.log("Available models that support generateContent:\n");

  data.models.forEach((model) => {
    if (model.supportedGenerationMethods?.includes("generateContent")) {
      console.log(`- ${model.name}`);
      console.log(`  Display Name: ${model.displayName}`);
      console.log(`  Description: ${model.description}`);
      console.log("");
    }
  });
}

async function test() {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: "Say hello!" }],
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  const data = await res.json();
  console.log(data.candidates[0].content.parts[0].text);
}

test();
