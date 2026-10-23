const functionTool=(name,description,properties)=>({type:'function',name,description,strict:true,parameters:{type:'object',properties,required:Object.keys(properties),additionalProperties:false}});
export const tools=[
 functionTool('search_portfolio','Search portfolio facts, including background, experience, education, projects and limitations.',{query:{type:'string'}}),
 functionTool('get_profile','Get verified biography, current employment, education or contact information.',{topic:{type:'string',enum:['about','experience','education','contact']}}),
 functionTool('get_project','Get a complete project case study including architecture, implementation, stack, evidence and limitations. Project IDs: repopilot, learning, crypto, chef, attendance, survey, security.',{project_id:{type:'string'}}),
 functionTool('find_skill_evidence','Match skills or job requirements to project and work evidence. Return honest implementation evidence rather than inventing proficiency or hiring scores.',{skills:{type:'array',items:{type:'string'},maxItems:10}}),
 functionTool('show_portfolio_section','Offer a button that opens a project case study or scrolls to a page section. Use when visitor asks to see something. IDs: home, work, about, experience, contact, repopilot, learning, crypto, chef, attendance, survey, security. This does not navigate until visitor clicks.',{section_id:{type:'string'}})
];
export function runTool(name,args,{projects,documents,searchPortfolio}) {
 if(name==='search_portfolio')return {records:searchPortfolio(String(args.query||'').slice(0,1000))};
 if(name==='get_profile'){const id=args.topic==='contact'?'about':args.topic;const record=documents.find(d=>d.id===id);return {records:record?[record]:[],error:record?undefined:'Unknown profile topic'};}
 if(name==='get_project'){const p=projects.find(p=>p.id===args.project_id);return {records:p?[documents.find(d=>d.id===p.id)]:[],project:p||null};}
 if(name==='find_skill_evidence'){
  const skills=Array.isArray(args.skills)?args.skills.slice(0,10).filter(s=>typeof s==='string').map(s=>s.slice(0,100)):[];
  const records=new Map();const matches=skills.map(skill=>{const evidence=searchPortfolio(skill);evidence.forEach(d=>records.set(d.id,d));return {skill,evidence:evidence.map(d=>({id:d.id,title:d.title,text:d.text})),status:evidence.length?'Evidence found; no proficiency rating implied':'No supplied evidence'};});return {records:[...records.values()],matches};
 }
 if(name==='show_portfolio_section'){
  const p=projects.find(p=>p.id===args.section_id);const sections={home:'Introduction',work:'Selected projects',about:'About me',experience:'Experience & education',contact:'Contact'};
  if(!p&&!sections[args.section_id])return {error:'Unknown section'};
  return {records:p?[documents.find(d=>d.id===p.id)]:[],action:{id:args.section_id,title:p?.name||sections[args.section_id]}};
 }
 return {error:'Unknown tool'};
}
