import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Uploader from './components/Uploader';
import LogViewer from './components/LogViewer';
import InsightsPanel from './components/InsightsPanel';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [originalLogContent, setOriginalLogContent] = useState('');

  const handleAnalyze = async (formData, fileContentStr) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setOriginalLogContent(fileContentStr); // Save original for the viewer
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData, // Multi-part form data
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.details || 'Server error');
      }
      setAnalysisResult(data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <ShieldCheck size={28} color="#58a6ff" />
        <h1>AI Secure Data Intelligence</h1>
      </header>

      <main className="main-content">
        <div className="sidebar">
          <Uploader onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>
        
        <div className="content-area">
          <InsightsPanel result={analysisResult} />
          
          {analysisResult && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel"
            >
              <h2 style={{marginTop: 0, fontSize: '1.1rem'}}>Log & Data Viewer</h2>
              <LogViewer 
                content={originalLogContent || analysisResult.summary} 
                findings={analysisResult.findings} 
              />
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
