import { useState, useEffect, useRef } from "react";
import { C, P, H, B, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, Checklist } from "./components";
import module1 from "./data/module1";
import module2 from "./data/module2";
import module3 from "./data/module3";
import module4 from "./data/module4";
import module5 from "./data/module5";
import module6 from "./data/module6";

// ═══════════════════════════════════════
// All 6 modules imported from data/ files
// ═══════════════════════════════════════

const MODULES = [module1, module2, module3, module4, module5, module6];

// ─── Storage Key ───
const STORAGE_KEY = "cpp-crash-course:progress";

// ─── MAIN APP ───
export default function App(){
  const[mod,setMod]=useState(null);
  const[sec,setSec]=useState(0);
  const[done,setDone]=useState(()=>{
    try{const saved=localStorage.getItem(STORAGE_KEY);return saved?JSON.parse(saved):{};}catch{return{};}
  });
  const ref=useRef(null);
  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(done));}catch{}},[done]);
  const total=MODULES.reduce((s,m)=>s+m.sections.length,0);
  const dn=Object.keys(done).length;
  const pct=Math.round((dn/total)*100);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=0},[sec,mod]);

  if(mod!==null){
    const m=MODULES.find(x=>x.id===mod);
    const s=m.sections[sec];
    const k=`${m.id}-${sec}`;
    return(<div style={{height:"100vh",display:"flex",flexDirection:"column",background:C.bg,color:C.t}}>
      <div style={{background:C.card,borderBottom:`1px solid ${C.bd}`,padding:"12px 22px",display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
        <button onClick={()=>{setMod(null);setSec(0)}} style={{background:C.bd,border:"none",color:C.t,padding:"7px 16px",borderRadius:8,cursor:"pointer",fontSize:13}}>← Back</button>
        <span style={{fontSize:22}}>{m.icon}</span>
        <div><div style={{fontWeight:700,fontSize:16,color:m.color}}>{m.title}</div><div style={{fontSize:11,color:C.td}}>{m.sub}</div></div>
      </div>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div style={{width:220,minWidth:220,borderRight:`1px solid ${C.bd}`,overflowY:"auto",background:C.card,flexShrink:0}}>
          <div style={{padding:"14px 16px 8px",fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:C.td}}>Sections</div>
          {m.sections.map((x,i)=>(<div key={i} onClick={()=>setSec(i)} style={{padding:"10px 16px",cursor:"pointer",fontSize:13,background:i===sec?`${m.color}15`:"transparent",borderLeft:i===sec?`3px solid ${m.color}`:"3px solid transparent",color:i===sec?m.color:C.t,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13}}>{done[`${m.id}-${i}`]?"✅":"○"}</span><span style={{lineHeight:1.3}}>{x.title}</span>
          </div>))}
        </div>
        <div ref={ref} style={{flex:1,overflowY:"auto",padding:"28px 40px 60px",maxWidth:1100,margin:"0 auto"}}>
          <h2 style={{margin:"0 0 24px",color:m.color,fontSize:24,fontWeight:600}}>{s.title}</h2>
          {s.content}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:36,paddingTop:24,borderTop:`1px solid ${C.bd}`}}>
            <button disabled={sec===0} onClick={()=>setSec(sec-1)} style={{padding:"9px 22px",background:C.card,border:`1px solid ${C.bd}`,borderRadius:8,color:C.t,cursor:sec===0?"default":"pointer",opacity:sec===0?.3:1,fontSize:13}}>← Previous</button>
            <button onClick={()=>setDone(p=>{const n={...p};if(n[k])delete n[k];else n[k]=true;return n})} style={{padding:"9px 28px",background:done[k]?C.g:m.color,border:"none",borderRadius:8,color:"white",cursor:"pointer",fontWeight:700,fontSize:13}}>{done[k]?"✓ Completed":"Mark Complete"}</button>
            <button disabled={sec===m.sections.length-1} onClick={()=>setSec(sec+1)} style={{padding:"9px 22px",background:C.card,border:`1px solid ${C.bd}`,borderRadius:8,color:C.t,cursor:sec===m.sections.length-1?"default":"pointer",opacity:sec===m.sections.length-1?.3:1,fontSize:13}}>Next →</button>
          </div>
        </div>
      </div>
    </div>);
  }

  return(<div style={{minHeight:"100vh",background:C.bg,color:C.t}}>
    <div style={{padding:"48px 24px 28px",textAlign:"center"}}>
      <div style={{fontSize:11,letterSpacing:4,textTransform:"uppercase",color:C.td,marginBottom:10}}>UChicago FINM 326 · Computing for Finance</div>
      <h1 style={{fontSize:36,margin:"0 0 8px",fontWeight:300,color:C.t}}>C++ <span style={{color:C.accent,fontWeight:600}}>Crash Course</span></h1>
      <p style={{color:C.td,fontSize:14.5,maxWidth:560,margin:"0 auto 24px",lineHeight:1.7}}>An interactive step-by-step tutorial for the final exam. Every line explained. Every concept visualized.</p>
      <div style={{maxWidth:380,margin:"0 auto"}}>
        <div style={{background:C.card,borderRadius:20,height:10,overflow:"hidden"}}><div style={{background:`linear-gradient(90deg,${C.accent},${C.g})`,height:"100%",width:`${pct}%`,borderRadius:20,transition:"width 0.5s"}}/></div>
        <div style={{fontSize:12,marginTop:8,color:C.td}}>{dn}/{total} sections completed ({pct}%)</div>
      </div>
    </div>
    <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px 48px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
      {MODULES.map(m=>{
        const md=m.sections.filter((_,i)=>done[`${m.id}-${i}`]).length;
        return(<div key={m.id} onClick={()=>setMod(m.id)} style={{background:C.card,borderRadius:14,padding:22,cursor:"pointer",border:`1px solid ${C.bd}`,transition:"all 0.2s",borderTop:`4px solid ${m.color}`}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=m.color;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.12)"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:30}}>{m.icon}</span>
            <span style={{fontSize:10,color:m.color,background:`${m.color}18`,padding:"3px 10px",borderRadius:12,fontWeight:700,height:"fit-content"}}>{md}/{m.sections.length}</span>
          </div>
          <h3 style={{margin:"12px 0 4px",fontSize:16,color:C.t}}>{m.title}</h3>
          <div style={{fontSize:12,color:C.td,marginBottom:14,lineHeight:1.4}}>{m.sub}</div>
          <div style={{background:C.bd,borderRadius:6,height:5,overflow:"hidden"}}><div style={{background:m.color,height:"100%",width:`${(md/m.sections.length)*100}%`,transition:"width 0.3s"}}/></div>
        </div>);
      })}
    </div>
  </div>);
}
