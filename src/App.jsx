import { useState, useEffect, useRef } from "react";

// ─── Color Palette ───
const C = {
  bg:"#0c0c14",card:"#161625",accent:"#7c6cf0",accentL:"#b4acfa",
  g:"#2ecc71",r:"#e74c3c",o:"#f39c12",b:"#3498db",y:"#f1c40f",
  t:"#ecf0f1",td:"#7f8c8d",bd:"#252540",code:"#0e0e1a",ct:"#98d4a6"
};

// ─── Reusable Components ───
function Code({code,title}){
  return(<div style={{margin:"14px 0",borderRadius:10,overflow:"hidden",border:`1px solid ${C.bd}`}}>
    {title&&<div style={{background:C.bd,padding:"7px 16px",fontSize:11,color:C.td,fontFamily:"monospace"}}>{title}</div>}
    <pre style={{background:C.code,color:C.ct,padding:"16px 18px",fontSize:12.5,fontFamily:"'Consolas','Courier New',monospace",overflowX:"auto",margin:0,lineHeight:1.65,whiteSpace:"pre-wrap"}}>{code}</pre>
  </div>);
}
function P({children}){return <p style={{margin:"10px 0",lineHeight:1.8,fontSize:14.5}}>{children}</p>;}
function H({children}){return <h3 style={{color:C.accentL,margin:"28px 0 10px",fontSize:17,borderBottom:`1px solid ${C.bd}`,paddingBottom:8}}>{children}</h3>;}
function Prof({children}){return <div style={{margin:"14px 0",padding:"14px 18px",background:"rgba(241,196,15,0.07)",borderLeft:`4px solid ${C.y}`,borderRadius:"0 10px 10px 0",fontSize:14,color:C.t,lineHeight:1.7}}><b style={{color:C.y}}>🎓 Professor says: </b>{children}</div>;}
function Exam({children}){return <div style={{margin:"14px 0",padding:"14px 18px",background:"rgba(231,76,60,0.07)",borderLeft:`4px solid ${C.r}`,borderRadius:"0 10px 10px 0",fontSize:14,color:C.t,lineHeight:1.7}}><b style={{color:C.r}}>⚠️ Exam/Interview Tip: </b>{children}</div>;}
function Tip({title,children}){return <div style={{margin:"14px 0",padding:"16px 18px",background:"rgba(46,204,113,0.07)",borderLeft:`4px solid ${C.g}`,borderRadius:"0 10px 10px 0"}}><div style={{fontWeight:700,color:C.g,fontSize:14,marginBottom:6}}>💡 {title}</div><div style={{fontSize:14,color:C.t,lineHeight:1.75}}>{children}</div></div>;}

function Viz({children}){return <div style={{margin:"18px 0",padding:"20px",background:"rgba(124,108,240,0.06)",border:`1px solid ${C.bd}`,borderRadius:12,textAlign:"center"}}>{children}</div>;}

function Box({label,items,color}){return <div style={{display:"inline-block",border:`2px solid ${color||C.accent}`,borderRadius:10,padding:"12px 18px",margin:6,textAlign:"left",background:"rgba(0,0,0,0.2)"}}>
  <div style={{fontWeight:700,color:color||C.accent,fontSize:13,marginBottom:6}}>{label}</div>
  {items.map((it,i)=><div key={i} style={{fontSize:12.5,color:C.t,marginBottom:2}}>{it}</div>)}
</div>;}

function Arrow(){return <span style={{color:C.td,fontSize:20,margin:"0 8px"}}>→</span>;}

function Quiz({questions}){
  const[a,setA]=useState({});
  const[s,setS]=useState(false);
  const score=Object.entries(a).filter(([k,v])=>questions[+k]&&v===questions[+k].correct).length;
  return(<div style={{marginTop:28,background:C.card,borderRadius:12,padding:22,border:`1px solid ${C.bd}`}}>
    <h3 style={{color:C.y,margin:"0 0 16px",fontSize:16}}>📝 Quick Quiz</h3>
    {questions.map((q,qi)=>(<div key={qi} style={{marginBottom:22}}>
      <div style={{color:C.t,fontSize:14,marginBottom:10,fontWeight:600}}>{qi+1}. {q.q}</div>
      {q.o.map((opt,oi)=>{const sel=a[qi]===oi,ok=s&&oi===q.a,bad=s&&sel&&oi!==q.a;
        return(<div key={oi} onClick={()=>!s&&setA(p=>({...p,[qi]:oi}))} style={{padding:"9px 14px",marginBottom:5,borderRadius:8,cursor:s?"default":"pointer",
          background:ok?"rgba(46,204,113,0.12)":bad?"rgba(231,76,60,0.12)":sel?"rgba(124,108,240,0.15)":"rgba(255,255,255,0.02)",
          border:`1px solid ${ok?C.g:bad?C.r:sel?C.accent:"transparent"}`,color:C.t,fontSize:13.5,display:"flex",alignItems:"center",gap:10}}>
          <span style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
            background:sel?C.accent:"rgba(255,255,255,0.06)",fontSize:11,fontWeight:700,color:sel?"white":C.td,flexShrink:0}}>{String.fromCharCode(65+oi)}</span>{opt}
        </div>);})}
      {s&&a[qi]!==undefined&&a[qi]!==q.a&&q.e&&<div style={{fontSize:12.5,color:C.o,marginTop:6,paddingLeft:34}}>💡 {q.e}</div>}
    </div>))}
    <button onClick={()=>{if(s){setA({});setS(false)}else setS(true)}} style={{padding:"10px 28px",background:s?C.bd:C.accent,color:"white",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600}}>
      {s?`Score: ${score}/${questions.length} — Try Again`:"Check Answers"}</button>
  </div>);
}

function Hw({num,title,desc,practice}){
  const[open,setOpen]=useState(false);
  return(<div style={{margin:"24px 0",background:"rgba(124,108,240,0.06)",borderRadius:12,border:"1px solid rgba(124,108,240,0.25)",overflow:"hidden"}}>
    <div style={{padding:"16px 20px"}}><div style={{color:C.accent,fontWeight:700,fontSize:16}}>📋 Assignment {num}: {title}</div><div style={{color:C.t,fontSize:14,marginTop:10,lineHeight:1.8,whiteSpace:"pre-line"}}>{desc}</div></div>
    {practice&&<><div onClick={()=>setOpen(!open)} style={{padding:"12px 20px",cursor:"pointer",display:"flex",justifyContent:"space-between",background:"rgba(124,108,240,0.1)"}}>
      <span style={{color:C.accentL,fontWeight:600,fontSize:13}}>🏋️ Practice Assignment (similar but different problem)</span>
      <span style={{color:C.accentL}}>{open?"▲":"▼"}</span></div>
    {open&&<div style={{padding:"16px 20px",fontSize:14,color:C.t,lineHeight:1.8,whiteSpace:"pre-line"}}>{practice}</div>}</>}
  </div>);
}

// ─── MODULE DATA ───
const MODULES=[
{id:1,title:"C++ Foundations",sub:"Lec 1 · Types, Functions, References, Pointers",icon:"⚡",color:C.g,
sections:[
// ── Section 1.1 ──
{title:"Why Quality Matters",content:(<>
<P>Before writing a single line of code, the professor made one thing very clear on Day 1:</P>
<Prof>"Anyone can write code. Our goal is not just to write code — it is to write <b>high quality code</b>. If you just want to write something that runs, we can do that easily. But that's not going to be enough to make you a good developer."</Prof>
<P>So what does "high quality" mean? In this course, we measure code quality using <b>five specific metrics</b>. Every design decision throughout the entire course is evaluated against these metrics. You should memorize them — they show up in exams, interviews, and every homework assignment.</P>
<Tip title="The 5 Quality Metrics">
<b>1. Correct / Reliable</b> — The program must produce the right results. If your option pricer gives the wrong price, nothing else matters.{"\n\n"}
<b>2. Efficient / Performant</b> — Don't waste time or memory. If you're copying a 1000×1000 matrix when you don't need to, that's bad.{"\n\n"}
<b>3. Readable / Clear</b> — Code should express its intention clearly. Other people (and future you) need to understand it. As Martin Fowler said: "Any fool can write code that a computer can understand. Good programmers write code that <i>humans</i> can understand."{"\n\n"}
<b>4. Reusable / Maintainable</b> — Write code once, use it many times. If you fix a bug, fix it in one place, not fifty.{"\n\n"}
<b>5. Extensible</b> — Can you add new features without rewriting everything? Good code grows gracefully.
</Tip>
<P>Throughout this crash course, we'll see exactly how each C++ feature helps us achieve these goals. When the professor introduces references, it's about <b>efficiency</b>. When he introduces classes, it's about <b>readability and reusability</b>. When he introduces virtual functions, it's about <b>extensibility</b>. Everything connects back to these five metrics.</P>
<Exam>If asked "What is high quality code?" on the exam, list all five metrics with brief explanations. The professor defined these on Slide 5 of Lecture 1 and referenced them in nearly every subsequent lecture.</Exam>
</>)},

// ── Section 1.2 ──
{title:"Data Types & Variables",content:(<>
<P>Programs exist to manipulate data. To store data, we use <b>variables</b>. In C++, every variable must have a <b>type</b> — the type tells the compiler how much memory to allocate and what operations are allowed. Once you declare a variable's type, you cannot change it (C++ is statically typed).</P>

<H>Integer Types</H>
<P>For whole numbers (no decimals), C++ provides several types that differ in how much memory they use:</P>
<Viz>
  <Box label="short" items={["2 bytes","−32,768 to 32,767"]} color={C.b}/>
  <Box label="int" items={["4 bytes","~±2 billion"]} color={C.g}/>
  <Box label="long" items={["≥4 bytes","larger range"]} color={C.o}/>
</Viz>
<P>In finance, <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>int</code> is usually sufficient for quantities (number of shares, days, etc.).</P>

<H>Floating-Point Types</H>
<P>For numbers with decimals (prices, returns, volatilities), we have two choices:</P>
<Viz>
  <Box label="float" items={["4 bytes","~7 decimal digits","±3.4×10³⁸"]} color={C.o}/>
  <Arrow/>
  <Box label="double" items={["8 bytes","~15 decimal digits","±1.7×10³⁰⁸"]} color={C.g}/>
</Viz>
<P><b>Always use <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>double</code> for finance.</b> The extra precision matters when you're computing portfolio values, option prices, or risk metrics. The professor uses <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>double</code> everywhere in this course.</P>

<Prof>"Only very few real values can be represented exactly in binary. For example, 0.25, 0.5, and 0.75 can be stored exactly, but 0.1 cannot. This matters when you compare two floating-point numbers — you should use a tolerance, not exact equality."</Prof>

<H>Other Important Types</H>
<Code code={`bool isValid = true;          // true or false — used for conditions
char grade = 'A';             // a single character
std::string symbol = "AAPL";  // a sequence of characters
// NOTE: string is NOT a fundamental type — it comes from <string> header`}/>

<H>Variables and Assignment</H>
<P>Here is the basic pattern: declare a type, give it a name, and (ideally) initialize it immediately:</P>
<Code code={`int quantity = 100;       // an integer variable named "quantity", set to 100
double price = 154.32;    // a double variable named "price"
string ticker = "MSFT";   // a string`}/>

<H>The const Keyword</H>
<P>Sometimes you have a value that should never change — like mathematical constants or configuration parameters. Mark these <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>const</code>:</P>
<Code code={`const double pi = 3.14159265;
// pi = 4.5;  // ERROR! The compiler catches this at compile time.`}/>
<P>This is an example of <b>type safety</b> — the compiler prevents you from making mistakes. The professor returns to <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>const</code> many times throughout the course (const references, const member functions, const pointers).</P>

<H>Type Conversions & static_cast</H>
<P>Be careful with integer division — it truncates the decimal part:</P>
<Code code={`int a = 3, b = 2;
cout << a / b;     // prints 1, NOT 1.5! (integer ÷ integer = integer)

// To get the correct answer, explicitly convert:
cout << static_cast<double>(a) / b;   // prints 1.5`}/>
<P><code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>static_cast&lt;double&gt;(a)</code> temporarily treats <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>a</code> as a double for this expression, so the division produces a decimal result.</P>

<H>Operators Quick Reference</H>
<P>Arithmetic: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>+  -  *  /  %</code> (% is modulo — remainder after division)</P>
<P>Comparison: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&lt;  &gt;  &lt;=  &gt;=  ==  !=</code> (these return bool)</P>
<P>Logical: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&& (AND)  || (OR)  ! (NOT)</code></P>
<P>Increment/Decrement: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>i++  ++i  i--  --i</code></P>

<H>Prefix vs Postfix (Classic Interview Question)</H>
<P>This is a subtle but important distinction. Both <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>i++</code> and <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>++i</code> increment i by 1, but they differ in what value they <b>return</b>:</P>
<Code code={`int x = 3;
int y = x++;   // POSTFIX: y gets the OLD value (3), THEN x becomes 4
               // Result: y = 3, x = 4

int a = 3;
int b = ++a;   // PREFIX: a becomes 4 FIRST, then b gets the NEW value (4)
               // Result: b = 4, a = 4`}/>
<P>Think of it this way: <b>prefix (++x)</b> = "increment first, then use"; <b>postfix (x++)</b> = "use first, then increment."</P>

<H>Type Aliases for Readability</H>
<P>The professor showed this Black-Scholes example to demonstrate how type aliases make code clearer:</P>
<Code code={`// BEFORE — confusing: what does each double represent?
double CallPrice(double s, double k, double r, double v, double t);

// AFTER — clear intentions:
using StockPrice = double;
using Strike = double;
using Rate = double;
using Volatility = double;
using Expiration = double;

double CallPrice(StockPrice s, Strike k, Rate r, Volatility v, Expiration t);`}/>
<P>The function signature now documents itself. This is an example of writing <b>readable and clear</b> code — Quality Metric #3.</P>

<Quiz questions={[
  {q:"What is the size of a double in C++?",o:["2 bytes","4 bytes","8 bytes","16 bytes"],a:2,e:"double = 8 bytes, float = 4 bytes. Always use double for finance."},
  {q:"What does `int y = x++;` produce when x is 3?",o:["y=4, x=4","y=3, x=4","y=3, x=3","Compiler error"],a:1,e:"Postfix: returns old value (3) to y, then increments x to 4."},
  {q:"What does `3 / 2` evaluate to in C++ (both ints)?",o:["1.5","1","2","Error"],a:1,e:"Integer division truncates. Use static_cast<double>(3)/2 to get 1.5."},
  {q:"Is std::string a fundamental type?",o:["Yes","No"],a:1,e:"string is from the Standard Library (<string> header), not a built-in language type."}
]}/>
</>)},

// ── Section 1.3 ──
{title:"Functions",content:(<>
<P>So far we've stored data in variables and performed operations on them. But writing an entire program in <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>main()</code> is terrible practice. We need to break our program into smaller, reusable pieces. That's what <b>functions</b> are for.</P>

<H>What is a Function?</H>
<P>A function is a named block of code that performs a specific task. It takes some inputs (<b>parameters</b>), does some work, and (usually) produces an output (<b>return value</b>).</P>
<Viz>
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
    <Box label="Input(s)" items={["int a","int b"]} color={C.b}/>
    <Arrow/>
    <Box label="Function: add" items={["return a + b;"]} color={C.g}/>
    <Arrow/>
    <Box label="Output" items={["int result"]} color={C.o}/>
  </div>
</Viz>

<Code title="A simple function" code={`int add(int a, int b) {    // return_type  name(parameters)
    return a + b;           // the body — what the function does
}

int main() {
    int result = add(2, 3); // calling the function
    cout << result << endl; // prints 5
}`}/>

<P>Let's break down the anatomy:</P>
<P>• <b>Return type</b> (<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>int</code>) — what type of value comes out. Use <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>void</code> if nothing comes out.</P>
<P>• <b>Name</b> (<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>add</code>) — should describe what the function does.</P>
<P>• <b>Parameters</b> (<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>int a, int b</code>) — the inputs. Each must have a type.</P>
<P>• <b>Body</b> — the code between {"{"} and {"}"} that does the work.</P>

<Tip title="Why Functions Matter (5 Advantages from Lecture)">
<b>1. Decomposition</b> — Break a complex problem into manageable pieces.{"\n"}
<b>2. Readability</b> — A well-named function like <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>calculate_portfolio_value()</code> tells you what's happening without reading the implementation.{"\n"}
<b>3. Reuse</b> — Write once, call many times. Don't repeat yourself.{"\n"}
<b>4. Maintainability</b> — Fix a bug in one function, and it's fixed everywhere that function is used.{"\n"}
<b>5. Type Safety</b> — The compiler checks that you pass the right types. If you accidentally pass a string to a function expecting an int, the compiler catches it.
</Tip>

<H>Function Overloading</H>
<P>C++ lets you have multiple functions with the <b>same name</b> as long as they take <b>different parameter types</b>. This is called <b>overloading</b>. The compiler figures out which version to call based on the arguments you pass.</P>
<Code code={`int add(int a, int b)       { return a + b; }
double add(double a, double b) { return a + b; }

// The compiler picks the right one:
add(2, 3);       // calls the int version → 5
add(1.5, 2.5);   // calls the double version → 4.0`}/>
<P>Important: you <b>cannot</b> overload based only on return type. The parameters must differ.</P>

<H>Organizing Code: Header and Source Files</H>
<P>In real projects, we never write everything in one file. We split code into:</P>
<P>• <b>.h files (headers)</b> — contain <b>declarations</b> (what functions exist)</P>
<P>• <b>.cpp files (source)</b> — contain <b>implementations</b> (how functions work)</P>
<Code title="Add.h — the declaration" code={`int add(int, int);
double add(double, double);`}/>
<Code title="Add.cpp — the implementation" code={`#include "Add.h"
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }`}/>
<Code title="main.cpp — the usage" code={`#include "Add.h"      // use "" for your own project headers
#include <iostream>   // use <> for Standard Library headers

int main() {
    cout << add(2, 3) << endl;
}`}/>
<P>This separation has practical benefits: if you change the <i>implementation</i> of <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>add()</code>, only <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>Add.cpp</code> needs to be recompiled. Files that just <i>use</i> add don't need to change at all. This matters in large projects with thousands of files.</P>

<Quiz questions={[
  {q:"Can two functions have the same name in C++?",o:["Never","Yes, if their parameter types differ","Yes, if their return types differ","Only in different files"],a:1,e:"This is overloading. Parameter types must differ; return type alone is not enough."},
  {q:"What bracket style includes a Standard Library header?",o:['#include "iostream"','#include <iostream>','Either works','Neither'],a:1,e:'Use <> for standard/system headers, "" for your own project headers.'},
  {q:"If a function doesn't return anything, what return type do you use?",o:["null","int","void","none"],a:2}
]}/>
</>)},

// ── Section 1.4 ──
{title:"References & Pass by const Reference",content:(<>
<P>This section covers one of the most important concepts in the entire course. The professor spends significant time on it because it directly impacts <b>performance</b> (Quality Metric #2) and <b>correctness</b> (Metric #1).</P>

<H>What is a Reference?</H>
<P>A <b>reference</b> is simply another name (an <b>alias</b>) for an existing variable. Think of it like a nickname — "Bob" and "Robert" refer to the same person.</P>
<Code code={`int x = 10;
int& refx = x;    // refx is now ANOTHER NAME for x. Same variable.

refx = 20;         // changing refx changes x!
cout << x;          // prints 20

// Rules:
// - A reference MUST be initialized when created
// - Once bound, it CANNOT be rebound to another variable
// int& bad;        // ERROR: not bound to anything`}/>
<P>Under the hood, when you use <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>refx</code>, the compiler treats it as <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>x</code>. There is no separate storage — it's the same variable with two names.</P>

<H>Pass by Value vs. Pass by Reference</H>
<P>This is where references become powerful. Consider this function that's supposed to increment a number:</P>
<Code title="❌ Pass by Value — DOES NOT WORK" code={`void increment(int n) {   // n is a COPY of x
    n = n + 1;             // we're changing the copy
}                          // the copy is destroyed here

int main() {
    int x = 5;
    increment(x);
    cout << x;   // still 5! The original was never touched.
}`}/>
<P>When you pass by value, C++ makes a <b>copy</b> of the argument. The function works on the copy, and the original is untouched. Sometimes that's fine — but sometimes you <i>want</i> to modify the original:</P>
<Code title="✅ Pass by Reference — WORKS" code={`void increment(int& n) {  // n is a REFERENCE to x (same variable!)
    n = n + 1;             // we're changing x itself
}

int main() {
    int x = 5;
    increment(x);
    cout << x;   // prints 6! The original was modified.
}`}/>

<H>The Big Idea: Pass by const Reference</H>
<P>Now here's the insight that the professor spends the most time on. This is his famous <b>matrix example</b> — one of the most likely things to appear on an exam:</P>

<Prof>"Suppose we have a dot product function for matrices. A 1000×1000 matrix has 1 million elements. Each element is a double (8 bytes). So one matrix is 8 million bytes. If we pass two matrices by value, we're copying 16 million bytes just to call a function. And that's just time — we're also doubling our memory usage. Memory is a finite resource."</Prof>

<P>Let's see the three approaches and why only the third one is correct:</P>

<Code title="❌ Approach 1: Pass by Value — Wastes time and memory" code={`double DotProduct(BigMatrix m1, BigMatrix m2) {
    // m1 and m2 are COPIES. 16 million bytes wasted!
    // Works correctly, but terribly inefficient.
}`}/>

<Code title="❌ Approach 2: Pass by Reference — Dangerous" code={`double DotProduct(BigMatrix& m1, BigMatrix& m2) {
    // No copies! Efficient! But...
    // What if we accidentally do m1[0][0] = 999; inside?
    // The ORIGINAL matrix gets corrupted! Inputs should never change.
}`}/>

<Code title="✅ Approach 3: Pass by const Reference — Correct!" code={`double DotProduct(const BigMatrix& m1, const BigMatrix& m2) {
    // No copies (efficient) ✓
    // Cannot modify m1 or m2 (correct) ✓
    // If we accidentally try to change them, compiler CATCHES IT ✓
}`}/>

<Viz>
  <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
    <Box label="Original Matrix" items={["1000×1000 doubles","= 8 million bytes"]} color={C.g}/>
    <div style={{textAlign:"center"}}>
      <div style={{color:C.g,fontWeight:700,fontSize:13}}>const &</div>
      <div style={{color:C.td,fontSize:11}}>no copy</div>
      <div style={{color:C.td,fontSize:11}}>read-only</div>
    </div>
    <Box label="Function Parameter" items={["Same memory","Zero extra cost"]} color={C.g}/>
  </div>
</Viz>

<Prof>"This is using the correct feature for the correct requirement. const reference says: we are passing by reference not because we want to change m1 or m2, but because we want to avoid making copies. The intention is clear. That is readable, clear code."</Prof>

<Tip title="Why Use References? (The Exam Answer)">
The professor explicitly said these are common interview questions:{"\n\n"}
<b>Reason 1:</b> To modify a variable inside a function → pass by reference{"\n"}
<b>Reason 2:</b> To avoid copying large objects → pass by const reference{"\n"}
<b>Reason 3:</b> (Covered later with OOP)
</Tip>

<Exam>"What is a reference?" — An alias (another name) for an existing variable. Once bound, cannot be rebound.{"\n\n"}"Why would you use a reference?" — Two reasons: (1) modify a variable in a function, (2) avoid copying large objects for performance. The professor explicitly called these "very common interview questions."</Exam>

<Quiz questions={[
  {q:"What is the best way to pass a 1000×1000 matrix to a function that only reads it?",o:["By value","By reference","By const reference","By pointer"],a:2,e:"const reference: no copy (efficient) + no modification allowed (safe)."},
  {q:"Can you rebind a reference to a different variable after initialization?",o:["Yes","No"],a:1,e:"References are bound at creation and cannot be rebound."},
  {q:"A 1000×1000 double matrix passed by value copies how many bytes?",o:["8 thousand","80 thousand","8 million","80 million"],a:2,e:"1000×1000 = 1M elements × 8 bytes/double = 8 million bytes."},
  {q:"What does const in `const int& ref` prevent?",o:["Creating the reference","Reading the value","Modifying the value through the reference","Destroying the reference"],a:2}
]}/>
</>)},

// ── Section 1.5 ──
{title:"Pointers",content:(<>
<Prof>"Pointers are NOT hard. Don't believe the myth. If we learn from first principles, the idea is very straightforward."</Prof>

<H>The Core Idea</H>
<P>Every variable you create lives somewhere in your computer's memory, and that location has an <b>address</b> — like a street address for a house. A <b>pointer</b> is simply a variable that stores one of these addresses.</P>

<P>Let's build this up step by step with a visual:</P>

<Viz>
  <div style={{fontFamily:"monospace",fontSize:13,color:C.t}}>
    <div style={{display:"flex",gap:20,justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>
      <div style={{border:`2px solid ${C.g}`,borderRadius:10,padding:"12px 20px",textAlign:"center"}}>
        <div style={{fontSize:10,color:C.td}}>Address: 0x1000</div>
        <div style={{fontSize:24,fontWeight:700,color:C.g}}>10</div>
        <div style={{fontSize:12,color:C.g}}>variable x</div>
      </div>
      <div style={{textAlign:"center",color:C.td}}>
        <div>px stores</div>
        <div style={{fontSize:20}}>→</div>
        <div>the address</div>
      </div>
      <div style={{border:`2px solid ${C.accent}`,borderRadius:10,padding:"12px 20px",textAlign:"center"}}>
        <div style={{fontSize:10,color:C.td}}>Address: 0x2000</div>
        <div style={{fontSize:18,fontWeight:700,color:C.accent}}>0x1000</div>
        <div style={{fontSize:12,color:C.accent}}>pointer px</div>
      </div>
    </div>
  </div>
</Viz>

<P>The pointer <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>px</code> doesn't contain the value 10 — it contains the <i>address</i> 0x1000, which is where x lives. Through that address, we can reach x.</P>

<H>Two Key Operators</H>
<P>Working with pointers requires two operators that you must internalize:</P>

<Tip title="The Two Pointer Operators">
<b>&</b> (address-of) — "Give me the address of this variable"{"\n"}
<b>*</b> (dereference) — "Go to this address and give me the value there"
</Tip>

<Code code={`int x = 10;

// Step 1: Get the address of x
int* px = &x;      // px now holds the address of x

// Step 2: Read the value through the pointer
cout << *px;        // prints 10 — we "dereferenced" px to get x's value

// Step 3: Modify the value through the pointer
*px = 20;           // x is now 20! We changed x through its address.
cout << x;          // prints 20`}/>

<P>Note the confusing overloading of <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&</code>: in a <b>declaration</b> like <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>int& ref = x;</code> it creates a reference. In an <b>expression</b> like <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>int* p = &x;</code> it gets an address. The professor noted: "Don't blame me. That's C++."</P>

<H>Always Initialize Pointers!</H>
<Code code={`int* p;             // TERRIBLE: p holds garbage — using it crashes!
int* p = nullptr;   // GOOD: explicitly says "I'm not pointing to anything yet"`}/>

<Prof>"An uninitialized pointer can have any garbage address. If you try to use it, bad things happen. The good practice is to use nullptr if you don't have anything to point to yet."</Prof>

<H>Pointers and const (4 Cases)</H>
<P>The professor covered this in Lecture 8 specifically because "these things can come up in job interviews." There are four combinations of const with pointers:</P>

<Viz>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:600,margin:"0 auto",textAlign:"left"}}>
  <div style={{background:"rgba(46,204,113,0.08)",border:`1px solid ${C.g}`,borderRadius:8,padding:12}}>
    <div style={{fontWeight:700,color:C.g,fontSize:12}}>Case 1: Both mutable</div>
    <div style={{fontFamily:"monospace",fontSize:12,marginTop:6,color:C.t}}>int* ptr = &x;</div>
    <div style={{fontSize:11,color:C.td,marginTop:4}}>✅ Can change value (*ptr=5)</div>
    <div style={{fontSize:11,color:C.td}}>✅ Can repoint (ptr=&y)</div>
  </div>
  <div style={{background:"rgba(52,152,219,0.08)",border:`1px solid ${C.b}`,borderRadius:8,padding:12}}>
    <div style={{fontWeight:700,color:C.b,fontSize:12}}>Case 2: Value const</div>
    <div style={{fontFamily:"monospace",fontSize:12,marginTop:6,color:C.t}}>const int* ptr = &x;</div>
    <div style={{fontSize:11,color:C.td,marginTop:4}}>❌ Cannot change value</div>
    <div style={{fontSize:11,color:C.td}}>✅ Can repoint</div>
  </div>
  <div style={{background:"rgba(243,156,18,0.08)",border:`1px solid ${C.o}`,borderRadius:8,padding:12}}>
    <div style={{fontWeight:700,color:C.o,fontSize:12}}>Case 3: Pointer const</div>
    <div style={{fontFamily:"monospace",fontSize:12,marginTop:6,color:C.t}}>int* const ptr = &x;</div>
    <div style={{fontSize:11,color:C.td,marginTop:4}}>✅ Can change value</div>
    <div style={{fontSize:11,color:C.td}}>❌ Cannot repoint</div>
  </div>
  <div style={{background:"rgba(231,76,60,0.08)",border:`1px solid ${C.r}`,borderRadius:8,padding:12}}>
    <div style={{fontWeight:700,color:C.r,fontSize:12}}>Case 4: Both const</div>
    <div style={{fontFamily:"monospace",fontSize:12,marginTop:6,color:C.t}}>const int* const ptr = &x;</div>
    <div style={{fontSize:11,color:C.td,marginTop:4}}>❌ Cannot change value</div>
    <div style={{fontSize:11,color:C.td}}>❌ Cannot repoint</div>
  </div>
</div>
</Viz>

<Tip title="Memory Trick: Where is const?">
Read the declaration from right to left around the <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>*</code>:{"\n"}
• const <b>left</b> of * → what it <b>points to</b> is const{"\n"}
• const <b>right</b> of * → the <b>pointer itself</b> is const
</Tip>

<Exam>The professor said in Lecture 8: "Partly because these things can come up in job interviews." Also: "Write a function to swap values of two variables" — a classic pointer/reference interview question. Be ready to write swap() using both references and pointers.</Exam>

<Hw num={0} title="Getting Started (0 pts)" desc={`1. Write a function to add two integers.
2. Read two integers from the keyboard using cin.
3. Add them using your function.
4. Write the result to console.
Goal: Verify your development environment works and you know basic program structure.`} practice={`Write three functions:
1. average(double a, double b) → returns (a+b)/2
2. max_of_three(int a, int b, int c) → returns the largest
3. swap(int& a, int& b) → swaps the two values in-place
Test all three with user input from cin. For swap, print values before and after to verify it worked.`}/>

<Quiz questions={[
  {q:"What does the & operator do in `int* p = &x;`?",o:["Creates a reference","Gets the address of x","Dereferences p","Declares a pointer"],a:1},
  {q:"What does *px give if `int x=10; int* px = &x;`?",o:["The address of x","10","The address of px","Undefined"],a:1,e:"*px dereferences the pointer — follows the address to get the value."},
  {q:"In `const int* ptr`, what is const?",o:["The pointer itself","The value it points to","Both","Neither"],a:1,e:"const left of * → the pointed-to value is const. The pointer can still be repointed."},
  {q:"What should you initialize an unused pointer to?",o:["0","NULL","nullptr","Leave it uninitialized"],a:2,e:"nullptr is the modern C++ (C++11) way to indicate a null pointer."}
]}/>
</>)}
]},

// ── MODULE 2 ──
{id:2,title:"OOP & Classes",sub:"Lec 2 · User-Defined Types, Templates, STL, Loops",icon:"🏗️",color:C.b,
sections:[
{title:"Why We Need Classes",content:(<>
<P>In Lecture 1, we learned to work with fundamental types — int, double, string. These are enough for simple calculations. But now the professor poses a critical question:</P>

<Prof>"Can we represent a Stock using a fundamental type? We cannot. If you think about a stock — a stock has a symbol, a price, a quantity, and a bunch of other features. We don't have one type that can capture all the information about a stock."</Prof>

<P>And it's not just about data. A stock also has <b>operations</b>: you need to read its price, update its price (when it changes), check its symbol, etc. No fundamental type gives you data AND operations together.</P>

<P>This is the motivation for <b>classes</b>. A class lets you define your own custom type that bundles together:</P>
<Viz>
<div style={{display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap"}}>
  <Box label="Data Members (Attributes)" items={["symbol (string)","price (double)","quantity (int)"]} color={C.b}/>
  <div style={{display:"flex",alignItems:"center",color:C.td,fontSize:24}}>+</div>
  <Box label="Member Functions (Operations)" items={["get_symbol()","get_price()","set_price(double)"]} color={C.g}/>
  <div style={{display:"flex",alignItems:"center",color:C.td,fontSize:24}}>=</div>
  <Box label="Class: Stock" items={["A complete type","that represents","a real-world entity"]} color={C.accent}/>
</div>
</Viz>

<H>Writing the Stock Class — Step by Step</H>
<P>Let's build it exactly as the professor did. First, we need to decide: what data does a Stock need, and what operations should we support?</P>

<P><b>Data members:</b></P>
<P>• <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>symbol_</code> — which stock this is (string, e.g., "AAPL")</P>
<P>• <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>price_</code> — current price (double)</P>
<P>• <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>qty_</code> — how many shares we hold (int)</P>

<P><b>Member functions:</b></P>
<P>• Getters: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>get_symbol()</code>, <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>get_price()</code>, <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>get_qty()</code> — to read data</P>
<P>• Setters: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>set_price()</code>, <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>set_qty()</code> — to change data</P>
<P>• <b>No <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>set_symbol()</code></b> — the professor made a deliberate design decision here.</P>

<Prof>"For a stock, changing the symbol may not make much sense. So we just said, it's not something that we are going to do commonly. We can decide what we want to change and what we don't want to change. That's the idea."</Prof>

<P>This is a <b>design choice</b>. Classes give you control over how your data can be used. Now let's see the code:</P>

<Code title="stock.h — The class definition (the 'blueprint')" code={`#pragma once          // include guard (Visual Studio)
#include <string>
using std::string;

class Stock {
public:                // ← These are accessible to everyone
    // Constructors: how to CREATE a Stock
    Stock();                                      // default: empty stock
    Stock(string symbol, double price, int qty);  // the useful one
    
    // Destructor: called when a Stock is destroyed
    ~Stock();
    
    // Getters: read data (marked const — they don't modify anything)
    string get_symbol() const;
    double get_price() const;
    int get_qty() const;
    
    // Setters: modify data
    void set_price(double price);
    void set_qty(int qty);
    
    // NOTE: No set_symbol() — by design, symbol cannot change!

private:               // ← These are hidden from the outside world
    string symbol_;    // trailing underscore = course naming convention
    double price_;     //   for private members
    int qty_;
};`}/>

<P>Let's unpack several important things here:</P>

<P><b>Protection levels</b> control who can access what:</P>
<P>• <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>public:</code> — Anyone who has a Stock object can use these functions.</P>
<P>• <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>private:</code> — Only the class's own member functions can access these. Outside code cannot touch <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>price_</code> directly — they must go through <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>get_price()</code> and <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>set_price()</code>.</P>

<P>Why hide the data? Because then you <b>control how it's accessed</b>. Maybe later you want <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>set_price()</code> to validate that the price is positive. If everyone was accessing <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>price_</code> directly, you couldn't enforce that check.</P>

<Code title="stock.cpp — The implementation" code={`#include "stock.h"

// Constructor using MEMBER INITIALIZER LIST (the colon syntax)
// This is the preferred way — it initializes members directly
// rather than default-constructing then assigning.
Stock::Stock()
    : symbol_(""), price_(0.0), qty_(0)
{
    // Body can be empty — all initialization done above
}

Stock::Stock(string symbol, double price, int qty)
    : symbol_(symbol), price_(price), qty_(qty)
{
}

Stock::~Stock() {
    // Nothing to clean up in this simple case
}

// Note the Stock:: prefix — this tells the compiler these
// functions belong to the Stock class, not some other scope.
string Stock::get_symbol() const { return symbol_; }
double Stock::get_price() const  { return price_; }
int Stock::get_qty() const       { return qty_; }

void Stock::set_price(double price) { price_ = price; }
void Stock::set_qty(int qty)        { qty_ = qty; }`}/>

<Code title="main.cpp — Using the Stock class" code={`#include "stock.h"
#include <iostream>
using std::cout;
using std::endl;

int main() {
    // Create Stock objects (instances of the class)
    Stock s1("MSFT", 500.0, 10);    // Microsoft, $500, 10 shares
    Stock s2("GOOG", 250.0, 5);     // Google, $250, 5 shares
    
    // Use public member functions to interact
    cout << s1.get_symbol() << ": $" << s1.get_price() << endl;
    
    // Update price
    s1.set_price(520.0);
    
    // s1.price_ = 520.0;  // ERROR! price_ is private!
    // This is the whole point — you go through set_price().
}`}/>

<P>Key terminology: the <b>class</b> is the blueprint (Stock); an <b>object</b> is a specific instance of that blueprint (s1, s2). You write one Stock class; you create as many Stock objects as you need.</P>

<Tip title="The Coding Standard (FOLLOW THIS — points deducted otherwise!)">
The professor defined a specific naming convention for this course:{"\n"}
1. Each class gets its own .h and .cpp files{"\n"}
2. Class names start with uppercase: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>Stock</code>, <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>PortfolioMgr</code>{"\n"}
3. Member functions use snake_case: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>get_price()</code>, <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>set_qty()</code>{"\n"}
4. Private members have trailing underscore: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>price_</code>, <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>symbol_</code>{"\n"}
5. Use member initializer list for constructors
</Tip>

<Exam>class vs struct: "The only difference is the default protection level. In a class, if you don't specify, everything is private. In a struct, everything is public. That's it." This is a direct slide quote and a common interview question.</Exam>

<Quiz questions={[
  {q:"Why did the professor NOT include a set_symbol() function?",o:["He forgot","Changing a stock's symbol doesn't make practical sense","Symbols must always be public","It would cause a compile error"],a:1},
  {q:"What is the difference between class and struct in C++?",o:["Structs can't have functions","Default access: class=private, struct=public","Structs are faster","Classes support inheritance, structs don't"],a:1},
  {q:"Why use member initializer list (`:` syntax) instead of assignment in the constructor body?",o:["It looks nicer","Members are initialized directly when created, which is more efficient","It's the only way that compiles","There is no difference"],a:1,e:"Without initializer list, members are first default-constructed then assigned — two operations instead of one."},
  {q:"If you write `Stock s; s.price_ = 100;` — what happens?",o:["price_ is set to 100","Compile error: price_ is private","Runtime error","Nothing happens"],a:1,e:"price_ is private — only Stock's own member functions can access it. Outside code must use set_price()."}
]}/>
</>)},

{title:"Encapsulation & Data Abstraction",content:(<>
<P>The professor introduced two terms that describe the key benefits of using classes. They sound academic, but the ideas are simple and practical:</P>

<H>Encapsulation</H>
<P><b>Encapsulation</b> means: data and the functions that operate on that data are bundled together in one unit (the class), and access to the data is controlled through those functions.</P>

<P>Think of a car's dashboard. You interact with the steering wheel, pedals, and gauges (the <b>public interface</b>). You don't directly manipulate the engine's fuel injectors or the transmission gears (the <b>private internals</b>). The car <i>encapsulates</i> its complexity behind a simple interface.</P>

<P>In our Stock class: you access price through <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>get_price()</code> and <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>set_price()</code>. You don't touch <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>price_</code> directly. This means the Stock class can change how it stores price internally (maybe it switches to storing it in cents) without breaking any code that uses the class.</P>

<H>Data Abstraction</H>
<P><b>Data abstraction</b> means: the <b>interface</b> (what you CAN do with an object) is separated from the <b>implementation</b> (HOW it does it internally).</P>

<Prof>"If I am going to use the Stock class, I need to know two things: how to create a Stock, and what functions I have access to. That's the interface. But I don't need to know how get_price() is implemented. I just need to know there's a function and it returns a double. The interface and implementation are separate."</Prof>

<P>Why does this matter? Because you can <b>change the implementation</b> without affecting users of the class:</P>

<Prof>"Think about an Option class. You can say the Option class supports a price() function. You implement it using Black-Scholes. Later, you change the implementation to Monte Carlo. The user just calls price() — they never know (or care) what changed inside."</Prof>

<Viz>
<div style={{display:"flex",justifyContent:"center",gap:16,flexWrap:"wrap",alignItems:"center"}}>
  <Box label="Interface (what you see)" items={["Stock(symbol, price, qty)","get_symbol()","get_price()","set_price(double)"]} color={C.b}/>
  <div style={{textAlign:"center"}}>
    <div style={{border:`2px dashed ${C.r}`,borderRadius:10,padding:"6px 12px",color:C.r,fontSize:11,fontWeight:700}}>WALL</div>
    <div style={{fontSize:10,color:C.td}}>Separation</div>
  </div>
  <Box label="Implementation (hidden)" items={["How data is stored","How functions work","Internal algorithms","Can change freely"]} color={C.o}/>
</div>
</Viz>

<Exam>"What are the benefits of Encapsulation and Data Abstraction?" was explicitly listed as homework on Slide 31 of Lecture 2. Benefits: code reuse, maintainability (change implementation without affecting users), protection against misuse (private data), clear interfaces.</Exam>
</>)},

{title:"Templates & STL Intro",content:(<>
<P>Before we can use the powerful containers in the Standard Library (like <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>vector</code> and <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>map</code>), we need to understand <b>templates</b> — because those containers are all built using templates.</P>

<H>The Problem Templates Solve</H>
<P>Suppose you write an <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>add</code> function for integers. Then you need one for doubles. Then for floats. The code is identical except for the types. Writing the same logic three times violates DRY (Don't Repeat Yourself).</P>

<P>Templates let you write the code <b>once</b> with a <b>placeholder type</b>, and the compiler generates the specific version for whatever type you actually use:</P>

<Code code={`// Without templates: write the same function for each type
int add(int a, int b)       { return a + b; }
double add(double a, double b) { return a + b; }

// With templates: write it ONCE
template <typename T>       // T is a placeholder for any type
T add(const T a, const T b) {
    return a + b;
}

// The compiler generates the right version automatically:
int r1 = add(1, 2);         // compiler creates add<int>
double r2 = add(1.5, 2.5);  // compiler creates add<double>`}/>

<P>This is called <b>generic programming</b> — writing code that works with any type.</P>

<H>Class Templates</H>
<P>The same idea works for classes. This is how <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>vector</code> is actually defined in the Standard Library — it's a class template:</P>

<Code code={`template <typename T>
class SimpleVector {
private:
    T values_[100];   // T can be int, double, Stock, anything!
public:
    T get(int i) { return values_[i]; }
};

// Usage: specify the actual type in angle brackets
SimpleVector<int> intVec;        // array of ints
SimpleVector<double> doubleVec;  // array of doubles
SimpleVector<Stock> stockVec;    // array of Stocks!`}/>

<Prof>"Most classes and functions in the Standard Library use templates. That's why when you create a vector, you write vector&lt;int&gt; or vector&lt;Stock&gt;. The part in angle brackets is the type parameter."</Prof>

<P>Now we can understand containers like <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>vector&lt;Stock&gt;</code> — it's the vector class template, instantiated with the Stock type.</P>
</>)},

{title:"STL: vector & map",content:(<>
<H>std::vector — Your Default Container</H>
<Prof>"By default, use vector when you need a container." — Bjarne Stroustrup, the creator of C++</Prof>

<P>A <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>vector</code> is like a smart, resizable array. Unlike C-style arrays (fixed size), a vector can grow dynamically as you add elements. It provides fast access by index, just like an array.</P>

<Code title="Creating and using vectors" code={`#include <vector>
using std::vector;

// Method 1: Start empty, add elements one by one
vector<int> v;              // empty vector, size=0
v.push_back(10);            // v is now {10}
v.push_back(20);            // v is now {10, 20}
v.push_back(30);            // v is now {10, 20, 30}
cout << v.size();           // 3

// Method 2: Create with initial size
vector<int> v2(5);          // 5 elements, all initialized to 0
v2[0] = 42;                 // access by index (just like arrays)

// Storing Stock objects:
vector<Stock> portfolio;
portfolio.push_back(Stock("MSFT", 500.0, 10));
portfolio.push_back(Stock("GOOG", 250.0, 5));
portfolio.push_back(Stock("BAC", 50.0, 10));`}/>

<H>std::map — Key-Value Lookup</H>
<P>What if you want to look up a stock by its symbol, rather than by a numeric index? That's what <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>map</code> is for.</P>

<Prof>"Think about it. A vector lets you access elements using an integer index. But what if you want to access elements using something else — like a stock symbol? That's the idea of a map."</Prof>

<Code code={`#include <map>
using std::map;

// A map stores key-value pairs:
//   key (string) → value (Stock)
map<string, Stock> stocks;

// Insert key-value pairs
stocks.insert({"AAPL", Stock("AAPL", 150.0, 2)});
stocks.insert({"MSFT", Stock("MSFT", 500.0, 1)});

// Access by key — fast lookup!
cout << stocks["AAPL"].get_price();  // 150.0`}/>
<P>Maps keep entries <b>sorted by key</b>. Each key must be <b>unique</b>. Under the hood, map uses a balanced binary tree (Red-Black tree) for efficient lookup.</P>

<Hw num={1} title="Simple Portfolio Manager (3%)" desc={`Write a Stock class. Use std::vector to store 5 stock objects.
Compute portfolio value: V = Σ(price_i × qty_i)
Write the portfolio value to console.
Use any 5 stocks with any prices/quantities.`} practice={`Write a BankAccount class with: account_number (string), holder_name (string), balance (double). 
Implement deposit(double amount) and withdraw(double amount) — withdraw should check for sufficient funds.
Store 5 accounts in a vector. 
Compute total balance across all accounts.
Find and print the account with the highest balance.
Bonus: use a map<string, BankAccount> to look up accounts by account number.`}/>

<Quiz questions={[
  {q:"What does push_back() do to a vector?",o:["Removes the last element","Adds an element to the end","Inserts at the beginning","Sorts the vector"],a:1},
  {q:"A map stores data as:",o:["Sequential integers","Key-value pairs","Linked nodes","Binary trees"],a:1,e:"Map is a key-value container. Keys must be unique and are kept sorted."},
  {q:"What is the output of `vector<int> v(5); cout << v.size();`?",o:["0","5","Undefined","Error"],a:1,e:"vector<int> v(5) creates a vector with 5 default-constructed elements (all 0)."}
]}/>
</>)},

{title:"Control Flow & Iterators",content:(<>
<H>Loops</H>
<P>Loops let you repeat code. The professor showed three types, and noted you can write the same logic using any of them:</P>

<Code title="for loop — the most common in this course" code={`// Classic for loop: initializer; condition; increment
for (int i = 0; i < 10; ++i) {
    cout << i << " ";   // prints 0 1 2 3 4 5 6 7 8 9
}

// Range-based for (modern C++ — preferred for containers)
vector<Stock> portfolio = { /* ... */ };
for (const auto& stock : portfolio) {
    cout << stock.get_symbol() << endl;
}
// "for each stock in portfolio" — clean and readable`}/>

<Code title="while loop" code={`int n = 0;
while (n < 10) {        // check condition FIRST
    cout << n << " ";
    n++;                 // MUST change the condition variable!
}                        // otherwise: infinite loop!`}/>

<Prof>"Inside this while statement, you have to have some statement that's going to alter the condition. Otherwise, you are going to be running inside this loop forever."</Prof>

<H>Iterators</H>
<P>An <b>iterator</b> is like a generalized pointer that lets you step through any container. Every STL container provides <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>begin()</code> (points to first element) and <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>end()</code> (points past the last element):</P>

<Code code={`// Iterator-based loop (traditional)
for (auto iter = portfolio.begin(); iter != portfolio.end(); ++iter) {
    cout << iter->get_symbol() << endl;
    // Use -> with iterators (like pointers)
}

// For maps, each element is a pair with .first (key) and .second (value):
for (auto iter = stocks.begin(); iter != stocks.end(); ++iter) {
    cout << iter->first << ": " << iter->second.get_price() << endl;
}`}/>
<P>In practice, the range-based for loop is preferred for readability. But you should understand iterators because STL algorithms use them.</P>

<H>Include Guards (Interview Question)</H>
<P>C++ has a rule: you can define something only once. This is the <b>One Definition Rule</b>. But with #include, it's easy to accidentally include a header twice (especially when headers include other headers). Include guards prevent this:</P>

<Code title="Standard technique (works everywhere)" code={`#ifndef STOCK_H       // "if STOCK_H is NOT defined..."
#define STOCK_H       // "...define it now"

class Stock {
    // ... class definition ...
};

#endif                // "end of the conditional block"

// Second time this file is included:
// STOCK_H IS already defined → #ifndef fails → skip everything`}/>

<Code title="Non-standard shortcut (Visual Studio only)" code={`#pragma once
// Does the same thing, but only works in Visual Studio/some compilers`}/>

<Exam>Include guards and the One Definition Rule are explicitly listed as interview questions on Slide 39 of Lecture 2.</Exam>
</>)}
]},

// ── Remaining modules are abbreviated for space but follow same depth ──
{id:3,title:"Memory Management",sub:"Lec 3 · Copy/Move Semantics, Smart Pointers, RAII",icon:"🔗",color:C.r,
sections:[
{title:"Copy & Move Semantics",content:(<>
<P>When you write <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>Stock s2 = s1;</code>, what happens? A new Stock object is created using the <b>copy constructor</b>. C++ has six special member functions that control how objects are created, copied, moved, and destroyed. Understanding these is critical for writing efficient code.</P>
<H>The Copy Constructor</H>
<P>Creates a new object as a copy of an existing one. Uses the existing object's data to initialize the new one:</P>
<Code code={`Stock::Stock(const Stock& other)         // takes a const reference to another Stock
    : symbol_(other.symbol_),             // copy each member
      price_(other.price_),
      qty_(other.qty_)
{ }`}/>
<H>The Assignment Operator</H>
<P>Unlike the copy constructor (which creates a new object), the assignment operator assigns to an <i>already existing</i> object. Two critical details:</P>
<Code code={`Stock& Stock::operator=(const Stock& other) {
    if (this != &other) {        // 1. SELF-ASSIGNMENT CHECK
        symbol_ = other.symbol_; //    Without this, s = s would be dangerous
        price_ = other.price_;
        qty_ = other.qty_;
    }
    return *this;                // 2. RETURN *this for chaining: s3 = s2 = s1
}`}/>
<P>The <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>this</code> pointer is an implicit pointer that every non-static member function has — it points to the object the function was called on. <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>*this</code> dereferences it, giving you the object itself.</P>
<H>Move Semantics (C++11)</H>
<P>Copying a large object (like a vector with millions of elements) is expensive. But sometimes we have a <b>temporary</b> object that's about to be destroyed anyway. Instead of copying its data, we can <b>steal</b> it. That's what move semantics allow:</P>
<Code code={`Stock::Stock(Stock&& other)                // && = rvalue reference (binds to temporaries)
    : symbol_(std::move(other.symbol_)),   // steal the string's internal buffer
      price_(other.price_),                // for primitives, "move" = copy (cheap)
      qty_(other.qty_)
{ }`}/>
<Prof>"For fundamental types like int and double, moving IS copying — it's just a CPU instruction, very cheap. But for strings and vectors, std::move steals the internal memory buffer instead of copying all the characters/elements. That's the performance gain."</Prof>
<Quiz questions={[
  {q:"Why does operator= return Stock& (a reference)?",o:["To save memory","To allow chained assignment: s3 = s2 = s1","The compiler requires it","To avoid undefined behavior"],a:1},
  {q:"What does the self-assignment check `if (this != &other)` prevent?",o:["Compile errors","Assigning to a const object","Wasteful or dangerous self-assignment","Stack overflow"],a:2},
  {q:"std::move on a string does what?",o:["Copies all characters","Steals the internal buffer (no copy)","Deletes the string","Converts to C-string"],a:1}
]}/>
</>)},
{title:"Smart Pointers & RAII",content:(<>
<Prof>"We don't have to use raw pointers. We have better tools in modern C++."</Prof>
<P>The problem with raw <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>new</code>/<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>delete</code>: forget to delete → memory leak. Delete too early → crash. Delete twice → undefined behavior. Exception before delete → memory leak.</P>
<P><b>Smart pointers</b> solve all of these problems by tying the object's lifetime to the pointer's lifetime — when the smart pointer is destroyed (goes out of scope), it automatically deletes the object it manages.</P>
<Code code={`#include <memory>

// shared_ptr: shared ownership — multiple pointers to same object
auto s1 = std::make_shared<Stock>("AAPL", 150.0, 2);
auto s2 = s1;  // BOTH point to same Stock. Reference count = 2.

cout << s1->get_price();  // use -> just like raw pointers

// When s1 and s2 both go out of scope, the Stock is deleted.
// No manual delete! No memory leak! No double-delete!`}/>
<Tip title="RAII (Resource Acquisition Is Initialization)">
This is one of the most important principles in C++. The idea: tie resource management to object lifetime.{"\n\n"}
• <b>Acquisition:</b> Resource (memory, file, etc.) acquired in the constructor{"\n"}
• <b>Release:</b> Resource released in the destructor{"\n"}
• Since destructors are called automatically when objects go out of scope, resources are always cleaned up — even if exceptions are thrown.{"\n\n"}
Examples: shared_ptr (memory), ifstream (file handles), lock_guard (mutexes)
</Tip>
<P>Three smart pointer types: <b>unique_ptr</b> (exclusive ownership — cannot copy, only move), <b>shared_ptr</b> (shared ownership — reference counted), <b>weak_ptr</b> (non-owning observer — doesn't prevent deletion).</P>
</>)}
]},

{id:4,title:"I/O, Algorithms, Errors",sub:"Lec 4 · File I/O, STL Algorithms, Exceptions, Operators",icon:"📦",color:C.o,sections:[
{title:"File I/O and CSV Parsing",content:(<>
<P>Our Portfolio Manager needs real price data. We download CSV files from Yahoo Finance (using a Python script — "use the right tool for the right job"), then read them in C++. This section teaches you how to read files using the Standard Library.</P>

<H>Stream Classes for Files</H>
<P>C++ handles files through <b>stream objects</b> — the same concept as cin/cout, but connected to files instead of keyboard/console:</P>
<P>• <b>ifstream</b> — input file stream (reading from a file)</P>
<P>• <b>ofstream</b> — output file stream (writing to a file)</P>
<P>• <b>fstream</b> — both read and write</P>
<P>All three are defined in the <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&lt;fstream&gt;</code> header.</P>

<P>An important design principle shows up here: files are <b>resources</b>. They must be opened before use and closed when done. C++ file streams follow <b>RAII</b> — the file opens when the stream object is created (constructor), and closes automatically when the object is destroyed (destructor). You never need to manually close files.</P>

<Code title="Writing to a file" code={`#include <fstream>
string filename = "output.txt";
ofstream outfile(filename);     // file opens here (constructor)

if (outfile) {                  // always check if it opened!
    outfile << "Hello" << endl;
    outfile << "Price: " << 150.0 << endl;
}
// file closes automatically when outfile goes out of scope (RAII)`}/>

<H>Reading and Parsing a CSV File</H>
<P>This is one of the most practical skills in the course. A CSV (Comma-Separated Values) file looks like this:</P>
<Code title="Example: prices.csv" code={`Date,GOOG,AMZN,META
2025-12-10,231.78,321.00,649.60
2025-12-11,230.28,313.70,652.18
2025-12-12,226.19,310.52,643.71`}/>

<P>The professor's approach to parsing this uses two nested loops. The outer loop reads <b>one line at a time</b> using <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>getline()</code>. The inner loop splits that line into fields using a comma delimiter. Let's walk through it step by step:</P>

<Code title="Professor's CSV parsing pattern" code={`#include <fstream>    // for ifstream
#include <sstream>    // for istringstream
#include <string>     // for string, getline, stod

ifstream infile("prices.csv");

// ALWAYS check if the file opened successfully
if (!infile) {
    cerr << "Unable to open file" << endl;
    return;  // or throw an exception
}

string line;
// Outer loop: read one LINE at a time
while (getline(infile, line)) {
    // Turn this line into a stream so we can parse it
    istringstream iss(line);
    string field;
    int col = 0;
    
    // Inner loop: extract fields separated by commas
    while (getline(iss, field, ',')) {
        if (col == 0) {
            // First column is the date (or symbol)
            string date = field;
        } else {
            // Other columns are prices — convert string to double
            double price = stod(field);  // string-to-double
        }
        col++;
    }
}`}/>

<P>The key insight: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>istringstream</code> lets you treat a string as if it were a stream. Then <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>getline(iss, field, ',')</code> reads from that stream until it hits a comma, storing each field. <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>stod()</code> (string-to-double) converts the text "231.78" to the number 231.78.</P>

<P>The professor stores this data in a <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>map&lt;string, vector&lt;double&gt;&gt;</code> where the key is the stock symbol and the value is a vector of historical prices. This makes it easy to look up any stock's price history by name.</P>

<Quiz questions={[
  {q:"What does istringstream do?",o:["Writes to a file","Treats a string as a stream for parsing","Converts integers to strings","Reads from the keyboard"],a:1,e:"It wraps a string so you can use stream operations (like getline with delimiter) on it."},
  {q:"What does stod() do?",o:["String to double","String to date","Stream to device","Stock to data"],a:0},
  {q:"What happens if you don't check `if (!infile)`?",o:["Nothing","File opens anyway","Program crashes silently if file missing","Compiler error"],a:2,e:"If the file doesn't exist, operations on infile silently fail. Always check."}
]}/>
</>)},

{title:"STL Algorithms",content:(<>
<P>The Standard Template Library (STL) has three pillars: <b>containers</b> (vector, map — where data lives), <b>iterators</b> (how you traverse data), and <b>algorithms</b> (what you do with data). We've covered containers and iterators. Now let's learn algorithms — the "verbs" of the STL.</P>

<P>Algorithms live in two headers: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&lt;algorithm&gt;</code> (sorting, searching, counting) and <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&lt;numeric&gt;</code> (mathematical operations like summing).</P>

<P>The powerful idea: algorithms work on <b>ranges</b> defined by iterators. This means the same algorithm works on vectors, arrays, maps — any container. That's generic programming in action.</P>

<H>std::accumulate — Sum Elements</H>
<P>This is the one the professor uses for the Portfolio Manager to compute sums and averages:</P>
<Code code={`#include <numeric>
vector<double> prices{100.0, 200.0, 150.0, 300.0};

// Sum all elements. Third argument is the initial value.
double total = accumulate(prices.begin(), prices.end(), 0.0);
// total = 750.0

// Average:
double avg = total / prices.size();  // 187.5`}/>
<P>The third argument (0.0) matters! If you write 0 instead of 0.0, it treats the sum as an integer, truncating decimals. Always use 0.0 for doubles.</P>

<H>std::find — Search for a Value</H>
<Code code={`#include <algorithm>
vector<int> v{10, 20, 30, 40, 50};

auto it = find(v.begin(), v.end(), 30);

if (it != v.end()) {
    cout << "Found: " << *it << endl;    // Found: 30
} else {
    cout << "Not found" << endl;
}
// find returns v.end() if the element is not found`}/>

<H>std::sort — Sort a Container</H>
<Code code={`vector<double> prices{300.0, 100.0, 250.0, 150.0};
sort(prices.begin(), prices.end());
// prices is now {100.0, 150.0, 250.0, 300.0} — ascending`}/>

<H>std::count — Count Occurrences</H>
<Code code={`vector<int> v{1, 2, 2, 3, 2, 4, 2};
int n = count(v.begin(), v.end(), 2);
// n = 4 (the value 2 appears 4 times)`}/>

<H>Using Algorithms for the Moving Average</H>
<P>For Assignment 2, you need to compute a next-day return prediction using something like a moving average. Here's how you'd compute a 30-day moving average using accumulate:</P>
<Code title="Moving average using STL" code={`double moving_average(const vector<double>& prices, int window) {
    if (prices.size() < window) 
        throw runtime_error("Not enough data");
    
    // Sum the last 'window' elements
    auto start = prices.end() - window;
    double sum = accumulate(start, prices.end(), 0.0);
    return sum / window;
}`}/>

<Quiz questions={[
  {q:"What does accumulate(v.begin(), v.end(), 0.0) compute?",o:["The average","The sum starting from 0.0","The count of elements","The maximum value"],a:1},
  {q:"What does find() return if the element is not found?",o:["nullptr","0","-1","container.end()"],a:3,e:"find returns the past-the-end iterator if not found. Always check it != end()."},
  {q:"Which header defines std::accumulate?",o:["<algorithm>","<numeric>","<vector>","<cmath>"],a:1}
]}/>
</>)},

{title:"Exception Handling",content:(<>
<P>What happens when something goes wrong? The file doesn't exist. The stock symbol isn't in our data. The network failed. We need a structured way to handle errors. C++ provides <b>exceptions</b> for situations where the code that <i>detects</i> the problem can't handle it — it needs to pass the error up to code that can.</P>

<Prof>"Very often, the location where an error is detected may not know how to handle the error. The Portfolio Manager tries to find next-day returns for a symbol we don't have historical data for. It knows there's a problem, but it doesn't know what the caller wants to do about it."</Prof>

<H>The Three Keywords</H>
<P><b>throw</b> — raises an exception when something goes wrong</P>
<P><b>try</b> — wraps code that might throw</P>
<P><b>catch</b> — handles the exception</P>

<Code title="Professor's exception pattern for PortfolioMgr" code={`#include <stdexcept>

// In the function that DETECTS the problem:
vector<double> PortfolioMgr::get_prices(const string& symbol) {
    auto iter = price_history_.find(symbol);
    if (iter == price_history_.end()) {
        // Symbol not found — we can't handle this here,
        // so we THROW an exception to whoever called us
        throw std::runtime_error("Symbol not found: " + symbol);
    }
    return iter->second;
}

// In the code that HANDLES the problem:
int main() {
    try {
        PortfolioMgr mgr("prices.csv");
        double ret = mgr.next_day_return("XYZ");  // XYZ doesn't exist!
        cout << ret << endl;
    }
    catch (const std::runtime_error& e) {
        // We land here if anything in the try block threw
        cout << "Error: " << e.what() << endl;
        // e.what() returns the message we passed to runtime_error
    }
}`}/>

<P>The flow: code in the <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>try</code> block runs normally. If a <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>throw</code> happens (anywhere, even deep in a function call chain), execution immediately jumps to the matching <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>catch</code> block. Code after the throw in the try block is skipped.</P>

<Exam>Always catch exceptions by <b>const reference</b>: catch(const std::runtime_error&amp; e). Three reasons: (1) avoids copying the exception object, (2) preserves polymorphic behavior (virtual functions like what() work correctly), (3) prevents object slicing. Catching by value is a classic interview mistake.</Exam>

<P><b>Exception matching uses first-fit rule:</b> catch blocks are checked in order. The first one that matches gets executed. So put specific exceptions before general ones:</P>
<Code code={`try { /* ... */ }
catch (const std::runtime_error& e) { /* specific */ }
catch (const std::exception& e)     { /* general — catches everything */ }
// NOT the other way around! general first would catch everything`}/>

<Quiz questions={[
  {q:"Why catch exceptions by const reference instead of by value?",o:["It's faster","Avoids slicing, preserves polymorphism, avoids copy","The compiler requires it","There's no difference"],a:1},
  {q:"What does e.what() return?",o:["The exception type","The error message string","The line number","The file name"],a:1},
  {q:"If you catch std::exception before std::runtime_error, what happens?",o:["Both catch blocks run","Only runtime_error catches","Only exception catches (first-fit rule)","Compiler error"],a:2}
]}/>
</>)},

{title:"const Members & Operator Overloading",content:(<>
<H>const Member Functions</H>
<P>We learned that <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>const</code> protects variables from modification. The same idea extends to objects. If you create a const object, you should still be able to call functions that <i>read</i> data but not functions that <i>change</i> data. The problem: the compiler doesn't know which functions modify the object and which don't — unless you tell it.</P>

<P>The solution: put <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>const</code> after the function signature to promise "this function does not modify the object":</P>

<Code code={`class Stock {
public:
    // These are const — they only READ data, never change it
    string get_symbol() const;   // note: const AFTER the ()
    double get_price() const;
    
    // These are NOT const — they CHANGE data
    void set_price(double price);
};

// A const object can ONLY call const member functions:
const Stock s("MSFT", 500.0, 1);
cout << s.get_symbol();    // OK — get_symbol() is const
cout << s.get_price();     // OK — get_price() is const
// s.set_price(600.0);     // ERROR! set_price() is NOT const`}/>

<P>Why does this matter? Remember pass by const reference? When you pass an object by const reference, it becomes const inside the function. If the object's member functions aren't marked const, you can't call them!</P>

<Code code={`// This function receives a CONST reference to a Stock
void print_stock(const Stock& s) {
    cout << s.get_symbol();  // ONLY works if get_symbol() is const!
    // s.set_price(0);       // ERROR: s is const, can't call non-const func
}`}/>

<Prof>"If you are using const objects and passing by const reference (which you should be doing for performance), then your getter functions MUST be marked const. Otherwise the compiler won't let you call them."</Prof>

<H>Operator Overloading: The {"<<"} Operator</H>
<P>Wouldn't it be nice to write <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>cout {"<<"} myStock;</code> and have it print the stock's details? For that, we need to <b>overload</b> the {"<<"} operator for our Stock class.</P>

<P>Here's the problem the professor walked through in detail: if we make it a <b>member function</b>, the object goes on the left side of the operator. That means usage would be <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>s {"<<"} cout;</code> — which is backwards and confusing! We want <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>cout {"<<"} s;</code>.</P>

<P>So we make it a <b>non-member function</b>. But then it can't access private data members like symbol_ and price_. The solution: make it a <b>friend</b> of the class — this gives it special permission to access private members.</P>

<Code title="The professor's operator<< pattern" code={`// In stock.h — declare the friend inside the class:
class Stock {
public:
    // ... constructors, getters, setters ...
    
    // Declare as friend — gives this function access to private members
    friend std::ostream& operator<<(std::ostream& os, const Stock& s);
    
private:
    string symbol_;
    double price_;
    int qty_;
};

// In stock.cpp — implement as a NON-MEMBER function:
std::ostream& operator<<(std::ostream& os, const Stock& s) {
    os << s.symbol_ << ", $" << s.price_ << ", qty: " << s.qty_;
    return os;  // return the stream for chaining: cout << s1 << s2;
}

// Now this works naturally:
Stock s("MSFT", 500.0, 10);
cout << s << endl;
// Output: MSFT, $500, qty: 10`}/>

<Prof>Scott Meyers, a famous C++ author, says: "Whenever you can avoid friend functions, you should, because much as in real life, friends are often more trouble than they're worth." Use friend only when there's a valid conceptual reason — like the {"<<"} operator which conceptually belongs to the class interface but can't be a member.</Prof>

<Hw num={2} title="OO Portfolio Manager (4%)" desc={`Starting from Assignment 1, incorporate ALL 6 changes discussed in class:
Change #1: Introduce a PortfolioMgr class
Change #2: Use smart pointers (shared_ptr) for memory management
Change #3: Download CSV data from Yahoo Finance, read it in the program
Change #4: Compute next-day returns using a moving average + at least one STL algorithm
Change #5: Exception handling for missing symbols, bad data
Change #6: Overload operator<< for Stock class

Include your .csv data files. Use relative paths so TAs can build without modification.
Due: Feb 11`} practice={`Build a GradeBook application:
1. Student class with: name (string), student_id (string), scores (vector<double>)
2. Read student data from a CSV file (name,id,score1,score2,score3,...)
3. Use std::accumulate to compute each student's average
4. Use std::sort to rank students by average (highest first)
5. Throw an exception if the CSV file cannot be opened
6. Overload operator<< for Student to print: "John Doe (ID: 12345) — Avg: 92.5"
7. Write a find_student(map, id) function that throws if the ID doesn't exist`}/>

<Quiz questions={[
  {q:"Can a const object call a non-const member function?",o:["Yes","No"],a:1,e:"A const object can only call const member functions. This is why marking getters as const is essential."},
  {q:"Why is operator<< a friend function instead of a member?",o:["It's faster","If it were a member, usage would be s << cout (wrong order)","Friend functions are always better","It needs to return void"],a:1},
  {q:"What does the mutable keyword do?",o:["Makes a variable changeable even in a const member function","Makes a function virtual","Prevents modification","Creates a temporary"],a:0,e:"mutable is an exception to the const rule — a mutable member can be changed even inside const functions."}
]}/>
</>)}
]},

// ═══════════════════════════════════════
// MODULE 5: INHERITANCE & OPTION PRICING
// ═══════════════════════════════════════
{id:5,title:"Inheritance & Pricing",sub:"Lec 5-7 · Inheritance, Polymorphism, BS, MC, Binomial Tree",icon:"🧬",color:C.accent,sections:[
{title:"Inheritance",content:(<>
<P>We've now covered two of the four OOP pillars: (1) Classes & Objects, (2) Encapsulation & Abstraction. Now we tackle <b>Inheritance</b> — the ability to create new classes based on existing ones.</P>

<H>Why Inheritance?</H>
<P>The professor used a classroom example: imagine we need classes for Student and Employee. Both have name and email, but Student has a major while Employee has a job title. Without inheritance, we'd duplicate the common code:</P>

<Viz>
<div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",alignItems:"flex-start"}}>
  <Box label="Student" items={["name","email","major","get_name()","get_email()","get_major()"]} color={C.r}/>
  <div style={{alignSelf:"center",color:C.td,fontSize:12,padding:"0 8px"}}>duplicated!</div>
  <Box label="Employee" items={["name","email","job","get_name()","get_email()","get_job()"]} color={C.r}/>
</div>
</Viz>

<P>With inheritance, we extract the common parts into a <b>base class</b>, and the specialized parts go into <b>derived classes</b>:</P>

<Viz>
<div style={{textAlign:"center"}}>
  <Box label="Person (base class)" items={["name, email","get_name(), get_email()"]} color={C.g}/>
  <div style={{width:2,height:16,background:C.g,margin:"0 auto"}}/>
  <div style={{display:"flex",justifyContent:"center",gap:20}}>
    <div><div style={{width:2,height:12,background:C.g,margin:"0 auto"}}/><Box label="Student" items={["+ major","+ get_major()"]} color={C.b}/></div>
    <div><div style={{width:2,height:12,background:C.g,margin:"0 auto"}}/><Box label="Employee" items={["+ job","+ get_job()"]} color={C.o}/></div>
  </div>
</div>
</Viz>

<Code title="Inheritance in C++" code={`class Person {
public:
    Person(string name, string email);
    string get_name() const;
    string get_email() const;
protected:           // accessible by Person AND derived classes
    string name_;    // (but not by outside code)
    string email_;
};

class Student : public Person {     // Student IS-A Person
public:
    Student(string name, string email, string major)
        : Person(name, email),       // initialize base class FIRST!
          major_(major) {}           // then initialize own members
    string get_major() const;
private:
    string major_;
};`}/>

<P>The key ideas:</P>
<P>• <b>public inheritance</b> (<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>: public Person</code>) = IS-A relationship. A Student IS-A Person.</P>
<P>• <b>protected</b> members: accessible by the class AND its derived classes, but not by outside code. Use this for base class data that derived classes need.</P>
<P>• The derived class constructor <b>calls the base class constructor</b> in its initializer list to set up inherited members.</P>
<P>• A derived class <b>inherits all members</b> from the base class (data and functions).</P>

<Tip title="Three Protection Levels (Complete Picture)">
<b>public:</b> anyone can access{"\n"}
<b>private:</b> only the class itself (derived classes CANNOT access){"\n"}
<b>protected:</b> the class + derived classes (outsiders CANNOT access)
</Tip>
</>)},

{title:"Virtual Functions & Abstract Classes",content:(<>
<P>Inheritance lets us share common code. But what about functions that have <i>different</i> implementations in each derived class? That's where <b>virtual functions</b> come in.</P>

<H>The Option Pricing Problem</H>
<P>The professor motivates this with option pricing. We have Call and Put options. Both have a strike and maturity. Both have a price() function. But the price() <i>formula</i> is different for each type. There's no single default implementation that works for all.</P>

<H>Virtual Functions</H>
<P>The <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>virtual</code> keyword in a base class says: "derived classes may override this function with their own implementation."</P>

<P><b>Pure virtual</b> (<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>= 0</code>) goes further: "derived classes MUST provide an implementation. I have no default."</P>

<Code title="Option class hierarchy (professor's design)" code={`class Option {
public:
    Option(double K, double T) : K_(K), T_(T) {}
    
    // Pure virtual: every derived class MUST implement this
    virtual double price(double S, double r, double v) const = 0;
    
    // Virtual destructor — ESSENTIAL for base classes!
    virtual ~Option() = default;
    
protected:
    double d1(double S, double r, double v) const;  // common code
    double d2(double S, double r, double v) const;  // shared by all
    double K_;   // strike
    double T_;   // maturity
};

class EuropeanCall : public Option {
public:
    EuropeanCall(double K, double T) : Option(K, T) {}
    
    // override keyword: tells compiler "I'm overriding a virtual function"
    // If the base signature doesn't match, compiler catches the error!
    double price(double S, double r, double v) const override;
};

class EuropeanPut : public Option {
public:
    EuropeanPut(double K, double T) : Option(K, T) {}
    double price(double S, double r, double v) const override;
};`}/>

<P>A class with at least one pure virtual function is called an <b>abstract class</b>. You <b>cannot create objects</b> of an abstract class directly — you can only create objects of its derived classes. This makes sense: "Option" is a concept; you always have a <i>specific</i> option type.</P>

<Exam>Virtual destructor is ESSENTIAL in any base class with virtual functions. Without it, deleting a derived object through a base pointer causes undefined behavior. The professor emphasizes this repeatedly. Use `virtual ~Option() = default;`</Exam>

<P>The <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>override</code> keyword (C++11) is optional but strongly recommended. It tells the compiler: "I intend to override a virtual function." If you accidentally misspell the function name or get the parameters wrong, the compiler catches it at compile time instead of silently creating a new function.</P>

<Quiz questions={[
  {q:"What makes a class abstract?",o:["Using the 'abstract' keyword","Having at least one pure virtual function (= 0)","Not having a constructor","Being declared const"],a:1},
  {q:"Can you create an object of an abstract class?",o:["Yes","No","Only with default constructor","Only on the heap"],a:1,e:"Abstract classes cannot be instantiated. You must create objects of derived (concrete) classes."},
  {q:"What does 'override' do?",o:["Creates a new virtual function","Tells compiler this overrides a base virtual function","Makes function pure virtual","Prevents further overriding"],a:1},
  {q:"Should a base class with virtual functions have a virtual destructor?",o:["Always yes","Optional","Only for abstract classes","Only with raw pointers"],a:0}
]}/>
</>)},

{title:"Polymorphism & Monte Carlo Pricer",content:(<>
<H>Polymorphism — The Most Powerful OOP Concept</H>
<P>Polymorphism (from Greek: "many forms") means: a base class pointer or reference can refer to <b>any derived type</b>, and the correct function is called automatically at runtime. This enables writing one function that works with ALL option types:</P>

<Code code={`// ONE pricer function that handles ANY option type!
double MCPricer::price(const Option& option, double S, 
                       double vol, double rate, unsigned long paths)
{
    double T = option.get_T();
    double sum = 0.0;
    for (unsigned long i = 0; i < paths; ++i) {
        double z = ndist_(eng_);   // standard normal random number
        double ST = S * exp((rate - 0.5*vol*vol)*T + vol*sqrt(T)*z);
        sum += option.get_expiration_payoff(ST);  // POLYMORPHISM!
        // Calls EuropeanCall::get_expiration_payoff if option is a call
        // Calls EuropeanPut::get_expiration_payoff if option is a put
        // The correct function is chosen at RUNTIME based on actual type
    }
    return exp(-rate * T) * (sum / paths);
}

// Usage — pass ANY option type:
EuropeanCall call(100.0, 1.0);
double callPrice = mc.price(call, 100, 0.3, 0.01, 100000);

EuropeanPut put(100.0, 1.0);
double putPrice = mc.price(put, 100, 0.3, 0.01, 100000);`}/>

<Prof>"Note how we pass a reference to the base Option class and use it to get the actual payoff using the derived type of the object. We don't need separate functions for calls and puts. One function handles everything."</Prof>

<P>This is <b>extensibility</b> in action. When you add a new option type (say, BinaryCall), you don't modify the pricer at all — you just create a new derived class. The pricer works with it automatically through polymorphism.</P>

<H>Random Number Generation</H>
<P>Monte Carlo needs random numbers from a standard normal distribution. C++ provides proper tools in <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&lt;random&gt;</code>:</P>

<Code code={`#include <random>

std::mt19937 eng;                        // Mersenne Twister engine
eng.seed(771);                           // fixed seed for reproducibility
std::normal_distribution<double> dist(0.0, 1.0);  // N(0,1)

for (int i = 0; i < 5; ++i) {
    double z = dist(eng);  // one random sample from N(0,1)
    cout << z << endl;
}`}/>

<Prof>"Using the same seed always produces the same sequence of numbers — useful for debugging and reproducibility."</Prof>

<Hw num={3} title="Black-Scholes Pricer (5%)" desc={`Use inheritance to write an OO Black-Scholes Pricer:
• Option base class (abstract) with pure virtual price()
• EuropeanCall and EuropeanPut derived classes
• Support price(), delta(), gamma()
• Test with: Call: S₀=100, K=100, T=1, σ=0.3, r=0.05
             Put: S₀=120, K=120, T=2, σ=0.4, r=0.1
Due: Feb 18`} practice={`Extend to Binary (Digital) options. Binary Call pays 1 if S_T > K, else 0. Binary Put pays 1 if S_T < K, else 0.
Build hierarchy: Option → EuropeanVanilla → {Call, Put}, Option → EuropeanBinary → {BinaryCall, BinaryPut}.
Gamma is the same for vanilla calls/puts but different for binary — put common gamma in EuropeanVanilla.`}/>

<Hw num={4} title="Monte Carlo Pricer (6%)" desc={`Complete the MC option pricer:
• Use Box-Muller method for random number generation
• Price European Call and Put
• Params: S₀=100, σ=0.3, r=0.01, T=2.0, K=100
• Run with M = 10000, 100000, 1000000 paths
Due: Feb 25`} practice={`Add 95% confidence interval calculation. For each M, compute:
CI = [Ĉ ± 1.96 × ω/√M]
where ω is sample std dev of discounted payoffs.
Print the price, CI bounds, and CI width for each M. Verify CI width shrinks with more paths.`}/>

<Quiz questions={[
  {q:"What enables polymorphism in C++?",o:["Templates","Virtual functions + base class pointer/reference","Operator overloading","Namespaces"],a:1},
  {q:"If you add a new option type (BarrierCall), do you need to modify MCPricer::price()?",o:["Yes, add a new case","No, polymorphism handles it automatically","Yes, add a new overload","Depends on the option"],a:1,e:"That's the power of polymorphism — the pricer works with any class derived from Option."},
  {q:"What random engine does the course use?",o:["rand()","std::mt19937 (Mersenne Twister)","random_device only","srand/rand"],a:1}
]}/>
</>)},

{title:"Binomial Tree Pricer",content:(<>
<P>The binomial tree is a discrete-time model for pricing options, including path-dependent ones (American, Barrier) that Black-Scholes can't handle analytically. The professor provided a partial implementation as a homework skeleton — understanding this structure is critical for the exam.</P>

<H>The Jarrow-Rudd Tree</H>
<P>At each time step, the stock price can go <b>up</b> or <b>down</b> with equal probability (0.5). Starting from S₀, we build a tree of possible stock prices:</P>

<P>Up move: S_up = S × exp((r - σ²/2)Δt + σ√Δt)</P>
<P>Down move: S_down = S × exp((r - σ²/2)Δt - σ√Δt)</P>

<P>The tree <b>recombines</b>: an up followed by a down ends at the same node as a down followed by an up. This keeps the tree manageable even with many time steps.</P>

<H>Data Structure — Professor's Exact Design</H>
<P>This is critical. The professor uses a <b>vector of vectors</b>, where each node stores both a stock price and an option price:</P>

<Code title="The tree data structure" code={`struct Node {
    double S;   // stock price at this node
    double C;   // option price at this node
};

// The tree: vector of vectors of Nodes
// tree_[i] = all nodes at time step i
// tree_[i][j] = specific node at time step i, vertical index j
// At time step i, there are (i+1) nodes
vector<vector<Node>> tree_;`}/>

<Viz>
<div style={{fontFamily:"monospace",fontSize:11,color:C.t,lineHeight:1.8}}>
<pre style={{margin:0,textAlign:"center"}}>{`Time:    0        1         2          3=T
      
       [0][0] ─ [1][1] ─ [2][2] ─── [3][3]  (top = most up moves)
                    ╲       ╲   ╲
       [0][0] ─ [1][0] ─ [2][1] ─── [3][2]
                            ╲   ╲
                          [2][0] ─── [3][1]
                                ╲
                              [3][0]  (bottom = most down moves)

tree_[i] has (i+1) nodes
tree_[3] has 4 nodes: [3][0], [3][1], [3][2], [3][3]`}</pre>
</div>
</Viz>

<H>The 4-Step Algorithm</H>
<Code title="Step 1 & 2: Build tree and populate stock prices (left → right)" code={`// Step 1: Create the tree structure
tree_.resize(N_ + 1);              // N+1 time steps
for (int i = 0; i <= N_; i++)
    tree_[i].resize(i + 1);        // i+1 nodes at time step i

// Step 2: Fill in stock prices
tree_[0][0].S = S0_;               // starting price
for (int i = 1; i <= N_; i++)
    for (int j = 0; j <= i; j++)
        tree_[i][j].S = S0_ * exp(nu_*i*dt_ + v_*sqrt_dt_*(2*j - i));`}/>

<Code title="Step 3: Terminal payoffs at t = T" code={`// At the rightmost nodes, we know the stock price.
// The option payoff is determined by the payoff function.
for (int j = 0; j <= N_; j++)
    tree_[N_][j].C = option.get_expiration_payoff(tree_[N_][j].S);
    // For a call: max(S - K, 0)
    // For a put:  max(K - S, 0)`}/>

<Code title="Step 4: Backward induction (right → left)" code={`// Work backwards from T to time 0
for (int ir = N_ - 1; ir >= 0; --ir)
    for (int j = 0; j <= ir; ++j) {
        // Discounted expected payoff from the two children:
        double discExpPayoff = disc_ * 0.5 * 
            (tree_[ir+1][j+1].C + tree_[ir+1][j].C);
        
        double St = tree_[ir][j].S;
        
        // Let the OPTION decide what to do (POLYMORPHISM!)
        tree_[ir][j].C = option.get_intermediate_payoff(St, discExpPayoff);
    }

// The answer is at the root:
return tree_[0][0].C;`}/>

<H>European vs American — The Polymorphic Difference</H>
<P>The brilliance of this design: the tree code is identical for all option types. The difference is in <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>get_intermediate_payoff()</code>, which each option type implements differently:</P>

<Code code={`// European: just use the discounted expected payoff
double EuropeanCall::get_intermediate_payoff(double St, 
    double discExpPayoff) const {
    return discExpPayoff;  // no early exercise
}

// American: compare with early exercise value, take the better one
double AmericanPut::get_intermediate_payoff(double St,
    double discExpPayoff) const {
    double earlyExercise = max(K_ - St, 0.0);
    return max(discExpPayoff, earlyExercise);  // investor chooses best
}`}/>

<Hw num={5} title="Extensible Pricer OR Regression (7%)" desc={`Choose one track:
Track A — Extensible Option Pricer: Refactor into PricingEngine hierarchy (abstract base). Support MC + Tree. Price European & American options.
  Tree: K=100, S₀=100, r=0.05, σ=0.3, T=1yr, N=1000 steps
  MC: S₀=100, σ=0.3, r=0.01, T=2, K=100, M=10000
Track B — Linear Regression with Eigen library.
Due: March 7`} practice={`Track A: Add a trinomial tree pricer. In a trinomial tree, stock goes up/flat/down with probabilities 1/6, 2/3, 1/6. Compare European call prices from MC, binomial, and trinomial.
Track B: Implement train/validation split. Add feature engineering (lagged returns, rolling std dev). Show metric improvement.`}/>

<Quiz questions={[
  {q:"In the professor's tree, how many nodes exist at time step i?",o:["i","i + 1","2^i","N + 1"],a:1},
  {q:"For American options, get_intermediate_payoff returns:",o:["discounted expected payoff","intrinsic value","max(discounted expected, intrinsic value)","min of the two"],a:2,e:"The investor exercises early only if early exercise is MORE profitable than continuing to hold."},
  {q:"What probability does the Jarrow-Rudd tree assign to up/down?",o:["0.25 / 0.75","0.5 / 0.5","Depends on volatility","Depends on rate"],a:1},
  {q:"Why does the tree use polymorphism for get_intermediate_payoff?",o:["Performance","So the same tree code works for European, American, and Barrier options","It's required by C++","To avoid templates"],a:1}
]}/>
</>)}
]},

// ═══════════════════════════════════════
// MODULE 6: AI/ML & TRADING
// ═══════════════════════════════════════
{id:6,title:"AI, RL & Trading",sub:"Lec 8-9 · Eigen, Reinforcement Learning, FIX, Final Review",icon:"🤖",color:C.y,sections:[
{title:"Linear Regression with Eigen",content:(<>
<P>The professor revisited the Portfolio Manager to add AI-powered predictions. Instead of a simple moving average, we use <b>linear regression</b> — the same model as Python's sklearn, but implemented in C++ using the Eigen library for linear algebra.</P>

<H>The Design: sklearn-style API in C++</H>
<P>The professor structured the C++ code to mirror the familiar Python interface:</P>
<Code title="Python (for comparison)" code={`from sklearn.linear_model import LinearRegression
lr = LinearRegression()
lr.fit(X_train, y_train)
predictions = lr.predict(X_test)`}/>

<Code title="C++ equivalent" code={`#include <Eigen/Dense>

class LinearRegression {
public:
    void fit(const Eigen::MatrixXd& X, const Eigen::VectorXd& y);
    Eigen::VectorXd predict(const Eigen::MatrixXd& X) const;
    double intercept() const;
    Eigen::VectorXd coefficients() const;
private:
    Eigen::VectorXd coefs_;
    double intercept_;
};

void LinearRegression::fit(const Eigen::MatrixXd& X, 
                           const Eigen::VectorXd& y) {
    // Add intercept column (column of 1s)
    Eigen::MatrixXd X_aug(X.rows(), X.cols() + 1);
    X_aug.col(0) = Eigen::VectorXd::Ones(X.rows());
    X_aug.rightCols(X.cols()) = X;
    
    // Solve least squares using Householder QR decomposition
    // This is what sklearn does behind the scenes!
    Eigen::VectorXd beta = X_aug.colPivHouseholderQr().solve(y);
    intercept_ = beta(0);
    coefs_ = beta.tail(beta.size() - 1);
}`}/>

<P>The professor introduced <b>Eigen::Map</b> for efficient data loading — it creates a vector <i>view</i> over existing memory without copying, and <b>std::span</b> (C++20) for similar non-owning views over contiguous data.</P>

<H>Third-Party Library Setup</H>
<P>Eigen is a header-only library (no compilation needed). You just point your build system to it:</P>
<P>• <b>CLion:</b> Add <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>include_directories(/path/to/eigen)</code> in CMakeLists.txt</P>
<P>• <b>Visual Studio:</b> Properties → C/C++ → Additional Include Directories</P>
</>)},

{title:"Reinforcement Learning: Frozen Lake",content:(<>
<Prof>"The most important thing I want to illustrate: using what we know, we can solve a lot of computing problems. You may not realize it, but using what we discussed so far, we can write and solve a lot of problems."</Prof>

<P>The professor demonstrated Monte Carlo reinforcement learning using the Frozen Lake problem: a 4×4 grid where an agent must navigate from Start to Goal without falling into Holes.</P>

<H>Key Concepts</H>
<P>• <b>State:</b> where the agent is (one of 16 cells)</P>
<P>• <b>Action:</b> left/down/right/up (0/1/2/3)</P>
<P>• <b>Reward:</b> +1 for reaching goal, -10 for falling in hole, 0 otherwise</P>
<P>• <b>Q-Table:</b> a 16×4 table storing "how good is action A in state S"</P>

<H>The Algorithm</H>
<P>1. <b>Simulate an episode</b> — the agent takes actions until it reaches the goal or falls in a hole</P>
<P>2. <b>Update the Q-table backward</b> — once we know the outcome, propagate the reward back through every state-action pair visited</P>

<Code title="C++ skeleton from slides" code={`// Simulate one episode
int state = 0;
vector<pair<int,int>> episode;
for (int t = 0; t < MAX_STEPS; ++t) {
    int action = select_action(Q, state, epsilon);
    int new_state = step(state, action);
    episode.push_back({state, action});
    state = new_state;
    if (is_terminal(state)) break;
}

// Backward Monte Carlo update — just like tree backpropagation!
int reward = get_reward(state);
for (auto it = episode.rbegin(); it != episode.rend(); ++it) {
    int s = it->first, a = it->second;
    visits[s][a]++;
    Q[s][a] += (reward - Q[s][a]) / visits[s][a];
}`}/>

<Prof>"The backward propagation part is conceptually similar to what we did in the binomial tree. The Monte Carlo simulation is similar to option pricing. Same C++ tools, different problem."</Prof>

<P>The professor noted two extensions to explore: <b>discount factor</b> (future rewards worth less — multiply by γ at each step) and <b>exploration vs exploitation</b> (sometimes take random actions to discover better paths).</P>

<Quiz questions={[
  {q:"What does the Q-table store?",o:["Stock prices","Expected value of each action in each state","The optimal path","Random numbers"],a:1},
  {q:"Why compute rewards backward through the episode?",o:["It's faster","We only know the outcome at the end","The compiler requires it","It uses less memory"],a:1},
  {q:"The backward update in RL is conceptually similar to:",o:["Forward pass in a neural network","Backward induction in the binomial tree","Sorting a vector","Reading a CSV file"],a:1}
]}/>
</>)},

{title:"Electronic Trading & Final Review",content:(<>
<H>Electronic Trading (FIX Protocol)</H>
<P>The professor used electronic trading as a case study to show OOP concepts in a real-world system. The FIX (Financial Information eXchange) protocol standardizes how trading firms communicate with exchanges.</P>

<P>C++ concepts appearing directly in trading systems:</P>
<P>• <b>Classes</b> → Orders, Messages, Sessions</P>
<P>• <b>Inheritance</b> → NewOrderSingle, OrderCancelRequest both derive from Message</P>
<P>• <b>Polymorphism</b> → Application callbacks (fromApp, toApp) handle different message types</P>
<P>• <b>Namespaces</b> → FIX protocol versions: FIX40::NewOrderSingle vs FIX44::NewOrderSingle</P>
<P>• <b>Multiple inheritance</b> → Used in stream class hierarchy</P>

<P>QuickFIX is an open-source C++ implementation of FIX. The professor noted: "I don't think trading specifics will be on the exam. But the OOP concepts demonstrated through these applications are key."</P>

<H>STL Container Comparison</H>
<Prof>"Bad programmers worry about the code. Good programmers worry about data structures and their relationships." — Linus Torvalds</Prof>
<P>• <b>std::array</b> — fixed size, fast access, compile-time size, no resize</P>
<P>• <b>std::vector</b> — dynamic size, fast random access, contiguous memory. <b>DEFAULT CHOICE.</b></P>
<P>• <b>std::list</b> — doubly linked list, fast insert/delete anywhere, no random access</P>
<P>• <b>std::map</b> — key-value pairs, balanced tree (Red-Black), sorted, reliable O(log n) search</P>
<P>There is no "best" container. The right choice depends on access patterns, insert/delete frequency, memory usage, and ordering requirements.</P>

<H>Final Exam Preparation</H>
<Exam>
<b>Exam format:</b> Open book, in-person. You may be asked to solve a computing problem using course concepts. Class design is the HARD part.<br/><br/>
<b>CRITICAL:</b> Use implementations taught in class. Different approaches lose points.<br/><br/>
<b>Must-know topics:</b> Quality metrics (5), references (what + why), pointers + const (4 cases), classes (constructors, member initializer list, const member functions, protection levels), copy constructor, assignment operator (self-assignment + return *this), move semantics, smart pointers (shared_ptr, unique_ptr), RAII, templates (function + class), STL containers (vector, map), iterators, STL algorithms (accumulate, find, sort, count), file I/O (ifstream + CSV parsing), exceptions (throw/try/catch by const ref, first-fit rule), operator overloading (operator=, operator{"<<"}), friend functions, include guards (#ifndef + #pragma once), inheritance (public, protected access), virtual functions, pure virtual (= 0), abstract classes, override keyword, virtual destructor, polymorphism, option pricing (BS formulas, MC simulation, binomial tree backward induction).
</Exam>

<Prof>"This course is not about writing code. It is about how we approach a problem. Class design is the important part, the hard part. Anyone can write code."</Prof>

<Quiz questions={[
  {q:"Which STL container should be your default choice?",o:["std::array","std::vector","std::map","std::list"],a:1},
  {q:"What is the most important thing about the final exam approach?",o:["Write as much code as possible","Use the EXACT implementations taught in class","Use the most efficient algorithm","Add lots of comments"],a:1},
  {q:"Which of these is NOT one of the course's quality metrics?",o:["Correct","Extensible","Portable","Readable"],a:2}
]}/>
</>)}
]}
];

// ─── MAIN APP ───
export default function App(){
  const[mod,setMod]=useState(null);
  const[sec,setSec]=useState(0);
  const[done,setDone]=useState({});
  const ref=useRef(null);
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
        <div ref={ref} style={{flex:1,overflowY:"auto",padding:"28px 40px 60px",maxWidth:900}}>
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
      <h1 style={{fontSize:36,margin:"0 0 8px",fontWeight:300,color:"white"}}>C++ <span style={{color:C.accent,fontWeight:600}}>Crash Course</span></h1>
      <p style={{color:C.td,fontSize:14.5,maxWidth:560,margin:"0 auto 24px",lineHeight:1.7}}>A comprehensive tutorial covering all 8 lectures. Rich explanations, visual diagrams, the professor's own words, quizzes, and practice assignments.</p>
      <div style={{maxWidth:380,margin:"0 auto"}}>
        <div style={{background:C.card,borderRadius:20,height:10,overflow:"hidden"}}><div style={{background:`linear-gradient(90deg,${C.accent},${C.g})`,height:"100%",width:`${pct}%`,borderRadius:20,transition:"width 0.5s"}}/></div>
        <div style={{fontSize:12,marginTop:8,color:C.td}}>{dn}/{total} sections completed ({pct}%)</div>
      </div>
    </div>
    <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px 48px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
      {MODULES.map(m=>{
        const md=m.sections.filter((_,i)=>done[`${m.id}-${i}`]).length;
        return(<div key={m.id} onClick={()=>setMod(m.id)} style={{background:C.card,borderRadius:14,padding:22,cursor:"pointer",border:`1px solid ${C.bd}`,transition:"all 0.2s",borderTop:`4px solid ${m.color}`}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=m.color;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 8px 24px rgba(0,0,0,0.3)`}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=C.bd;e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=""}}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:30}}>{m.icon}</span>
            <span style={{fontSize:10,color:m.color,background:`${m.color}18`,padding:"3px 10px",borderRadius:12,fontWeight:700,height:"fit-content"}}>{md}/{m.sections.length}</span>
          </div>
          <h3 style={{margin:"12px 0 4px",fontSize:16,color:"white"}}>{m.title}</h3>
          <div style={{fontSize:12,color:C.td,marginBottom:14,lineHeight:1.4}}>{m.sub}</div>
          <div style={{background:C.bd,borderRadius:6,height:5,overflow:"hidden"}}><div style={{background:m.color,height:"100%",width:`${(md/m.sections.length)*100}%`,transition:"width 0.3s"}}/></div>
        </div>);
      })}
    </div>
  </div>);
}
