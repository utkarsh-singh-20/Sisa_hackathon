import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const LogViewer = ({ content, findings }) => {
  // If content is empty or undefined
  if (!content) return <div className="log-viewer"><p style={{padding: '20px'}}>No content to display.</p></div>;

  const lines = content.split('\n');

  // Create a fast lookup map for findings by line number
  const findingsByLine = useMemo(() => {
    const map = {};
    if (findings && Array.isArray(findings)) {
      findings.forEach(f => {
        if (!f.line) return;
        if (!map[f.line]) map[f.line] = [];
        map[f.line].push(f);
      });
    }
    return map;
  }, [findings]);

  // Highlight specific strings on a line
  const highlightLine = (text, lineFindings) => {
    if (!lineFindings || lineFindings.length === 0) return text;
    
    // Simple replacement logic for matched values
    // To handle multiple findings correctly, we can split the text
    let elements = [text];
    
    lineFindings.forEach((finding, fIndex) => {
      if (!finding.value) return;
      const { value, risk, type } = finding;
      
      const newElements = [];
      elements.forEach((el, index) => {
        if (typeof el === 'string') {
          const parts = el.split(value);
          parts.forEach((part, i) => {
            newElements.push(part);
            if (i < parts.length - 1) {
              newElements.push(
                <span key={`${fIndex}-${i}`} className={`highlight ${risk}`} title={`Risk: ${type}`}>
                  {value}
                </span>
              );
            }
          });
        } else {
          newElements.push(el);
        }
      });
      elements = newElements;
    });

    return elements;
  };

  return (
    <div className="log-viewer">
      {lines.map((lineStr, index) => {
        const lineNum = index + 1;
        const lineFindings = findingsByLine[lineNum] || [];
        
        // Find highest risk for line styling
        let highestRisk = '';
        if (lineFindings.some(f => f.risk === 'critical')) highestRisk = 'critical';
        else if (lineFindings.some(f => f.risk === 'high')) highestRisk = 'high';
        else if (lineFindings.some(f => f.risk === 'medium')) highestRisk = 'medium';
        else if (lineFindings.some(f => f.risk === 'low')) highestRisk = 'low';

        return (
          <motion.div 
            initial={{opacity: 0}} animate={{opacity: 1}} transition={{ delay: Math.min(index * 0.01, 1) }}
            key={lineNum} 
            className={`log-line ${highestRisk}`}
          >
            <div className="line-num">{lineNum}</div>
            <div className="line-content">
              {lineFindings.length > 0 ? highlightLine(lineStr, lineFindings) : lineStr}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LogViewer;
