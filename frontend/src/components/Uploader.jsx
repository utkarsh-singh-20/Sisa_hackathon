import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, Send } from 'lucide-react';

const Uploader = ({ onAnalyze, isLoading }) => {
  const [textInput, setTextInput] = useState('');
  const [inputType, setInputType] = useState('file'); // 'file' or 'text'
  const [logAnalysis, setLogAnalysis] = useState(true);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0 && !isLoading) {
      handleFileUpload(acceptedFiles[0]);
    }
  }, [isLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt', '.log'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contentStr = e.target.result;
      const formData = new FormData();
      formData.append('file', file);
      
      const type = file.name.endsWith('.log') ? 'log' : 'file';
      formData.append('input_type', type);
      
      formData.append('options', JSON.stringify({
        mask: true,
        block_high_risk: true,
        log_analysis: logAnalysis || type === 'log'
      }));

      onAnalyze(formData, contentStr);
    };
    // read as text to keep original content for viewer, even for pdf this handles uploading
    if (file.type === 'application/pdf' || file.name.endsWith('.docx')) {
      // Create a simulated text for viewer if it's binary, the server will extract it 
      reader.onload = () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('input_type', 'file');
        formData.append('options', JSON.stringify({
          mask: true, block_high_risk: true, log_analysis: logAnalysis
        }));
        onAnalyze(formData, "Binary file uploaded. Server is extracting text...");
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleTextSubmit = () => {
    if (!textInput.trim() || isLoading) return;
    
    const formData = new FormData();
    formData.append('content', textInput);
    formData.append('input_type', 'text');
    formData.append('options', JSON.stringify({
      mask: true,
      block_high_risk: true,
      log_analysis: logAnalysis
    }));

    onAnalyze(formData, textInput);
  };

  return (
    <div className="glass-panel">
      <h2 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px'}}>
        <UploadCloud size={20} color="var(--accent-color)"/> Data Input
      </h2>
      
      <div style={{display: 'flex', gap: '12px', marginBottom: '20px'}}>
        <button 
          className="btn" 
          style={{background: inputType === 'file' ? 'var(--accent-color)' : 'transparent', border: '1px solid var(--accent-color)'}}
          onClick={() => setInputType('file')}
        >
          File / Log Upload
        </button>
        <button 
          className="btn" 
          style={{background: inputType === 'text' ? 'var(--accent-color)' : 'transparent', border: '1px solid var(--accent-color)'}}
          onClick={() => setInputType('text')}
        >
          Raw Text
        </button>
      </div>

      {inputType === 'file' ? (
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <FileText size={48} color={isDragActive ? "var(--accent-color)" : "var(--text-secondary)"} style={{margin: '0 auto'}} />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>Drag & drop a log, pdf, or txt file here, or click to select</p>
          )}
        </div>
      ) : (
        <div className="form-group">
          <textarea 
            className="input-field" 
            placeholder="Paste raw logs, SQL, or chat data here..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button className="btn" onClick={handleTextSubmit} disabled={isLoading || !textInput.trim()}>
            {isLoading ? "Processing..." : <><Send size={16}/> Analyze Text</>}
          </button>
        </div>
      )}

      <div className="form-group" style={{marginTop: '20px'}}>
        <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
          <input 
            type="checkbox" 
            checked={logAnalysis}
            onChange={(e) => setLogAnalysis(e.target.checked)}
          /> 
          Enable AI Log Insights (Requires Gemini)
        </label>
      </div>
      
      {isLoading && inputType === 'file' && (
        <p style={{color: 'var(--accent-color)', textAlign: 'center', marginTop: '16px'}}>
          Uploading & Analyzing...
        </p>
      )}
    </div>
  );
};

export default Uploader;
