const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

exports.extractContent = async (file) => {
  if (!file) return '';
  
  const mimetype = file.mimetype;
  const buffer = file.buffer;

  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (mimetype.startsWith('text/') || file.originalname.endsWith('.log')) {
    // Plain text or logs
    return buffer.toString('utf-8');
  }

  // fallback for unsupported types
  return buffer.toString('utf-8');
};
