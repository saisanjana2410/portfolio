import {test} from 'node:test';
import assert from 'node:assert/strict';
import {askAI} from './server.mjs';
test('model calls tools, receives results, and composes a grounded answer',async()=>{
 let count=0;const requests=[];
 const fake=async(url,options)=>{const body=JSON.parse(options.body);requests.push(body);count++;return {ok:true,json:async()=>count===1?{output:[{type:'function_call',name:'get_profile',call_id:'profile-1',arguments:'{"topic":"experience"}'},{type:'function_call',name:'get_project',call_id:'project-1',arguments:'{"project_id":"repopilot"}'},{type:'function_call',name:'show_portfolio_section',call_id:'navigate-1',arguments:'{"section_id":"repopilot"}'}]}:{output:[{type:'message',content:[{type:'output_text',text:'I currently work at Ooftish. RepoPilot demonstrates Python and FastAPI.'}]}]}};};
 const result=await askAI([{role:'user',content:'What do you do now? Show RepoPilot.'}],{fetchImpl:fake});
 assert.equal(count,2);assert.equal(result.mode,'ai');assert.deepEqual(result.toolUsage,['get_profile','get_project','show_portfolio_section']);assert.equal(result.actions[0].id,'repopilot');assert.ok(result.sources.some(s=>s.id==='experience'));
 const outputs=requests[1].input.filter(i=>i.type==='function_call_output');assert.equal(outputs.length,3);assert.match(outputs[0].output,/currently employed/);assert.equal(requests[0].store,false);
});
test('agent stops after bounded tool rounds',async()=>{let n=0;await assert.rejects(()=>askAI([{role:'user',content:'test'}],{fetchImpl:async()=>({ok:true,json:async()=>({output:[{type:'function_call',name:'unknown',call_id:String(++n),arguments:'{}'}]})})}),/specific question/);assert.equal(n,6);});
