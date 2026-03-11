import { C, P, H, B, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz } from "../components";

const module1 = {
id:1, title:"C++ Foundations", sub:"Lec 1 · Your First Program, Types, Functions, References, Pointers", icon:"⚡", color:C.g,
sections:[

// ═══════ 1.1 QUALITY ═══════
{title:"Writing High Quality Code",content:(<>
<P>Before writing any code, the professor established the philosophy that drives the entire course:</P>
<Prof>"Anyone can write code. Our goal is not just to write code — it is to write high quality code. If you just want to write something that runs, we can do that easily. But that's not going to be enough to make you a good developer."</Prof>

<P>So what does "high quality" actually mean? The professor defined five <B>specific, testable metrics</B>. Every design decision in this course — every feature of C++ we learn — is justified by at least one of these metrics. You should be able to name all five from memory.</P>

<Step n={1} title="Metric 1: Correct / Reliable">
The program must produce the right results. If your option pricer gives the wrong price, nothing else matters. Correctness is the baseline — everything else builds on it. C++ helps with this through <B>type safety</B> — the compiler catches type mismatches before your program even runs.
</Step>

<Step n={2} title="Metric 2: Efficient / Performant">
Don't waste time or memory. Later in this course, we'll see a dramatic example: passing a 1000×1000 matrix by value copies 8 million bytes. Pass by const reference copies zero bytes. Same result, vastly different cost. C++ gives you direct control over memory and performance — that's why finance uses it.
</Step>

<Step n={3} title="Metric 3: Readable / Clear">
Code should express its intention clearly. Other people (and future you) need to understand it. The professor quoted Martin Fowler: <i>"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."</i> We'll see this when we learn <B>const</B> (makes intention visible), <B>type aliases</B> (makes parameters self-documenting), and <B>classes</B> (groups related things together).
</Step>

<Step n={4} title="Metric 4: Reusable / Maintainable">
Write code once, use it many times. If you fix a bug, fix it in one place, not fifty. This is why we use <B>functions</B> (reusable logic), <B>classes</B> (reusable types), and <B>templates</B> (reusable across types).
</Step>

<Step n={5} title="Metric 5: Extensible">
Can you add new features without rewriting everything? We'll see this powerfully when we learn <B>inheritance</B> and <B>polymorphism</B> — you can add a new option type (American, Barrier) to a pricer without modifying any existing pricing code.
</Step>

<Exam>If asked "What is high quality code?" on the exam, list all five metrics with brief explanations. The professor defined these on Slide 5 of Lecture 1 and referenced them in nearly every subsequent lecture.</Exam>
</>)},

// ═══════ 1.2 HELLO WORLD ═══════
{title:"Your First Program: Hello World",content:(<>
<Flowchart title="Strategy: What We Need for a First Program"
  steps={[
    {label:"Goal",items:["Print a message","to the screen"],color:C.g},
    {label:"C++ Features",items:["main() function","cout object","<< operator"],color:C.b},
    {label:"Infrastructure",items:["#include","namespace","Build process"],color:C.o},
  ]}
/>

<P>Every C++ program starts at a special function called <B>main()</B>. It's the entry point — when you run your program, the computer looks for main() and starts executing there. Let's build the simplest possible program, line by line:</P>

<AnnotatedCode title="hello.cpp — Your first C++ program" lines={[
  {code:"#include <iostream>", why:"This is a preprocessor directive — it tells the compiler 'before you compile, copy the contents of the iostream header file here.' iostream gives us access to cout (console output) and cin (console input)."},
  {code:"", why:""},
  {code:"int main() {", why:"Every program must have exactly one main() function. 'int' means it returns an integer to the operating system (0 = success). The curly brace { starts the function body."},
  {code:'    std::cout << "Hello, World!" << std::endl;', why:"std::cout is the console output object. << is the 'stream insertion operator' — it sends data to the stream. std::endl ends the line and flushes the buffer (forces output to screen)."},
  {code:"    return 0;", why:"Returns 0 to the OS meaning 'program ran successfully.' In main() specifically, this line is optional — 0 is implied if you omit it."},
  {code:"}", why:"Closes the function body. Everything between { and } is the function body."},
]}/>

<H>Namespaces: Avoiding std:: Everywhere</H>
<P>Writing <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>std::cout</code> every time is verbose. The <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>std</code> part is a <B>namespace</B> — a way to group related names. Everything in the Standard Library lives in the <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>std</code> namespace. The <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>::</code> is the scope resolution operator — it says "the cout that belongs to std."</P>

<P>The professor showed two ways to shorten this:</P>

<AnnotatedCode title="Technique 1 (PREFERRED by professor): using individual names" lines={[
  {code:"using std::cout;", why:"This says: 'when I write cout, I mean std::cout.' Now we can write just cout instead of std::cout."},
  {code:"using std::endl;", why:"Same for endl. Import only what you need — safer in large programs."},
]}/>

<AnnotatedCode title="Technique 2 (USE WITH CAUTION): using namespace" lines={[
  {code:"using namespace std;", why:"This imports EVERYTHING from std. Convenient but risky — in large programs, names from different namespaces can clash. The professor said: 'I encourage everyone to use the first technique.'"},
]}/>

<Confusion
  mistake="Using 'using namespace std;' in header files"
  why="Header files get included by many source files. If a header says 'using namespace std;', it forces that decision on every file that includes it, potentially causing name clashes. Only use it in .cpp files if at all."
/>

<H>Standard Input with cin</H>
<P><code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>cin</code> (pronounced "see-in") reads from the keyboard. It uses the <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>{">>"}</code> extraction operator — the opposite direction of <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>{"<<"}</code>:</P>

<AnnotatedCode lines={[
  {code:"int x;", why:"Declare a variable to hold what the user types."},
  {code:"cin >> x;", why:">> extracts data from the keyboard stream and stores it in x. Program pauses here and waits for the user to type something and press Enter."},
]}/>

<H>Comments</H>
<P>Comments explain code to humans. The compiler ignores them entirely:</P>
<Code code={`// This is a C++ style comment — one line only

/* This is a C style comment.
   It can span multiple lines.
   Useful for commenting out blocks of code. */`}/>

<H>The Build Process</H>
<P>C++ source code doesn't run directly. It goes through three stages to become an executable program:</P>
<Flowchart title="C++ Build Process"
  steps={[
    {label:"1. Preprocessing",items:["Handles #include","Expands macros","Output: pure C++"],color:C.b},
    {label:"2. Compiling",items:["Checks syntax","Checks types","Creates .obj files"],color:C.o},
    {label:"3. Linking",items:["Combines .obj files","Resolves references","Creates .exe"],color:C.g},
  ]}
/>
<P>Build errors can happen at any stage. Knowing which stage helps you diagnose problems: a missing semicolon is a compile error; a missing function body is a link error; a missing #include is a preprocessing error.</P>

<Quiz questions={[
  {q:"What is the entry point of every C++ program?",o:["start()","begin()","main()","run()"],a:2},
  {q:"What does #include <iostream> do?",o:["Imports the iostream library at runtime","Copies the iostream header content into your file before compilation","Creates a new iostream object","Links to the iostream binary"],a:1,e:"#include is a preprocessor directive — it happens BEFORE compilation."},
  {q:"What is the preferred way to use cout without std:: prefix?",o:["using namespace std;","using std::cout;","import cout;","#define cout std::cout"],a:1,e:"The professor recommends importing individual names, not the entire namespace."},
  {q:"A missing function body (defined in a header but never implemented) causes an error at which stage?",o:["Preprocessing","Compilation","Linking","Runtime"],a:2,e:"The linker resolves references to function definitions. A missing body means the linker can't find the symbol."},
  {q:"Consider:\n```cpp\nint main() {\n    cout << \"Hello\";\n    return 0;\n}\n```\nThis program fails to compile. Why?",o:["main() must return void","cout is not declared — missing #include <iostream> and using std::cout","return 0 is not allowed","Strings must use single quotes"],a:1,e:"Without #include <iostream> and a using declaration, cout is unknown to the compiler."},
]}/>
</>)},

// ═══════ 1.3 DATA TYPES ═══════
{title:"Data Types & Variables",content:(<>
<P>Programs exist to manipulate data. To store data, we use <B>variables</B>. In C++, every variable must have a <B>type</B> — the type tells the compiler two things: how much memory to reserve, and what operations are allowed on that data.</P>

<Prof>"Once a type is assigned to a variable, it cannot be changed. In C++, every variable has to have a type, the type has to be declared before it is used."</Prof>

<Flowchart title="C++ Type System"
  steps={[
    {label:"Fundamental Types",items:["int, double, float","bool, char","Built into language"],color:C.g},
    {label:"Library Types",items:["std::string","std::vector","From Standard Library"],color:C.b},
    {label:"User-Defined Types",items:["class Stock","class Option","You create these"],color:C.accent},
  ]}
/>

<H>Integer Types — Whole Numbers</H>

<Step n={1} title="Choosing an integer type">
C++ offers several integer sizes. The key difference is how many bytes each uses, which determines the range of values it can hold:
</Step>

<MemDiagram title="Integer Types: Memory vs Range" cells={[
  {label:"short",value:"2 bytes",color:C.b,addr:"±32,767"},
  {label:"int",value:"4 bytes",color:C.g,addr:"±2.1 billion"},
  {label:"long",value:"≥4 bytes",color:C.o,addr:"larger"},
]}/>

<P>For this course, <B>int</B> is the default choice for whole numbers (quantities, loop counters, array indices). Use <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>unsigned</code> variants when you know the value is never negative (e.g., <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>unsigned int</code> stores 0 to ~4.3 billion).</P>

<H>Floating-Point Types — Decimal Numbers</H>

<Step n={2} title="float vs double — ALWAYS use double for finance">
<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>float</code> uses 4 bytes (~7 significant digits). <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>double</code> uses 8 bytes (~15 significant digits). When computing option prices, portfolio values, or risk metrics, those extra digits of precision prevent rounding errors from accumulating. The professor uses double exclusively.
</Step>

<Prof>"Only very few real values can be represented exactly in binary. For example, 0.25, 0.5, 0.75 can be stored exactly, but 0.1 cannot. This matters when you compare two floating-point numbers — you should use a tolerance, not exact equality."</Prof>

<Confusion
  mistake="Comparing doubles with == (e.g., if (x == 0.1))"
  why="0.1 cannot be represented exactly in binary. After calculations, x might be 0.09999999999999998 instead of exactly 0.1. Use a tolerance: if (abs(x - 0.1) < 1e-9)"
/>

<H>Other Types</H>

<AnnotatedCode lines={[
  {code:"bool isValid = true;", why:"Boolean — stores true or false. Used for conditions in if/while statements."},
  {code:"char grade = 'A';", why:"Character — stores a single character in single quotes. Uses 1 byte."},
  {code:'std::string symbol = "AAPL";', why:"String — a sequence of characters in double quotes. NOT a fundamental type — it comes from the <string> header in the Standard Library."},
]}/>

<H>The const Keyword — Making Promises to the Compiler</H>

<Step n={3} title="const prevents modification">
When you mark a variable <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>const</code>, you're telling the compiler: "this value will never change." If any code tries to modify it, the compiler produces an error. This is <B>type safety</B> — the compiler enforces your intention.
</Step>

<AnnotatedCode lines={[
  {code:"const double pi = 3.14159265;", why:"Declares pi as a constant. The 'const' keyword prevents any code from modifying this value after initialization."},
  {code:"// pi = 4.5;", why:"ERROR! The compiler catches this at compile time: 'you said this was const, but you're trying to change it.'"},
]}/>

<P>The professor returns to <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>const</code> repeatedly throughout the course — const references, const member functions, const pointers. It's one of the most important keywords in C++.</P>

<H>static_cast — Explicit Type Conversion</H>

<Confusion
  mistake="Writing `int a=3, b=2; cout << a/b;` and expecting 1.5"
  why="Both a and b are integers, so C++ performs INTEGER division: 3/2 = 1 (the .5 is discarded). To get 1.5, explicitly convert one operand to double using static_cast<double>(a) / b."
/>

<AnnotatedCode lines={[
  {code:"int a = 3, b = 2;", why:"Two integer variables."},
  {code:"cout << a / b;", why:"Prints 1 — integer division truncates the decimal. This is a very common source of bugs."},
  {code:"cout << static_cast<double>(a) / b;", why:"Prints 1.5 — static_cast temporarily treats 'a' as a double for this expression, forcing floating-point division."},
]}/>

<H>Prefix vs Postfix Increment</H>

<AnnotatedCode title="A classic interview question" lines={[
  {code:"int x = 3;", why:"Start with x equal to 3."},
  {code:"int y = x++;", why:"POSTFIX: first, y gets the CURRENT value of x (which is 3). Then x is incremented to 4. Result: y=3, x=4."},
  {code:"int z = ++x;", why:"PREFIX: first, x is incremented to 5. Then z gets the NEW value of x (which is 5). Result: z=5, x=5."},
]}/>

<Tip title="Memory trick">Postfix (x++) = "use, then increment" — the ++ comes AFTER, so the increment happens after.{"\n"}Prefix (++x) = "increment, then use" — the ++ comes BEFORE, so the increment happens before.</Tip>

<H>Type Aliases — Self-Documenting Code</H>

<Conversion
  from="Confusing function signature"
  to="Self-documenting signature"
  feature="Type alias (using keyword)"
  beforeCode={`double CallPrice(double s,
  double k, double r,
  double v, double t);
// Which double is which??`}
  afterCode={`using StockPrice = double;
using Strike = double;
using Rate = double;

double CallPrice(StockPrice s,
  Strike k, Rate r,
  Volatility v, Expiration t);
// Crystal clear!`}
/>

<H>Binary Representation (Appendix)</H>
<P>Computers store everything as 1s and 0s (bits). A group of 8 bits is a byte. With n bits, you can represent 2ⁿ different values. For 3 bits: 000=0, 001=1, 010=2, 011=3, 100=4, 101=5, 110=6, 111=7. For negative numbers, the leftmost bit stores the sign (using two's complement). For fractions, bits after the "decimal point" represent powers of 1/2: 0.1₂ = 0.5, 0.01₂ = 0.25. This is why 0.1₁₀ can't be stored exactly — it requires infinite binary digits.</P>

<Quiz questions={[
  {q:"What is the size of a double in C++?",o:["2 bytes","4 bytes","8 bytes","16 bytes"],a:2,e:"double = 8 bytes (~15 significant digits). float = 4 bytes (~7 digits)."},
  {q:"What does `int y = x++;` produce when x is 3?",o:["y=4, x=4","y=3, x=4","y=3, x=3","Compile error"],a:1,e:"Postfix: returns old value (3) to y, THEN increments x to 4."},
  {q:"Why can't you compare doubles with ==?",o:["Doubles can't be compared","Many decimal values can't be stored exactly in binary","The compiler doesn't allow it","It's slower than using <"],a:1},
  {q:"Is std::string a fundamental type?",o:["Yes","No — it's from the Standard Library"],a:1},
  {q:"Consider:\n```cpp\nint a = 7, b = 2;\ncout << a / b << endl;\n```\nWhat is printed?",o:["3.5","3","4","Compile error"],a:1,e:"Both operands are integers → integer division. 7/2 = 3 (decimal truncated). Use static_cast<double>(a)/b to get 3.5."},
  {q:"Consider:\n```cpp\nint x = 5;\nint y = ++x;\nint z = x++;\ncout << x << \" \" << y << \" \" << z;\n```\nWhat is printed?",o:["7 6 6","6 5 6","7 5 6","6 6 5"],a:0,e:"++x increments x to 6 then assigns y=6. x++ assigns z=6 (current value) then increments x to 7."},
  {q:"Which of the following correctly converts integer division to floating-point division?",o:["(double)(a / b)","static_cast<double>(a) / b","double(a / b)","a / b * 1.0"],a:1,e:"static_cast<double>(a) converts a to double BEFORE division. (double)(a/b) converts AFTER integer division already happened."},
  {q:"What does const do when applied to a variable?",o:["Makes it global","Prevents the variable from being modified after initialization","Makes it faster","Converts it to a string"],a:1},
]}/>

</>)},

// ═══════ 1.4 FUNCTIONS ═══════
{title:"Functions",content:(<>
<Flowchart title="Strategy: Why Functions?"
  steps={[
    {label:"Problem",items:["Big programs are","hard to manage"],color:C.r},
    {label:"Solution",items:["Break into small","named pieces"],color:C.b},
    {label:"Result",items:["Reusable, testable","maintainable code"],color:C.g},
  ]}
/>

<P>We do NOT write everything in main(). We break programs into <B>functions</B> — named blocks of code that perform one specific task. A function takes inputs, does work, and produces an output.</P>

<AnnotatedCode title="Anatomy of a function" lines={[
  {code:"int add(int a, int b) {", why:"'int' is the return type (what comes out). 'add' is the name. 'int a, int b' are parameters (what goes in). The { starts the body."},
  {code:"    return a + b;", why:"Computes the result and sends it back to whoever called this function."},
  {code:"}", why:"Ends the function body."},
  {code:"", why:""},
  {code:"int main() {", why:"The program starts here."},
  {code:"    int result = add(2, 3);", why:"'Calling' the function: passes 2 and 3 as arguments, stores the returned value (5) in result."},
  {code:"    cout << result << endl;", why:"Prints 5 to the console."},
  {code:"}", why:""},
]}/>

<Tip title="Five Advantages of Functions (from Lecture 1, Slide 38)">
<B>1. Decomposition</B> — break complex problems into manageable pieces{"\n"}
<B>2. Readability</B> — a well-named function documents itself{"\n"}
<B>3. Reuse</B> — write once, call many times{"\n"}
<B>4. Maintainability</B> — fix bugs in one place{"\n"}
<B>5. Type safety</B> — compiler checks argument types
</Tip>

<H>Function Overloading</H>
<P>C++ allows multiple functions with the same name, as long as they take different parameter types. The compiler picks the right one based on what you pass:</P>

<AnnotatedCode lines={[
  {code:"int add(int a, int b) { return a+b; }", why:"Version for integers."},
  {code:"double add(double a, double b) { return a+b; }", why:"Version for doubles. Same name, different types — this is overloading."},
  {code:"add(2, 3);", why:"Compiler sees two ints → calls the int version → returns 5."},
  {code:"add(1.5, 2.5);", why:"Compiler sees two doubles → calls the double version → returns 4.0."},
]}/>

<Confusion
  mistake="Trying to overload functions based only on return type"
  why="The compiler can't distinguish which function you want based on return type alone. Only parameter types matter for overloading."
/>

<H>Header (.h) and Source (.cpp) Files</H>
<P>In real projects, we split code into separate files:</P>
<AnnotatedCode title="Add.h — DECLARATION (what exists)" lines={[
  {code:"int add(int, int);", why:"Declares that a function named 'add' exists, takes two ints, returns an int. No implementation yet."},
  {code:"double add(double, double);", why:"Declares the double version."},
]}/>
<AnnotatedCode title="Add.cpp — IMPLEMENTATION (how it works)" lines={[
  {code:'#include "Add.h"', why:'Include our own header using double quotes (not angle brackets). This makes the declarations visible.'},
  {code:"int add(int a, int b) { return a+b; }", why:"The actual implementation."},
]}/>
<AnnotatedCode title="main.cpp — USAGE" lines={[
  {code:'#include "Add.h"', why:"Now main.cpp knows about add() and can call it."},
  {code:'#include <iostream>', why:"Angle brackets for Standard Library headers. Double quotes for our own files."},
]}/>

<Quiz questions={[
  {q:"Can two functions have the same name?",o:["Never","Yes, if parameter types differ","Yes, if return types differ"],a:1},
  {q:"Which bracket style includes a Standard Library header?",o:['#include "iostream"','#include <iostream>'],a:1,e:'<> for standard/system headers, "" for your own project headers.'},
  {q:"A function that doesn't return anything uses which return type?",o:["null","int","void","auto"],a:2},
  {q:"Consider:\n```cpp\nint multiply(int a, int b) { return a * b; }\ndouble multiply(double a, double b) { return a * b; }\n\nint main() {\n    cout << multiply(3, 4) << endl;\n    cout << multiply(2.5, 4.0) << endl;\n}\n```\nWhat values are printed?",o:["12 then 10.0","12 then 10","Compile error — duplicate function names","12.0 then 10.0"],a:0,e:"The compiler selects the int version for (3,4) → 12, and the double version for (2.5,4.0) → 10.0. This is function overloading."},
  {q:"A function is declared in add.h but its body is only in add.cpp. If main.cpp includes add.h but you forget to compile add.cpp, you get:",o:["A preprocessing error","A compile error","A linker error — unresolved symbol","A runtime error"],a:2,e:"The compiler accepts the declaration from the header, but the linker cannot find the definition."},
]}/>
</>)},

// ═══════ 1.5 REFERENCES ═══════
{title:"References & const References",content:(<>
<P>This is one of the most important sections in the entire course. It directly impacts <B>performance</B> (Quality Metric #2) and <B>correctness</B> (#1). The professor spent significant lecture time here.</P>

<H>What is a Reference?</H>
<Step n={1} title="A reference is an alias — another name for the same variable">
Think of it like a nickname: "Bob" and "Robert" refer to the same person. When you change one, you change the other — because they ARE the same thing. A reference does not create a new variable or use additional memory.
</Step>

<AnnotatedCode lines={[
  {code:"int x = 10;", why:"Create variable x with value 10."},
  {code:"int& refx = x;", why:"refx is now ANOTHER NAME for x. The & in the declaration creates a reference. Same memory, two names."},
  {code:"refx = 20;", why:"Changing refx changes x — because they ARE the same variable."},
  {code:"cout << x;", why:"Prints 20. x changed because refx is just another name for it."},
]}/>

<MemDiagram title="Reference = Alias (same memory location)" cells={[
  {label:"x",value:"20",color:C.g,addr:"0x1000"},
  {label:"refx",value:"same!",color:C.g,addr:"→ 0x1000"},
]}/>

<Confusion
  mistake="Thinking a reference is a separate variable that stays 'synced'"
  why="A reference IS the same variable, not a copy that mirrors it. There's no syncing — there's only one piece of memory with two names."
/>

<H>Pass by Value vs Pass by Reference</H>

<Conversion
  from="Pass by value (creates a copy)"
  to="Pass by reference (uses the original)"
  feature="Reference parameter (int& n)"
  beforeCode={`void inc(int n) {  // n is a COPY
  n = n + 1;       // changes the copy
}                   // copy destroyed
int x = 5;
inc(x);
cout << x; // STILL 5!`}
  afterCode={`void inc(int& n) { // n IS x
  n = n + 1;        // changes x!
}
int x = 5;
inc(x);
cout << x; // NOW 6!`}
/>

<H>The Big Idea: const Reference</H>
<Prof>"Suppose we have a dot product function for matrices. A 1000×1000 matrix has 1 million elements. Each element is a double — 8 bytes. So one matrix is 8 million bytes. If we pass two matrices by value, we're copying 16 million bytes just to call a function."</Prof>

<Step n={2} title="The problem: we want efficiency WITHOUT sacrificing safety">
Pass by value: safe (original can't change) but slow (copies everything).{"\n"}
Pass by reference: fast (no copy) but dangerous (can accidentally modify original).{"\n"}
Pass by const reference: fast AND safe. The const means "you can look but you can't touch."
</Step>

<AnnotatedCode title="The professor's matrix example — MEMORIZE THIS" lines={[
  {code:"// BAD: copies 16 million bytes", why:""},
  {code:"double DotProduct(BigMatrix m1, BigMatrix m2);", why:"Pass by value: creates complete copies of both matrices. Wastes time AND memory."},
  {code:"", why:""},
  {code:"// BAD: no copy, but dangerous", why:""},
  {code:"double DotProduct(BigMatrix& m1, BigMatrix& m2);", why:"Pass by reference: no copies (fast!), but nothing prevents us from accidentally modifying m1 or m2 inside the function."},
  {code:"", why:""},
  {code:"// CORRECT: no copy AND safe", why:""},
  {code:"double DotProduct(const BigMatrix& m1, const BigMatrix& m2);", why:"Pass by const reference: no copies (efficient) + cannot modify (safe). If we accidentally try to change m1 or m2, the COMPILER catches it. Intention is clear."},
]}/>

<Prof>"This is using the correct feature for the correct requirement. const reference says: we are passing by reference not because we want to change m1 or m2, but because we want to avoid making copies. The intention is clear. That is readable, clear code."</Prof>

<Tip title="Why Use References? (The Exam Answer)">
The professor explicitly called these "very common interview questions":{"\n\n"}
<B>Reason 1:</B> To modify a variable inside a function → pass by reference{"\n"}
<B>Reason 2:</B> To avoid copying large objects → pass by const reference{"\n"}
<B>Reason 3:</B> (Covered later with OOP — returning *this)
</Tip>

<Exam>"What is a reference?" — An alias for an existing variable. Once bound, cannot be rebound. No separate storage.{"\n\n"}"Why would you use a reference?" — (1) Modify a variable in a function. (2) Avoid copying large objects for performance, using const reference.</Exam>

<Quiz questions={[
  {q:"What is the best way to pass a large read-only object to a function?",o:["By value","By reference","By const reference","By pointer"],a:2},
  {q:"Can you rebind a reference to a different variable?",o:["Yes","No"],a:1},
  {q:"How many bytes does passing a 1000×1000 double matrix by const reference copy?",o:["8 million","4 million","8 bytes (just the reference)","0 — references are aliases"],a:3,e:"A reference is just another name for the same memory. The 'copying' that's avoided is the data itself."},
  {q:"Consider:\n```cpp\nvoid increment(int& n) { n = n + 1; }\n\nint main() {\n    int x = 10;\n    increment(x);\n    cout << x << endl;\n}\n```\nWhat is printed?",o:["10","11","Compile error","Undefined behavior"],a:1,e:"n is a reference to x — modifying n modifies x directly. This is pass by reference."},
  {q:"Consider:\n```cpp\nvoid increment(int n) { n = n + 1; }\n\nint main() {\n    int x = 10;\n    increment(x);\n    cout << x << endl;\n}\n```\nWhat is printed?",o:["10","11","Compile error","Undefined behavior"],a:0,e:"n is a COPY of x (pass by value). Modifying the copy doesn't affect the original. x remains 10."},
  {q:"Which of the following about references is true?\n\nA. A reference can be nullptr.\nB. A reference must be initialized when declared.\nC. A reference can be reassigned to refer to a different variable.\nD. A reference creates a separate copy of the variable.",o:["A and C","B only","B and D","All of the above"],a:1,e:"References must be bound at initialization and cannot be rebound. They cannot be null and are aliases, not copies."},
]}/>
</>)},

// ═══════ 1.6 POINTERS ═══════
{title:"Pointers & const Pointers",content:(<>
<Prof>"Pointers are NOT hard. Don't believe the myth. If we learn from first principles, the idea is very straightforward."</Prof>

<Flowchart title="Strategy: What Pointers Are and Why"
  steps={[
    {label:"Every variable",items:["lives at a memory","address (like a","street address)"],color:C.b},
    {label:"A pointer",items:["is a variable that","stores an address","(not a value)"],color:C.accent},
    {label:"Why useful?",items:["Indirect access","Dynamic memory","Polymorphism"],color:C.g},
  ]}
/>

<H>The Core Concept</H>
<Step n={1} title="Variables live at addresses">
When you write <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>int x = 10;</code>, the computer reserves 4 bytes somewhere in memory and stores the value 10 there. That location has an address — like "0x1000".
</Step>

<Step n={2} title="A pointer stores that address">
A pointer is a variable whose value is a memory address. It "points to" another variable by remembering where it lives.
</Step>

<MemDiagram title="Variable x and pointer px" cells={[
  {label:"x (int)",value:"10",color:C.g,addr:"Addr: 0x1000"},
  {type:"arrow",label:"px stores 0x1000"},
  {label:"px (int*)",value:"0x1000",color:C.accent,addr:"Addr: 0x2000"},
]}/>

<H>Two Essential Operators</H>
<Step n={3} title="& (address-of): 'Give me the address of this variable'">
<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&x</code> returns the memory address where x is stored. You use this to initialize a pointer.
</Step>

<Step n={4} title="* (dereference): 'Go to this address and give me the value'">
<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>*px</code> follows the address stored in px and gives you the value at that location. You can also use it to change the value.
</Step>

<AnnotatedCode lines={[
  {code:"int x = 10;", why:"Create variable x with value 10."},
  {code:"int* px = &x;", why:"Declare px as a 'pointer to int.' Initialize it with the address of x. Now px holds x's address."},
  {code:"cout << px;", why:"Prints the address (e.g., 0x7fff5a2c). This is what's STORED in the pointer."},
  {code:"cout << *px;", why:"Prints 10. The * dereferences: 'go to the address px holds, read what's there.'"},
  {code:"*px = 20;", why:"Dereference and assign: 'go to the address px holds, change the value to 20.' Now x is 20."},
  {code:"cout << x;", why:"Prints 20 — we changed x through the pointer."},
]}/>

<Confusion
  mistake="Confusing the * in declaration vs expression"
  why="In a declaration, int* px means 'px is a pointer to int.' In an expression, *px means 'dereference px.' Same symbol, two different meanings depending on context."
/>

<H>Always Initialize Pointers!</H>
<AnnotatedCode lines={[
  {code:"int* p;", why:"DANGEROUS! p holds a garbage address. Using it → undefined behavior (crash, data corruption, etc.)"},
  {code:"int* p = nullptr;", why:"SAFE. nullptr (C++11) explicitly means 'this pointer points to nothing.' You can check for it before using."},
]}/>

<H>Pointers and const — The Four Cases</H>
<Prof>From Lecture 8: "These things can come up in job interviews."</Prof>

<P>A pointer involves two things: the pointer itself (which stores an address) and the variable it points to (which stores a value). Either one, or both, can be const. The rule:</P>

<Tip title="Where is const?">
const <B>LEFT</B> of the * → the <B>value pointed to</B> is const (can't change what's there){"\n"}
const <B>RIGHT</B> of the * → the <B>pointer itself</B> is const (can't repoint)
</Tip>

<AnnotatedCode title="Case 1: Both mutable" lines={[
  {code:"int x = 10;", why:"Non-const variable."},
  {code:"int* ptr = &x;", why:"Non-const pointer to non-const int."},
  {code:"*ptr = 32;", why:"✅ OK — can change the value (value is not const)."},
  {code:"ptr = &y;", why:"✅ OK — can repoint (pointer is not const)."},
]}/>

<AnnotatedCode title="Case 2: Const value, mutable pointer" lines={[
  {code:"const int x = 10;", why:"Const variable — value cannot change."},
  {code:"const int* ptr = &x;", why:"Pointer to const int. 'const' is LEFT of * → value is const."},
  {code:"// *ptr = 32;", why:"❌ ERROR — cannot change value through pointer (value is const)."},
  {code:"ptr = &y;", why:"✅ OK — can repoint (pointer itself is not const)."},
]}/>

<AnnotatedCode title="Case 3: Mutable value, const pointer" lines={[
  {code:"int x = 10;", why:"Non-const variable."},
  {code:"int* const ptr = &x;", why:"Const pointer to int. 'const' is RIGHT of * → pointer is const."},
  {code:"*ptr = 32;", why:"✅ OK — can change value (value is not const)."},
  {code:"// ptr = &y;", why:"❌ ERROR — cannot repoint (pointer itself is const)."},
]}/>

<AnnotatedCode title="Case 4: Both const" lines={[
  {code:"const int x = 10;", why:"Const variable."},
  {code:"const int* const ptr = &x;", why:"Const pointer to const int. Both 'const' keywords present."},
  {code:"// *ptr = 32;", why:"❌ ERROR — cannot change value."},
  {code:"// ptr = &y;", why:"❌ ERROR — cannot repoint."},
]}/>

<H>Arrays — Brief Introduction</H>
<P>An array is a fixed-size container of same-type elements, inherited from C. Index starts at 0:</P>
<AnnotatedCode lines={[
  {code:"int arr[5];", why:"Creates 5 consecutive integers in memory. Size is fixed at creation."},
  {code:"arr[0] = 10;", why:"Access first element (index 0). C++ arrays are 0-indexed."},
  {code:"arr[4] = 50;", why:"Access last element. Valid indices: 0 through 4 (size-1)."},
  {code:"// arr[5] = 99;", why:"OVERFLOW! Index 5 doesn't exist. Undefined behavior — C++ won't catch this."},
]}/>

<P><B>Array-pointer relationship:</B> The name of an array IS the address of its first element:</P>
<AnnotatedCode lines={[
  {code:"int* p = arr;", why:"arr is already an address (of arr[0]). No & needed."},
  {code:"int first = *p;", why:"Dereferences to arr[0]."},
  {code:"int second = *(p + 1);", why:"Pointer arithmetic: p+1 moves to the next int (4 bytes forward). This accesses arr[1]."},
]}/>

<P>In practice, we use <B>std::vector</B> instead of raw arrays — vectors are safer (bounds checking available) and can grow dynamically. But you should understand arrays because vectors are built on the same concept.</P>

<Exam>"Write a function to swap two variables" — a classic pointer/reference interview question. Solution with references: void swap(int&amp; a, int&amp; b) {"{"} int temp = a; a = b; b = temp; {"}"}</Exam>

<Hw num={0} title="Getting Started (0 pts)" desc={`1. Write a function to add two integers
2. Read two integers from the keyboard using cin
3. Add them using your function
4. Write the result to console
Goal: Verify your development environment works and you know basic program structure.`} practice={`Write three functions:
1. average(double a, double b) → returns (a+b)/2.0
2. max_of_three(int a, int b, int c) → returns the largest (use if/else)
3. swap(int& a, int& b) → swaps the two values in-place using a temporary variable
Test all three with user input from cin. For swap, print values before and after to prove it worked.`}/>

<Quiz questions={[
  {q:"What does &x give you?",o:["The value of x","The address of x","A reference to x","A copy of x"],a:1},
  {q:"In `const int* ptr`, what is const?",o:["The pointer itself","The value it points to","Both","Neither"],a:1,e:"const LEFT of * → value is const. The pointer can still be repointed."},
  {q:"What should you initialize an unused pointer to?",o:["0","NULL","nullptr","Leave uninitialized"],a:2,e:"nullptr (C++11) is the modern way. It's type-safe, unlike 0 or NULL."},
  {q:"Array index in C++ starts at:",o:["0","1","Depends on the compiler","You choose"],a:0},
  {q:"Consider:\n```cpp\nint x = 10;\nint* px = &x;\n*px = 20;\ncout << x << endl;\n```\nWhat is printed?",o:["10","20","The address of x","Compile error"],a:1,e:"px points to x. *px = 20 writes 20 to the memory location x occupies. So x is now 20."},
  {q:"Consider the pointer declaration: `int* const ptr = &x;`\nWhich operations are allowed?",o:["*ptr = 32 (change value) and ptr = &y (repoint)","*ptr = 32 only (value is mutable, pointer is const)","ptr = &y only (pointer is mutable, value is const)","Neither — both are const"],a:1,e:"const RIGHT of * → the pointer itself is const (can't repoint). But the value pointed to is NOT const (can change)."},
  {q:"Consider:\n```cpp\nvoid swap(int* a, int* b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}\n\nint main() {\n    int x = 4, y = 5;\n    swap(&x, &y);\n    cout << x << \" \" << y;\n}\n```\nWhat is printed?",o:["4 5","5 4","Compile error","Undefined behavior"],a:1,e:"The swap function dereferences the pointers to exchange values. &x and &y pass the addresses of x and y."},
  {q:"What happens if you dereference a pointer that was never initialized?\n```cpp\nint* p;\ncout << *p;\n```",o:["Prints 0","Prints a random value","Undefined behavior — may crash or corrupt data","Compile error"],a:2,e:"Uninitialized pointers hold garbage addresses. Dereferencing is undefined behavior. Always initialize to nullptr."},
]}/>

</>)},

]};

export default module1;
