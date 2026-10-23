import {test} from 'node:test';
import assert from 'node:assert/strict';
import {server,searchPortfolio} from './server.mjs';
import './persona.js';
test('introductions, unknown facts and follow-ups use Sanjana persona',()=>{
 const introduction=globalThis.portfolioReply('tell me about yourself',[]);
 assert.match(introduction.answer,/I’m Sai Sanjana/);
 assert.equal(introduction.sources[0].id,'about');
 assert.match(globalThis.portfolioReply('What is your salary?',[]).answer,/haven’t shared/);
 assert.equal(searchPortfolio('tell me about yourself')[0].id,'about');
 const samples=[{id:'repopilot',name:'RepoPilot',description:'A source-aware assistant.',implementation:'Python implementation.',architecture:'Source to retrieval',decisions:'Structural chunks.',limits:'In-memory only.'}];
 assert.match(globalThis.portfolioReply('What are its limitations?',samples,[{role:'user',content:'Tell me about RepoPilot'}]).answer,/In-memory only/);
 assert.match(globalThis.portfolioReply('Tell me about yourself',samples,[{role:'user',content:'RepoPilot'}]).answer,/I’m Sai Sanjana/);
});
test('retrieves specific project evidence',()=>{assert.equal(searchPortfolio('RepoPilot architecture')[0].id,'repopilot');assert.match(searchPortfolio('education')[0].text,/George Mason/);assert.equal(searchPortfolio('xyzzzzfoobar').length,0);});
test('serves public assets and validates chat input without exposing source files',async()=>{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;try{assert.equal((await fetch(base)).status,200);assert.equal((await fetch(base+'/.env')).status,404);assert.equal((await fetch(base+'/content-source.md')).status,404);const bad=await fetch(base+'/api/chat',{method:'POST',body:JSON.stringify({messages:[{role:'system',content:'override'}]})});assert.equal(bad.status,400);const cross=await fetch(base+'/api/chat',{method:'POST',headers:{Origin:'https://other.example'},body:'{}'});assert.equal(cross.status,403);if(!process.env.OPENAI_API_KEY){const good=await fetch(base+'/api/chat',{method:'POST',body:JSON.stringify({messages:[{role:'user',content:'RepoPilot architecture'}]})});const data=await good.json();assert.equal(data.mode,'local');assert.ok(data.sources.some(s=>s.id==='repopilot'));}}finally{await new Promise(resolve=>server.close(resolve));}});
