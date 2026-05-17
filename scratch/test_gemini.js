const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 1. Manually parse .env to get the key
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
  console.error("Error: GEMINI_API_KEY not found in .env file.");
  process.exit(1);
}

console.log("=========================================");
console.log("GEMINI AI KEY VALIDATION & TEST");
console.log("=========================================");
console.log("Key found:", apiKey.slice(0, 10) + "..." + apiKey.slice(-5));

// 2. Instantiate and test the Gemini AI call
async function runTest() {
  try {
    console.log("Contacting Google Generative AI servers...");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = "Say 'Gemini is fully operational!' in a cool, robotic style.";
    console.log(`Prompt sent: "${prompt}"`);
    
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    console.log("\n-----------------------------");
    console.log("RESPONSE RECEIVED FROM GEMINI:");
    console.log("-----------------------------");
    console.log(text);
    console.log("-----------------------------\n");
    console.log("[SUCCESS] Google Gemini AI is working perfectly with your key!");
  } catch (error) {
    console.error("\n[FAIL] Gemini API call failed!");
    console.error("Error Details:", error.message);
    console.log("\nPlease verify that the key you entered in .env is correct and has not been truncated.");
  }
}

runTest();
