# Runnable Assignment Code Design

## Summary

Add complete, runnable code sections to each assignment in the C++ Crash Course. This ensures students can copy-paste and run the full solution after learning from the annotated explanations.

## Changes

### 1. New Component: `FullCode`

**Location:** `src/components.jsx`

**API:**
```jsx
<FullCode title="Complete Runnable Code" files={[
  {name: "Stock.h", code: `...`},
  {name: "Stock.cpp", code: `...`},
  {name: "main.cpp", code: `...`}
]}/>
```

**Behavior:**
- Collapsed by default (shows title + file count)
- Click to expand all files
- Each file has a header with filename
- Prism syntax highlighting for C++
- Styled to match existing `Code` component

### 2. Remove Checklist Component Entirely

**Delete from codebase:**
- Remove `Checklist` function from `src/components.jsx`
- Remove `Checklist` from exports in `src/components.jsx`
- Remove all `<Checklist>` usages from:
  - `src/data/assignments/assignment1-5.jsx`
  - `src/data/module1-6.jsx`
- Remove `Checklist` import from `src/App.jsx` if present

### 3. Add FullCode to Assignments

For each assignment in `src/data/assignments/`:
- **Add** `<FullCode>` section at the end (after `<Quiz>`)

### 3. Files to Embed Per Assignment

| Assignment | Files |
|------------|-------|
| 1 | `Stock.h`, `Stock.cpp`, `main.cpp` |
| 2 | `Stock.h`, `Stock.cpp`, `Portfolio.h`, `Portfolio.cpp`, `main.cpp` |
| 3 | `Option.h`, `Option.cpp`, `EuropeanCall.h`, `EuropeanCall.cpp`, `EuropeanPut.h`, `EuropeanPut.cpp`, `main.cpp` |
| 4 | Assignment 3 files + `MCPricer.h`, `MCPricer.cpp` |
| 5 | All option files + `Pricer.h`, `MCPricer.h`, `MCPricer.cpp`, `TreePricer.h`, `TreePricer.cpp`, `AmericanCall.h`, `AmericanCall.cpp`, `AmericanPut.h`, `AmericanPut.cpp`, `main.cpp` |

### 4. Code Source

Copy code from `assets/Zhu_Dafu_AssignmentX/` (local reference, not committed) into the JSX files.

## Non-Goals

- No CMakeLists.txt or build files
- No changes to existing annotated code sections (they remain pedagogical)
- No external file references (all code embedded inline)

## File Changes Summary

| File | Change |
|------|--------|
| `src/components.jsx` | Add `FullCode` component |
| `src/data/assignments/assignment1.jsx` | Remove Checklist, add FullCode |
| `src/data/assignments/assignment2.jsx` | Remove Checklist, add FullCode |
| `src/data/assignments/assignment3.jsx` | Remove Checklist, add FullCode |
| `src/data/assignments/assignment4.jsx` | Remove Checklist, add FullCode |
| `src/data/assignments/assignment5.jsx` | Remove Checklist, add FullCode |
