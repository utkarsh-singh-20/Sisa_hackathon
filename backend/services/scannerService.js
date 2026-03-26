// Regex patterns for sensitive data
const patterns = {
    email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    api_key: /(?:api_key|apikey|bearer)[=:\s"]+([A-Za-z0-9_\-]{20,})/gi,
    password: /(?:password|pwd)[=:\s"]+([^"\s]+)/gi,
    token: /(?:ghp_[a-zA-Z0-9]{36}|sk-[a-zA-Z0-9]{48})/g
  };
  
  exports.scanContent = (content) => {
    let findings = [];
    
    // Split content by lines to get line numbers
    const lines = content.split('\n');
  
    lines.forEach((lineText, index) => {
      const lineNum = index + 1;
      
      for (const [type, regex] of Object.entries(patterns)) {
        let match;
        // reset regex lastIndex
        regex.lastIndex = 0;
        while ((match = regex.exec(lineText)) !== null) {
          findings.push({
            type,
            risk: type === 'password' || type === 'api_key' || type === 'token' ? 'critical' : 'low',
            line: lineNum,
            value: match[0], // Extract the matched value
          });
        }
      }
    });
  
    return findings;
  };
  
