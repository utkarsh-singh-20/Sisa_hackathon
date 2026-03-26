exports.evaluateRisk = (findings) => {
    let risk_score = 0;
    let risk_level = 'low';
  
    // Define score weights
    const weights = {
      low: 1,
      medium: 3,
      high: 5,
      critical: 10
    };
  
    // De-duplicate findings based on type, line and value
    const uniqueFindings = [];
    const seen = new Set();
    
    for (const f of findings) {
      const key = `${f.type}-${f.line}-${f.value}-${f.risk}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueFindings.push(f);
      }
    }
  
    // Calculate total score
    uniqueFindings.forEach(f => {
      risk_score += weights[f.risk] || 1;
    });
  
    // Determine overall risk level
    if (risk_score >= 10) {
      risk_level = 'critical';
    } else if (risk_score >= 5) {
      risk_level = 'high';
    } else if (risk_score >= 3) {
      risk_level = 'medium';
    }

    return {
      risk_score,
      risk_level,
      finalFindings: uniqueFindings
    };
  };
  
