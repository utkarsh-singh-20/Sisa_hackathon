import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, ShieldAlert } from 'lucide-react';

const InsightsPanel = ({ result }) => {
  if (!result) {
    return (
      <div className="glass-panel" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', opacity: 0.6}}>
        <Info size={48} style={{marginBottom: '16px'}}/>
        <p>Awaiting data upload to perform analysis...</p>
      </div>
    );
  }

  const { risk_level, risk_score, summary, insights, findings, action } = result;

  const RiskIcon = () => {
    switch(risk_level) {
      case 'critical': return <ShieldAlert size={32} color="var(--danger-color)" />;
      case 'high': return <AlertTriangle size={32} color="var(--warning-color)" />;
      case 'medium': return <Info size={32} color="var(--accent-color)" />;
      default: return <CheckCircle size={32} color="var(--success-color)" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel"
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px'}}>
          <div>
            <h2 style={{marginTop: 0, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <RiskIcon /> Risk Overview
            </h2>
            <p style={{color: 'var(--text-secondary)', margin: 0}}>{summary}</p>
          </div>
          
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: '2rem', fontWeight: 'bold',padding: '8px 16px', fontSize: '1.2rem'}} className={`badge ${risk_level}`}>
              {risk_level.toUpperCase()} ({risk_score})
            </div>
            <div style={{marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
              Action Taken: <span style={{color: action === 'blocked' ? 'var(--danger-color)' : 'var(--text-primary)'}}>{action.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {insights && insights.length > 0 && (
          <div style={{marginBottom: '24px'}}>
            <h3 style={{fontSize: '1.1rem', marginBottom: '12px'}}>AI Insights</h3>
            <ul className="insights-list">
              {insights.map((insight, idx) => (
                <li key={idx}>
                  <Info size={16} color="var(--accent-color)" style={{flexShrink: 0, marginTop: '2px'}}/> 
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {findings && findings.length > 0 && (
          <div className="findings-panel">
            <h3 style={{fontSize: '1.1rem', marginBottom: '12px'}}>Detected Threats</h3>
            {findings.map((finding, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="finding-item"
              >
                <div>
                  <span className={`badge ${finding.risk}`} style={{marginRight: '12px'}}>
                    {finding.type.replace('_', ' ')}
                  </span>
                  <span style={{fontFamily: 'monospace', opacity: 0.8}}>
                    {finding.value ? finding.value.substring(0, 3) + '***' : 'No preview'}
                  </span>
                </div>
                {finding.line && (
                  <span style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>
                    Line {finding.line}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default InsightsPanel;
