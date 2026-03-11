# Runnable Assignment Code Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add complete runnable code sections to assignments and remove Checklist component from entire codebase.

**Architecture:** Add new FullCode collapsible component, remove Checklist component and all usages, embed complete code from assets into assignment files.

**Tech Stack:** React, JSX, Prism.js syntax highlighting

---

## Chunk 1: Component Changes

### Task 1: Add FullCode Component

**Files:**
- Modify: `src/components.jsx`

- [ ] **Step 1: Add FullCode component after Checklist definition**

```jsx
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
```

- [ ] **Step 2: Remove Checklist component definition**

Delete the entire Checklist function (lines ~263-283 in components.jsx).

- [ ] **Step 3: Update component exports**

Remove `Checklist` from the exports if it's exported separately. The components.jsx uses inline exports, so just deleting the function is sufficient.

- [ ] **Step 4: Verify build works**

Run: `npm run build`
Expected: Build succeeds (may have unused import warnings which we'll fix next)

- [ ] **Step 5: Commit**

```bash
git add src/components.jsx
git commit -m "feat: add FullCode component, remove Checklist"
```

---

### Task 2: Remove Checklist from Module Files

**Files:**
- Modify: `src/data/module1.jsx`
- Modify: `src/data/module2.jsx`
- Modify: `src/data/module3.jsx`
- Modify: `src/data/module4.jsx`
- Modify: `src/data/module5.jsx`
- Modify: `src/data/module6.jsx`

- [ ] **Step 1: Remove Checklist from imports in each module**

In each module file, remove `Checklist` from the import statement:
```jsx
// Before
import { C, P, H, B, Code, ..., Checklist } from "../../components";
// After
import { C, P, H, B, Code, ... } from "../../components";
```

- [ ] **Step 2: Remove all `<Checklist>` JSX usages from each module**

Search for `<Checklist` in each file and delete the entire component usage.

- [ ] **Step 3: Verify build works**

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/data/module*.jsx
git commit -m "refactor: remove Checklist from all modules"
```

---

## Chunk 2: Assignment 1-2 Updates

### Task 3: Update Assignment 1

**Files:**
- Modify: `src/data/assignments/assignment1.jsx`

- [ ] **Step 1: Update imports - remove Checklist, add FullCode**

```jsx
import { C, P, H, B, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, FullCode } from "../../components";
```

- [ ] **Step 2: Remove `<Checklist>` component**

Delete the entire `<Checklist items={[...]}/>` block.

- [ ] **Step 3: Add FullCode section before closing `</>`**

Add after `</Quiz>`:

```jsx
<FullCode files={[
{name:"Stock.h",code:`#ifndef STOCK_H
#define STOCK_H

#include <string>

class Stock {
public:
    Stock(std::string symbol, double price, int quantity);

    std::string getTicker() const;
    double getPrice() const;
    int getQuantity() const;

    double getMarketValue() const;

private:
    std::string symbol_;
    double price_;
    int quantity_;
};

#endif // STOCK_H`},
{name:"Stock.cpp",code:`#include "Stock.h"

Stock::Stock(std::string symbol, double price, int quantity)
    : symbol_(symbol), price_(price), quantity_(quantity) {
}

std::string Stock::getTicker() const {
    return symbol_;
}

double Stock::getPrice() const {
    return price_;
}

int Stock::getQuantity() const {
    return quantity_;
}

double Stock::getMarketValue() const {
    return price_ * quantity_;
}`},
{name:"main.cpp",code:`#include <iostream>
#include <vector>
#include "Stock.h"

int main() {
    // Create empty vector to hold stocks
    std::vector<Stock> portfolio;

    // Add 5 stocks
    portfolio.emplace_back("AAPL", 248.04, 100);
    portfolio.emplace_back("GOOGL", 327.93, 50);
    portfolio.emplace_back("MSFT", 465.95, 75);
    portfolio.emplace_back("AMZN", 239.16, 30);
    portfolio.emplace_back("NVDA", 187.67, 40);

    // Calculate total value using iterator
    double totalValue = 0.0;
    for (auto it = portfolio.begin(); it != portfolio.end(); ++it) {
        totalValue += it->getMarketValue();
    }

    // Print each stock
    std::cout << "=== Stock Portfolio ===" << std::endl;
    for (const auto& stock : portfolio) {
        std::cout << stock.getTicker() << ": $" << stock.getMarketValue() << std::endl;
    }

    // Print total
    std::cout << "Total: $" << totalValue << std::endl;

    return 0;
}`}
]}/>
```

- [ ] **Step 4: Commit**

```bash
git add src/data/assignments/assignment1.jsx
git commit -m "feat(assignment1): add FullCode, remove Checklist"
```

---

### Task 4: Update Assignment 2

**Files:**
- Modify: `src/data/assignments/assignment2.jsx`

- [ ] **Step 1: Update imports**

Remove Checklist, add FullCode.

- [ ] **Step 2: Remove `<Checklist>` component**

- [ ] **Step 3: Add FullCode section with Stock.h, Stock.cpp, Portfolio.h, Portfolio.cpp, main.cpp**

(Code from assets/Zhu_Dafu_Assignment2/)

- [ ] **Step 4: Commit**

```bash
git add src/data/assignments/assignment2.jsx
git commit -m "feat(assignment2): add FullCode, remove Checklist"
```

---

## Chunk 3: Assignment 3-4 Updates

### Task 5: Update Assignment 3

**Files:**
- Modify: `src/data/assignments/assignment3.jsx`

- [ ] **Step 1: Update imports**

- [ ] **Step 2: Remove `<Checklist>` component**

- [ ] **Step 3: Add FullCode section with Option.h, Option.cpp, EuropeanCall.h, EuropeanCall.cpp, EuropeanPut.h, EuropeanPut.cpp, main.cpp**

(Code from assets/Zhu_Dafu_Assignment3/)

- [ ] **Step 4: Commit**

```bash
git add src/data/assignments/assignment3.jsx
git commit -m "feat(assignment3): add FullCode, remove Checklist"
```

---

### Task 6: Update Assignment 4

**Files:**
- Modify: `src/data/assignments/assignment4.jsx`

- [ ] **Step 1: Update imports**

- [ ] **Step 2: Remove `<Checklist>` component**

- [ ] **Step 3: Add FullCode section**

Files: Option.h, Option.cpp, EuropeanCall.h, EuropeanCall.cpp, EuropeanPut.h, EuropeanPut.cpp, MCPricer.h, MCPricer.cpp, main.cpp

(Code from assets/Zhu_Dafu_Assignment4/)

- [ ] **Step 4: Commit**

```bash
git add src/data/assignments/assignment4.jsx
git commit -m "feat(assignment4): add FullCode, remove Checklist"
```

---

## Chunk 4: Assignment 5 Update

### Task 7: Update Assignment 5

**Files:**
- Modify: `src/data/assignments/assignment5.jsx`

- [ ] **Step 1: Update imports**

- [ ] **Step 2: Remove `<Checklist>` component**

- [ ] **Step 3: Add FullCode section**

Files: Option.h, Option.cpp, EuropeanCall.h, EuropeanCall.cpp, EuropeanPut.h, EuropeanPut.cpp, AmericanCall.h, AmericanCall.cpp, AmericanPut.h, AmericanPut.cpp, Pricer.h, MCPricer.h, MCPricer.cpp, TreePricer.h, TreePricer.cpp, main.cpp

(Code from assets/Zhu_Dafu_Assignment5/)

- [ ] **Step 4: Commit**

```bash
git add src/data/assignments/assignment5.jsx
git commit -m "feat(assignment5): add FullCode, remove Checklist"
```

---

## Chunk 5: Final Verification

### Task 8: Build and Test

- [ ] **Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors

- [ ] **Step 2: Run dev server and visually verify**

```bash
npm run dev
```

Check each assignment page - FullCode section should be collapsed by default, expand on click.

- [ ] **Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: final adjustments"
```
