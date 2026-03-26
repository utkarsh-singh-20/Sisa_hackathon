require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Let's test with the model the user entered "gemini-2.5-flash"
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Say hello");
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Gemini Error:", err.message);
  }

  try {
    const genAI2 = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model2 = genAI2.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result2 = await model2.generateContent("Say hello");
    console.log("Success 1.5-flash:", result2.response.text());
  } catch (err) {
    console.error("Gemini 1.5-flash Error:", err.message);
  }
}

testGemini();
