import { useState, useEffect, useMemo, useRef } from "react";

// ─── Color Palette (Light Mode - CLion Style) ───
export const C = {
  bg:"#f5f7fa",card:"#ffffff",accent:"#6c5ce7",accentL:"#5b4cdb",
  g:"#067D17",r:"#e74c3c",o:"#e67e22",b:"#0033B3",y:"#871094",
  t:"#2B2B2B",td:"#6E6E6E",bd:"#D1D1D1",code:"#FFFFFF",ct:"#2B2B2B"
};

// ─── Syntax Highlighting Hook ───
function usePrismHighlight(ref) {
  useEffect(() => {
    const highlight = () => {
      if (ref.current && window.Prism && window.Prism.languages.cpp) {
        window.Prism.highlightElement(ref.current);
      }
    };
    // Try immediately
    highlight();
    // Also try after a short delay in case Prism loads late
    const timer = setTimeout(highlight, 100);
    return () => clearTimeout(timer);
  });
}

// ─── Basic Text ───
export function P({children}){return <p style={{margin:"10px 0",lineHeight:1.85,fontSize:16,color:C.t}}>{children}</p>;}
export function H({children}){return <h3 style={{color:C.accentL,margin:"30px 0 12px",fontSize:19,borderBottom:`1px solid ${C.bd}`,paddingBottom:8}}>{children}</h3>;}
export function B({children}){return <b style={{color:C.t,fontWeight:700}}>{children}</b>;}

// ─── LaTeX Math (KaTeX) ───
export function M({children, block=false}){
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.katex) {
      try {
        window.katex.render(children, ref.current, {
          throwOnError: false,
          displayMode: block
        });
      } catch (e) {
        ref.current.textContent = children;
      }
    }
  }, [children, block]);
  return block
    ? <div ref={ref} style={{margin:"16px 0",textAlign:"center",fontSize:18}} />
    : <span ref={ref} style={{fontSize:"1em"}} />;
}

// ─── Code Block (CLion Style with Syntax Highlighting) ───
export function Code({code,title}){
  const codeRef = useRef(null);
  usePrismHighlight(codeRef);
  return(<div style={{margin:"14px 0",borderRadius:6,overflow:"hidden",border:`1px solid ${C.bd}`,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
    {title&&<div style={{background:"#F7F8FA",padding:"8px 16px",fontSize:12,color:C.td,fontFamily:"'JetBrains Mono','Consolas',monospace",borderBottom:`1px solid ${C.bd}`}}>{title}</div>}
    <pre style={{background:C.code,padding:"16px 18px",fontSize:13,fontFamily:"'JetBrains Mono','Consolas','Courier New',monospace",overflowX:"auto",margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}><code ref={codeRef} className="language-cpp">{code}</code></pre>
  </div>);
}

// ─── Annotated Code (CLion Style with Syntax Highlighting) ───
export function AnnotatedCode({lines, title}){
  const containerRef = useRef(null);
  useEffect(() => {
    const highlight = () => {
      if (containerRef.current && window.Prism && window.Prism.languages.cpp) {
        window.Prism.highlightAllUnder(containerRef.current);
      }
    };
    highlight();
    const timer = setTimeout(highlight, 100);
    return () => clearTimeout(timer);
  });
  return(<div style={{margin:"16px 0",borderRadius:6,overflow:"hidden",border:`1px solid ${C.bd}`,boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
    {title&&<div style={{background:"#F7F8FA",padding:"8px 16px",fontSize:12,color:C.td,fontFamily:"'JetBrains Mono','Consolas',monospace",borderBottom:`1px solid ${C.bd}`}}>{title}</div>}
    <div ref={containerRef} style={{background:C.code,padding:"8px 0"}}>
      {lines.map((l,i)=>(
        <div key={i} style={{display:"flex",borderBottom:i<lines.length-1?`1px solid #EAEAEA`:"none",minHeight:36}}>
          <code className="language-cpp" style={{flex:"0 0 55%",padding:"8px 16px",fontFamily:"'JetBrains Mono','Consolas',monospace",fontSize:13,whiteSpace:"pre-wrap",lineHeight:1.6,background:"transparent"}}>{l.code}</code>
          <div style={{flex:"0 0 45%",padding:"8px 14px",fontSize:13,color:"#067D17",background:"#FAFBFC",lineHeight:1.5,borderLeft:`1px solid #EAEAEA`,display:"flex",alignItems:"center"}}>
            <span style={{color:"#999",marginRight:6}}>←</span>{l.why}
          </div>
        </div>
      ))}
    </div>
  </div>);
}

// ─── Step Card (Rule 2: one logical move per card) ───
export function Step({n,title,children}){
  return(<div style={{margin:"12px 0",background:"rgba(124,108,240,0.04)",border:`1px solid ${C.bd}`,borderRadius:10,overflow:"hidden"}}>
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",background:"rgba(124,108,240,0.08)",borderBottom:`1px solid ${C.bd}`}}>
      <span style={{width:28,height:28,borderRadius:"50%",background:C.accent,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0}}>{n}</span>
      <span style={{fontWeight:600,color:C.accentL,fontSize:15.5}}>{title}</span>
    </div>
    <div style={{padding:"12px 16px",fontSize:15.5,color:C.t,lineHeight:1.8}}>{children}</div>
  </div>);
}

// ─── Flowchart / Strategy Map (Rule 3) ───
export function Flowchart({title,steps}){
  // steps = [{label:"What we want", items:["Portfolio Manager"]}, {label:"Pieces needed", items:["Stock class","Vector","..."]}, ...]
  return(<div style={{margin:"20px 0",padding:"20px",background:"rgba(124,108,240,0.04)",border:`1px solid ${C.bd}`,borderRadius:12}}>
    {title&&<div style={{textAlign:"center",fontWeight:700,color:C.accentL,fontSize:15,marginBottom:16}}>{title}</div>}
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
      {steps.map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{border:`2px solid ${s.color||C.accent}`,borderRadius:10,padding:"10px 16px",textAlign:"center",background:C.card,minWidth:120}}>
            <div style={{fontWeight:700,color:s.color||C.accent,fontSize:11,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{s.label}</div>
            {s.items.map((it,j)=><div key={j} style={{fontSize:12.5,color:C.t,marginBottom:2}}>{it}</div>)}
          </div>
          {i<steps.length-1&&<span style={{color:C.td,fontSize:24}}>→</span>}
        </div>
      ))}
    </div>
  </div>);
}

// ─── Memory Diagram (Rule 4) ───
export function MemDiagram({cells,title}){
  // cells = [{addr:"0x1000", label:"x", value:"10", color:"#2ecc71"}, {type:"arrow", label:"points to"}, ...]
  return(<div style={{margin:"18px 0",padding:"20px",background:"rgba(46,204,113,0.04)",border:`1px solid ${C.bd}`,borderRadius:12}}>
    {title&&<div style={{textAlign:"center",fontWeight:600,color:C.g,fontSize:13,marginBottom:14}}>{title}</div>}
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
      {cells.map((c,i)=>{
        if(c.type==="arrow") return <div key={i} style={{textAlign:"center",padding:"0 4px"}}><div style={{color:C.td,fontSize:20}}>→</div>{c.label&&<div style={{fontSize:10,color:C.td}}>{c.label}</div>}</div>;
        return(<div key={i} style={{border:`2px solid ${c.color||C.accent}`,borderRadius:10,padding:"10px 16px",textAlign:"center",background:C.card,minWidth:80}}>
          {c.addr&&<div style={{fontSize:9,color:C.td,fontFamily:"monospace"}}>{c.addr}</div>}
          <div style={{fontSize:20,fontWeight:700,color:c.color||C.accent}}>{c.value}</div>
          <div style={{fontSize:11,color:c.color||C.td}}>{c.label}</div>
        </div>);
      })}
    </div>
  </div>);
}

// ─── Class Hierarchy Diagram (Rule 4) ───
export function Hierarchy({root,children,grandchildren}){
  return(<div style={{margin:"18px 0",padding:"20px",background:"rgba(124,108,240,0.04)",border:`1px solid ${C.bd}`,borderRadius:12,textAlign:"center"}}>
    <div style={{display:"inline-block",padding:"8px 22px",background:C.accent,borderRadius:8,color:"white",fontWeight:700,fontSize:14}}>{root}</div>
    <div style={{width:2,height:18,background:C.accent,margin:"0 auto"}}/>
    <div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap"}}>
      {children.map((ch,i)=>(<div key={i} style={{textAlign:"center"}}>
        <div style={{width:2,height:14,background:C.bd,margin:"0 auto"}}/>
        <div style={{padding:"6px 16px",background:"rgba(108,92,231,0.15)",borderRadius:6,border:`1px solid ${C.accent}`,color:C.accentL,fontSize:13,fontWeight:600}}>{ch}</div>
        {grandchildren&&grandchildren[i]&&<>
          <div style={{width:2,height:10,background:C.bd,margin:"0 auto"}}/>
          <div style={{display:"flex",gap:6,justifyContent:"center"}}>
            {grandchildren[i].map((gc,j)=>(<div key={j} style={{padding:"4px 10px",background:"rgba(108,92,231,0.08)",borderRadius:4,border:`1px solid ${C.bd}`,color:C.t,fontSize:11}}>{gc}</div>))}
          </div>
        </>}
      </div>))}
    </div>
  </div>);
}

// ─── Professor Quote (per transcript) ───
export function Prof({children}){return <div style={{margin:"14px 0",padding:"14px 18px",background:"rgba(241,196,15,0.06)",borderLeft:`4px solid ${C.y}`,borderRadius:"0 10px 10px 0",fontSize:15.5,color:C.t,lineHeight:1.75}}><b style={{color:C.y}}>🎓 Professor says: </b><i>{children}</i></div>;}

// ─── Exam/Interview Tip ───
export function Exam({children}){return <div style={{margin:"14px 0",padding:"14px 18px",background:"rgba(231,76,60,0.06)",borderLeft:`4px solid ${C.r}`,borderRadius:"0 10px 10px 0",fontSize:15.5,color:C.t,lineHeight:1.75}}><b style={{color:C.r}}>⚠️ Exam/Interview: </b>{children}</div>;}

// ─── Key Concept Tip ───
export function Tip({title,children}){return <div style={{margin:"14px 0",padding:"16px 18px",background:"rgba(46,204,113,0.06)",borderLeft:`4px solid ${C.g}`,borderRadius:"0 10px 10px 0"}}><div style={{fontWeight:700,color:C.g,fontSize:15.5,marginBottom:6}}>💡 {title}</div><div style={{fontSize:15.5,color:C.t,lineHeight:1.8,whiteSpace:"pre-line"}}>{children}</div></div>;}

// ─── Common Confusion (Rule 5) ───
export function Confusion({mistake,why}){
  return(<div style={{margin:"14px 0",padding:"14px 18px",background:"rgba(243,156,18,0.06)",borderLeft:`4px solid ${C.o}`,borderRadius:"0 10px 10px 0"}}>
    <div style={{fontWeight:700,color:C.o,fontSize:13,marginBottom:4}}>⚡ Common Confusion</div>
    <div style={{fontSize:15,color:C.t,lineHeight:1.7}}><b>Mistake:</b> {mistake}</div>
    <div style={{fontSize:15,color:C.t,lineHeight:1.7,marginTop:4}}><b>Why it's wrong:</b> {why}</div>
  </div>);
}

// ─── Conversion Side-by-Side (Rule 6) ───
export function Conversion({from,to,feature,beforeCode,afterCode}){
  return(<div style={{margin:"16px 0",border:`1px solid ${C.bd}`,borderRadius:12,overflow:"hidden"}}>
    <div style={{padding:"10px 16px",background:"rgba(124,108,240,0.08)",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
      <span style={{color:C.r,fontSize:12,fontWeight:600}}>FROM: {from}</span>
      <span style={{color:C.accent,fontSize:12,fontWeight:600}}>→ Using: {feature}</span>
      <span style={{color:C.g,fontSize:12,fontWeight:600}}>TO: {to}</span>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
      <div style={{borderRight:`1px solid ${C.bd}`}}>
        <div style={{padding:"6px 12px",background:"rgba(231,76,60,0.06)",fontSize:10,color:C.r,fontWeight:700}}>BEFORE</div>
        <pre style={{background:C.code,color:"#e8a0a0",padding:"12px",margin:0,fontSize:11.5,fontFamily:"Consolas,monospace",whiteSpace:"pre-wrap",lineHeight:1.6}}>{beforeCode}</pre>
      </div>
      <div>
        <div style={{padding:"6px 12px",background:"rgba(46,204,113,0.06)",fontSize:10,color:C.g,fontWeight:700}}>AFTER</div>
        <pre style={{background:C.code,color:C.ct,padding:"12px",margin:0,fontSize:11.5,fontFamily:"Consolas,monospace",whiteSpace:"pre-wrap",lineHeight:1.6}}>{afterCode}</pre>
      </div>
    </div>
  </div>);
}

// ─── Homework Box ───
export function Hw({num,title,desc,practice}){
  const[open,setOpen]=useState(false);
  return(<div style={{margin:"24px 0",background:"rgba(124,108,240,0.05)",borderRadius:12,border:"1px solid rgba(124,108,240,0.25)",overflow:"hidden"}}>
    <div style={{padding:"16px 20px"}}><div style={{color:C.accent,fontWeight:700,fontSize:16}}>📋 Assignment {num}: {title}</div><div style={{color:C.t,fontSize:14,marginTop:10,lineHeight:1.8,whiteSpace:"pre-line"}}>{desc}</div></div>
    {practice&&<><div onClick={()=>setOpen(!open)} style={{padding:"12px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",background:"rgba(124,108,240,0.1)"}}>
      <span style={{color:C.accentL,fontWeight:600,fontSize:13}}>🏋️ Practice Assignment</span>
      <span style={{color:C.accentL}}>{open?"▲":"▼"}</span></div>
    {open&&<div style={{padding:"16px 20px",fontSize:14,color:C.t,lineHeight:1.8,whiteSpace:"pre-line"}}>{practice}</div>}</>}
  </div>);
}

// ─── Render inline code ───
function renderInlineCode(text,keyPrefix=""){
  if(!text)return text;
  const parts=text.split(/(`[^`]+`)/g);
  return parts.map((p,i)=>{
    if(p.startsWith("`")&&p.endsWith("`")){
      const code=p.slice(1,-1);
      return <code key={`${keyPrefix}-${i}`} style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4,fontFamily:"'Consolas',monospace",fontSize:"0.9em",color:C.ct}}>{code}</code>;
    }
    return <span key={`${keyPrefix}-${i}`}>{p}</span>;
  });
}

// ─── Render text with code blocks, inline code, and line breaks ───
function RenderText({text}){
  if(!text)return text;
  // Handle code blocks
  const parts=text.split(/(```[\s\S]*?```)/g);
  return parts.map((p,i)=>{
    if(p.startsWith("```")){
      const code=p.replace(/```\w*\n?/,"").replace(/```$/,"");
      return <pre key={i} style={{background:C.code,padding:"12px 14px",borderRadius:8,margin:"8px 0",fontSize:13,fontFamily:"'Consolas',monospace",color:C.ct,whiteSpace:"pre-wrap",overflowX:"auto",border:`1px solid ${C.bd}`}}>{code}</pre>;
    }
    // Handle line breaks in regular text
    if(!p.includes("\n"))return <span key={i}>{renderInlineCode(p,`p${i}`)}</span>;
    return <span key={i}>{p.split("\n").map((line,j,arr)=><span key={j}>{renderInlineCode(line,`p${i}l${j}`)}{j<arr.length-1&&<br/>}</span>)}</span>;
  });
}

// ─── Quiz (Rule: end of each topic) ───
export function Quiz({questions,id}){
  const key=useMemo(()=>`cpp-quiz:${id||questions[0]?.q?.slice(0,30)||"default"}`,[id,questions]);
  const[a,setA]=useState(()=>{try{const d=localStorage.getItem(key);return d?JSON.parse(d).a:{};}catch{return{};}});
  const[s,setS]=useState(()=>{try{const d=localStorage.getItem(key);return d?JSON.parse(d).s:false;}catch{return false;}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify({a,s}));}catch{}},[key,a,s]);
  const score=Object.entries(a).filter(([k,v])=>questions[+k]&&v===questions[+k].a).length;
  return(<div style={{marginTop:28,background:C.card,borderRadius:12,padding:22,border:`1px solid ${C.bd}`}}>
    <h3 style={{color:C.y,margin:"0 0 16px",fontSize:16}}>📝 Quick Quiz</h3>
    {questions.map((q,qi)=>(<div key={qi} style={{marginBottom:22}}>
      <div style={{color:C.t,fontSize:14,marginBottom:10,fontWeight:600}}>{qi+1}. <RenderText text={q.q}/></div>
      {q.o.map((opt,oi)=>{const sel=a[qi]===oi,ok=s&&oi===q.a,bad=s&&sel&&oi!==q.a;
        return(<div key={oi} onClick={()=>!s&&setA(p=>({...p,[qi]:oi}))} style={{padding:"9px 14px",marginBottom:5,borderRadius:8,cursor:s?"default":"pointer",
          background:ok?"rgba(46,204,113,0.12)":bad?"rgba(231,76,60,0.12)":sel?"rgba(124,108,240,0.15)":"rgba(255,255,255,0.02)",
          border:`1px solid ${ok?C.g:bad?C.r:sel?C.accent:"transparent"}`,color:C.t,fontSize:13.5,display:"flex",alignItems:"center",gap:10}}>
          <span style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
            background:sel?C.accent:"rgba(255,255,255,0.06)",fontSize:11,fontWeight:700,color:sel?"white":C.td,flexShrink:0}}>{String.fromCharCode(65+oi)}</span><RenderText text={opt}/>
        </div>);})}
      {s&&a[qi]!==undefined&&a[qi]!==q.a&&q.e&&<div style={{fontSize:12.5,color:C.o,marginTop:6,paddingLeft:34}}>💡 <RenderText text={q.e}/></div>}
    </div>))}
    <button onClick={()=>{if(s){setA({});setS(false)}else setS(true)}} style={{padding:"10px 28px",background:s?C.bd:C.accent,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>
      {s?`Score: ${score}/${questions.length} — Try Again`:"Check Answers"}</button>
  </div>);
}

// ─── Full Code (Collapsible Complete Files) ───
export function FullCode({title="Complete Runnable Code", files}){
  const[open,setOpen]=useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    if (open && containerRef.current && window.Prism && window.Prism.languages.cpp) {
      window.Prism.highlightAllUnder(containerRef.current);
    }
  }, [open]);
  return(<div style={{margin:"20px 0",background:C.card,borderRadius:12,border:`1px solid ${C.bd}`,overflow:"hidden"}}>
    <div onClick={()=>setOpen(!open)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",cursor:"pointer",background:"rgba(124,108,240,0.06)"}}>
      <span style={{fontWeight:700,color:C.accent,fontSize:15}}>📦 {title}</span>
      <span style={{fontSize:12,color:C.td}}>{files.length} files {open?"▲":"▼"}</span>
    </div>
    {open&&<div ref={containerRef} style={{padding:"0"}}>
      {files.map((f,i)=>(<div key={i} style={{borderTop:`1px solid ${C.bd}`}}>
        <div style={{background:"#F7F8FA",padding:"8px 16px",fontSize:12,color:C.td,fontFamily:"'JetBrains Mono','Consolas',monospace"}}>{f.name}</div>
        <pre style={{background:C.code,padding:"16px 18px",fontSize:13,fontFamily:"'JetBrains Mono','Consolas','Courier New',monospace",overflowX:"auto",margin:0,lineHeight:1.6,whiteSpace:"pre-wrap"}}><code className="language-cpp">{f.code}</code></pre>
      </div>))}
    </div>}
  </div>);
}
