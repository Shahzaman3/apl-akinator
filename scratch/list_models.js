const fs = require("fs");
const path = require("path");
const http = require("https");

const envPath = path.join(__dirname, "..", ".env");
let apiKey = "";

try {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    if (line.startsWith("GEMINI_API_KEY=")) {
      apiKey = line.split("=")[1].trim();
      break;
    }
  }
} catch (err) {
  console.error("Failed to read .env file:", err);
}

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY not found in .env.");
  process.exit(1);
}

console.log("Querying Google Models REST API with key...");

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

http.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => data += chunk);
  res.on("end", () => {
    console.log("Status Code:", res.statusCode);
    try {
      const json = JSON.parse(data);
      if (json.error) {
        console.error("API Error Response:", JSON.stringify(json.error, null, 2));
      } else {
        console.log("Supported Models:");
        json.models.forEach(m => {
          console.log(`- ${m.name} (${m.displayName}) [Supported methods: ${m.supportedGenerationMethods.join(", ")}]`);
        });
      }
    } catch (e) {
      console.log("Raw Response:", data);
    }
  });
}).on("error", (err) => {
  console.error("Network Error:", err.message);
});
