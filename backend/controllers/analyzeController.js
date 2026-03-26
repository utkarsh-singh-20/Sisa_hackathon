const parserService = require('../services/parserService');
const scannerService = require('../services/scannerService');
const aiService = require('../services/aiService');
const riskEngine = require('../services/riskEngine');

exports.analyzeData = async (req, res, next) => {
  try {
    const { input_type } = req.body;
    let content = req.body.content || '';
    let options = req.body.options ? JSON.parse(req.body.options) : {
      mask: true,
      block_high_risk: true,
      log_analysis: true
    };
    
    // 1. Extraction (Parser)
    if (req.file) {
      if (!input_type && req.file.mimetype.includes('pdf')) {
         req.body.input_type = 'file';
      }
      content = await parserService.extractContent(req.file);
    }

    if (!content) {
      return res.status(400).json({ error: 'No content to analyze' });
    }

    // 2. Detection Engine (Regex)
    const regexFindings = scannerService.scanContent(content);

    // 3. Detection Engine (AI & Log Analyzer)
    let aiInsights = [];
    let aiFindings = [];
    let summary = "Content processed";
    
    // Only use AI if log_analysis is true or input type is complex
    if (options.log_analysis || input_type === 'log') {
       const aiResult = await aiService.analyzeContent(content);
       aiInsights = aiResult.insights || [];
       aiFindings = aiResult.findings || [];
       summary = aiResult.summary || "Log analysis complete";
    }
    
    // Merge findings
    const allFindings = [...regexFindings, ...aiFindings];

    // 4. Risk Engine
    const { risk_score, risk_level, finalFindings } = riskEngine.evaluateRisk(allFindings);

    // 5. Policy Engine
    let action = "allowed";
    if (options.block_high_risk && (risk_level === 'high' || risk_level === 'critical')) {
      action = "blocked";
    } else if (options.mask && risk_score > 0) {
      action = "masked";
    }

    res.json({
      summary,
      content_type: input_type || 'text',
      findings: finalFindings,
      risk_score,
      risk_level,
      action,
      insights: aiInsights
    });
  } catch (error) {
    next(error);
  }
};
