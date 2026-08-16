const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\\\Users\\\\1\\\\.gemini\\\\antigravity-ide\\\\brain\\\\f6e6a749-a60d-4d86-8065-2d2c1eca6919\\\\.system_generated\\\\logs\\\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastCodeHtmlWrites = [];
  
  for await (const line of rl) {
    if (line.includes('code.html') || line.includes('угольк')) {
       try {
           const obj = JSON.parse(line);
           if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('угольк')) {
               console.log('USER PROMPT FOUND: ', obj.content);
           }
           if (obj.tool_calls) {
               for (const tc of obj.tool_calls) {
                   if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'run_command') {
                       const str = JSON.stringify(tc.arguments);
                       if (str && str.includes('code.html')) {
                           lastCodeHtmlWrites.push({
                               step: obj.step_index,
                               tool: tc.name,
                               args: tc.arguments
                           });
                       }
                   }
               }
           }
       } catch(e) {}
    }
  }
  
  console.log("Found " + lastCodeHtmlWrites.length + " modifications to code.html");
  // Save the history to a file so we can inspect it
  fs.writeFileSync('d:\\\\Insta Sites\\\\Scherlock Holmes\\\\history.json', JSON.stringify(lastCodeHtmlWrites, null, 2));
}

processLineByLine();
