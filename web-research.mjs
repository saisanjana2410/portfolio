// Public company questions require external evidence, not Sanjana's job description.
export function isCompanyQuestion(text){
 const q=String(text).toLowerCase();
 return /ooftish|paltech|singareddy/.test(q)&&(/what (is|does|are)|tell me about|company|business|website|founder|founded|services|products|research|look up|search/.test(q))&&!/your (role|work|responsibilit|experience)|what did you|what do you|what have you|you (do|work|build)/.test(q);
}
export function collectWebAnswer(output){
 let answer='';const citations=[];
 for(const message of output.filter(o=>o.type==='message'))for(const c of message.content||[]){
  if(c.type!=='output_text')continue;
  if(answer)answer+='\n';const offset=answer.length;answer+=c.text;
  for(const a of c.annotations||[]){if(a.type!=='url_citation')continue;try{const u=new URL(a.url);if(!['https:','http:'].includes(u.protocol)||u.username||u.password)continue;citations.push({url:u.href,title:a.title||u.hostname,start:offset+a.start_index,end:offset+a.end_index});}catch{}}
 }
 return {answer,citations};
}
