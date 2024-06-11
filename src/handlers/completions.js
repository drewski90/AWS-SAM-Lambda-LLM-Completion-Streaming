const https = require('https');

const { OPENAI_API_KEY, OPENAI_MODEL, OPENAI_BASE_URL } = process.env;


function extractHostnameAndPath(url) {
  const regex = /^(?:https?:\/\/)?([^\/]+)(\/.*)?$/;
  const matches = url.match(regex);
  if (matches) {
    const hostname = matches[1];
    const path = matches[2] || '';
    return { hostname, path };
  }
  return null;
}


exports.openaiHandler = awslambda.streamifyResponse(async (event, responseStream, _context) => {
  
  responseStream.setContentType('text/plain');
  
  const json = JSON.parse(event.body);
  
  if (!json.messages) {
    responseStream.write(JSON.stringify({ statusCode: 400, message: 'Messages array is required' }));
    responseStream.end();
    return;
  }
  
  const urlSplit = extractHostnameAndPath(OPENAI_BASE_URL);
  
  const options = {
    hostname: urlSplit.hostname,
    path: urlSplit.path + '/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    }
  };
  
  const requestData = JSON.stringify({
    model: OPENAI_MODEL,
    stream: true,
    ...json
  });
  
  const req = https.request(options, (res) => {
    let data = '';
  
    res.on('data', (chunk) => {
      data += chunk;
      responseStream.write(chunk);
    });
  
    res.on('end', () => {
      console.log('Response:', data);
      responseStream.end();
    });
  });
  
  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    responseStream.end();
  });
  
  // Write data to request body
  req.write(requestData);
  req.end();
  
});