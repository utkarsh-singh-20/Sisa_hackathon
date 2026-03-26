const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeContent = async (content) => {
  try {
    // Truncate content if too long to save tokens
    const maxChars = 4000;
    const truncatedContent = content.length > maxChars ? content.substring(0, maxChars) + '...' : content;

    const prompt = `
    Analyze the following log/text snippet for security risks, anomalies, and sensitive data leaks.
    Please return a valid JSON object EXCLUSIVELY with the following structure (do not include markdown block formatting, only the raw JSON):
    {
      "summary": "A brief summary of what the log/text contains",
      "findings": [
        { "type": "issue_type (e.g., stack_trace, suspicious_ip, brute_force)", "risk": "low|medium|high|critical", "line": null }
      ],
      "insights": [
        "Insight 1 (e.g., Sensitive credentials exposed in logs)",
        "Insight 2"
      ]
    }
    
    Content to analyze:
    ${truncatedContent}
    `;

    // get the generative model, we use gemini-1.5-flash for speed and JSON capability
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    let textResult = result.response.text();

    // Safely extract JSON from the text, ignoring markdown and extra text
    const jsonMatch = textResult.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Gemini response: " + textResult);
    }
    
    const parsedResult = JSON.parse(jsonMatch[0]);
    return parsedResult;
  } catch (error) {
    console.error("Gemini AI Error Trace:", error);
    try {
      require('fs').writeFileSync('gemini_error.log', String(error.message || error) + '\n' + String(error.stack), {flag: 'a'});
    } catch(e) {}
    
    return {
      summary: "AI analysis failed. Error: " + (error.message || String(error)),
      findings: [],
      insights: ["Could not generate AI insights due to an error. Check server logs."]
    };
  }
};
