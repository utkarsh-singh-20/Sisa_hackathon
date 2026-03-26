async function runTest() {
  try {
    const response = await fetch('http://localhost:5002/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input_type: 'text',
        content: '2026-03-10 10:00:01 INFO User login\nemail=admin@company.com\npassword=admin123\napi_key=sk-prod-xyz',
        options: JSON.stringify({ mask: true, block_high_risk: true, log_analysis: true })
      })
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Test Error:", err.message);
  }
}

runTest();
