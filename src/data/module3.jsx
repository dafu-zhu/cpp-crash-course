import { C, P, H, B, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, Checklist } from "../components";

const module3 = {id:3,title:"Memory Management",sub:"Lec 3 · Special Members, Pointers, Smart Pointers, RAII",icon:"🔗",color:C.r,sections:[

// ═══════ 3.1 PORTFOLIOMGR CLASS ═══════
{title:"Change #1: Introducing PortfolioMgr",content:(<>
<P>In Lecture 2 we wrote a Stock class and used a vector in main() to hold stocks. Now we improve the design by wrapping that vector inside its own class — <B>PortfolioMgr</B>. This doesn't introduce new C++ features, but it's better OOP design: the portfolio's data and operations live together.</P>

<AnnotatedCode title="PortfolioMgr class (Change #1)" lines={[
  {code:"class PortfolioMgr {",why:"A new class to manage the portfolio. Separates portfolio logic from main()."},
  {code:"public:",why:""},
  {code:"    void add_stock(const Stock& stock);",why:"Takes a Stock by const reference — avoids copying the Stock object. The const means we won't modify the original."},
  {code:"private:",why:""},
  {code:"    vector<Stock> stocks_;",why:"The portfolio data is INSIDE the class. Encapsulation: only PortfolioMgr's own functions can touch it."},
  {code:"};",why:""},
  {code:"",why:""},
  {code:"void PortfolioMgr::add_stock(const Stock& stock) {",why:"Implementation: add_stock belongs to PortfolioMgr (scope resolution ::)."},
  {code:"    stocks_.push_back(stock);",why:"Stores the stock in the vector. But wait — push_back creates a COPY. We'll discover this is a problem."},
  {code:"}",why:""},
]}/>

<AnnotatedCode title="Using PortfolioMgr" lines={[
  {code:'Stock s("MSFT", 500, 2);',why:"Create a Stock object."},
  {code:"PortfolioMgr mgr;",why:"Create a portfolio manager. Uses default constructor (compiler-generated since we didn't write one)."},
  {code:"mgr.add_stock(s);",why:"Add the stock to the portfolio. We pass by const reference (no copy here), but push_back internally creates a copy."},
]}/>

<H>The Hidden Problem: Extra Copies</H>
<P>The professor added print statements to the constructor and destructor, then ran the program:</P>
<Prof>"I see one constructor and TWO destructors. Something is weird, right? We created one stock object, but somehow two are being destroyed."</Prof>
<P>The culprit: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>push_back(stock)</code> calls the <B>copy constructor</B> — a special member function we haven't discussed yet. It creates a second Stock inside the vector. So we have the original (s) plus the copy (inside stocks_). Both get destroyed at the end → two destructor calls.</P>
<P>This is inefficient for large objects. We'll spend the rest of this chapter learning how to fix it.</P>

<Quiz questions={[
  {q:"Why does push_back create an extra copy?",o:["It's a bug in C++","push_back stores a COPY of the object inside the vector, using the copy constructor","The Stock class is broken","const reference prevents copies"],a:1},
  {q:"If we add 100 stocks to the portfolio, how many Stock objects exist?",o:["100","200 (100 originals + 100 copies in the vector)","50","It depends"],a:1},
  {q:"Consider:\n```cpp\nStock s1(\"MSFT\", 500, 10);\nvector<Stock> v;\nv.push_back(s1);\n```\nHow many constructor and destructor calls occur in total (across the full program)?",o:["1 constructor, 1 destructor","1 constructor, 1 copy constructor, 2 destructors","2 constructors, 1 destructor","1 constructor, 2 destructors"],a:1,e:"s1 is constructed (1 constructor). push_back copies s1 into the vector (1 copy constructor). Both the original and the copy are destroyed (2 destructors)."},
]}/>
</>)},

// ═══════ 3.2 COPY CONSTRUCTOR ═══════
{title:"The Copy Constructor",content:(<>
<P>We saw two special members (constructor, destructor). There are <B>four more</B>: copy constructor, assignment operator, move constructor, move assignment operator. Together, these six form the <B>special member functions</B> of a class.</P>

<H>What is Copy Construction?</H>
<P>Creating a new object using an existing object of the same type — just like creating a new int from an existing int:</P>
<AnnotatedCode lines={[
  {code:"int i1 = 10;",why:"Normal variable."},
  {code:"int i2 = i1;",why:"Create i2 using i1's value. i2 is a copy of i1."},
  {code:"",why:""},
  {code:'Stock s1("MSFT", 500, 2);',why:"Normal Stock object."},
  {code:"Stock s2 = s1;",why:"Create s2 as a copy of s1 — calls the COPY CONSTRUCTOR."},
  {code:"Stock s3(s1);",why:"Same thing, different syntax — also calls the copy constructor."},
]}/>

<Step n={1} title="Write the copy constructor">
It takes one parameter: a <B>const reference</B> to another object of the same type. We use the other object's members to initialize the new one.
</Step>

<AnnotatedCode title="Copy constructor for Stock" lines={[
  {code:"Stock::Stock(const Stock& other)",why:"Parameter is const Stock& — const because we must NOT change the source object. Reference because we must NOT copy it (that would need a copy constructor... infinite loop!)."},
  {code:"    : symbol_(other.symbol_),",why:"Initialize new object's symbol_ using the other's symbol_. Uses string's own copy constructor."},
  {code:"      price_(other.price_),",why:"Copy the price. For doubles, copying is just a CPU register operation."},
  {code:"      qty_(other.qty_)",why:"Copy the quantity."},
  {code:"{ }",why:"Body is empty — all initialization done in the initializer list."},
]}/>

<Confusion mistake="Wondering how we access other.symbol_ when symbol_ is private" why="Special member functions (constructors, destructor, assignment operator) have special access. Inside a copy constructor of Stock, you can access any Stock object's private members — including the 'other' parameter. The professor confirmed: 'Inside the special member functions you can access the other one's private data members.'"/>

<P>Now the mystery is solved: when <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>push_back(stock)</code> runs, it uses the copy constructor to create a copy inside the vector. One constructor call + one copy constructor call = two objects → two destructor calls.</P>

<Quiz questions={[
  {q:"Why must the copy constructor parameter be const reference?",o:["const: so we don't change the source. Reference: passing by value would require a copy constructor (infinite recursion!)","It's just convention","The compiler requires it but there's no real reason","To save typing"],a:0},
  {q:"Can a copy constructor access private members of the 'other' parameter?",o:["No — private means no access","Yes — special member functions have special access to same-class objects","Only with friend declaration","Only through getters"],a:1},
  {q:"Given the Student class below, which operation does Line 2 use?\n```cpp\nint main() {\n    Student s1(\"Jane\", 22);    // Line 1\n    Student s2 = s1;           // Line 2\n}\n```",o:["Constructor and assignment operator","Copy constructor and assignment operator","Copy constructor only","Assignment operator only"],a:2,e:"Student s2 = s1 creates a NEW object from an existing one — this is copy construction, not assignment. Assignment would be: Student s2; s2 = s1; (s2 already exists)."},
]}/>
</>)},

// ═══════ 3.3 THIS + ASSIGNMENT OPERATOR ═══════
{title:"The this Pointer & Assignment Operator",content:(<>
<H>The this Pointer</H>
<P>Every non-static member function has an invisible pointer called <B>this</B> that points to the object the function was called on. You don't declare it — C++ provides it automatically.</P>

<AnnotatedCode lines={[
  {code:"s1.get_symbol();",why:"Inside get_symbol(), 'this' points to s1."},
  {code:"s2.get_symbol();",why:"Inside get_symbol(), 'this' points to s2. Different call → different 'this'."},
  {code:"*this",why:"Dereference 'this' → gives you the actual object (not a pointer to it). Used to return the object itself."},
]}/>

<H>Building the Assignment Operator — Step by Step</H>
<P>Assignment is different from copy construction: copy construction creates a <B>new</B> object, but assignment copies into an <B>already existing</B> object.</P>

<AnnotatedCode lines={[
  {code:'Stock s1("MSFT", 500, 1);',why:"Create s1."},
  {code:"Stock s2;",why:"Create s2 (default constructor)."},
  {code:"s2 = s1;",why:"ASSIGNMENT: s2 already exists. We're overwriting its data with s1's data. This is NOT copy construction."},
  {code:"// equivalent to: s2.operator=(s1);",why:"The = here is a member function call. operator= is the assignment operator."},
]}/>

<P>The professor built this in three iterations, showing why each step matters:</P>

<Step n={1} title="First attempt: return void (BROKEN for chaining)">
<Code code={`void Stock::operator=(const Stock& other) {
    symbol_ = other.symbol_;
    price_ = other.price_;
    qty_ = other.qty_;
}
// s2 = s1;          // works
// s3 = s2 = s1;     // FAILS! s2 = s1 returns void. Can't assign void to s3.`}/>
<P>Problem: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>s3 = s2 = s1</code> means <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>s3 = (s2.operator=(s1))</code>. If operator= returns void, s3 gets void — which isn't a Stock.</P>
</Step>

<Step n={2} title="Fix: return Stock& (reference to self) using *this">
<Code code={`Stock& Stock::operator=(const Stock& other) {
    symbol_ = other.symbol_;
    price_ = other.price_;
    qty_ = other.qty_;
    return *this;  // return the object itself, by reference
}`}/>
<P>Now <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>s2 = s1</code> returns s2 itself (by reference), so <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>s3 = s2 = s1</code> works.</P>
</Step>

<Step n={3} title="Final fix: add self-assignment check">
<P>What if someone writes <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>s1 = s1</code>? The professor says: "In a large program, with references, you can very easily do this without realizing." It's wasteful (at best) or dangerous (with resources).</P>
<Code code={`Stock& Stock::operator=(const Stock& other) {
    if (this != &other) {        // are they the same object?
        symbol_ = other.symbol_; // only copy if different
        price_ = other.price_;
        qty_ = other.qty_;
    }
    return *this;                // always return self
}`}/>
<P><code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>this</code> is the address of the left-hand side. <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&other</code> is the address of the right-hand side. If they're equal, it's the same object — skip the copy.</P>
</Step>

<Exam>Writing a copy constructor and assignment operator is "a very common interview question" — the professor's words. Be able to explain each step: why const reference, why return Stock&, why self-assignment check, why *this.</Exam>

<H>Operator Overloading (Introduction)</H>
<P>What we just did with operator= is called <B>operator overloading</B> — defining what an operator symbol means for a custom class. The professor showed other examples: cout {"<<"} s for Stock, c = a + b for Matrix. We'll implement operator{"<<"} in Lecture 4 (as a friend function).</P>

<Prof>"What kind of operator symbols we overload depends on the class. Overloading + and - makes sense for a Matrix class. It may not be meaningful for a Student class."</Prof>

<Quiz questions={[
  {q:"Why does operator= return Stock& instead of void?",o:["Performance","To support chained assignment: s3 = s2 = s1","The compiler requires it","To avoid copying"],a:1},
  {q:"What does `this != &other` check?",o:["If the values are different","If the objects are at different memory addresses (different objects)","If the types are different","If the pointers are null"],a:1,e:"Two objects are the same if and only if they share the same memory address."},
  {q:"In `return *this;` — what does *this give you?",o:["The address of the object","The object itself (dereferenced from the this pointer)","A copy of the object","nullptr"],a:1},
  {q:"Consider:\n```cpp\nStock s1(\"MSFT\", 500, 1);\nStock s2(\"GOOG\", 250, 2);\nStock s3;\ns3 = s2 = s1;\n```\nAfter this code, what symbol does s3 hold?",o:["GOOG","MSFT","Empty string","Compile error"],a:1,e:"s2 = s1 copies s1's data into s2 (including MSFT) and returns s2. Then s3 = s2 copies that into s3. All three now hold MSFT."},
  {q:"What happens if operator= does NOT have a self-assignment check and you write `s1 = s1` where s1 manages a dynamically allocated resource?",o:["Nothing — it works fine","The resource may be freed and then accessed, causing undefined behavior","Compile error","The object is destroyed"],a:1,e:"Without the check, the operator may delete the resource (thinking it's the 'old' data) then try to copy from the now-deleted resource."},
]}/>
</>)},

// ═══════ 3.4 MOVE SEMANTICS ═══════
{title:"Move Semantics",content:(<>
<H>The Problem: Wasteful Temporaries</H>
<Prof>"Creating an object can be expensive. We don't want to create objects unnecessarily. Sometimes we create temporary objects that exist just to support one expression — after that, we cannot access them. Creating an object just to throw away is a waste."</Prof>

<AnnotatedCode lines={[
  {code:'mgr.add_stock(Stock("MSFT", 500.0, 1));',why:"Creates a temporary Stock — it has no variable name, exists only for this one line. After push_back copies it, the temporary is destroyed. We created it just to throw it away."},
]}/>

<P>Instead of <B>copying</B> a temporary's data (allocating new memory, duplicating every character of the string), we can <B>steal</B> it. The temporary is going to be destroyed anyway — nobody will miss its data.</P>

<Conversion from="Copy construction (duplicate data)" to="Move construction (steal data)" feature="Move Constructor (Stock&& — rvalue reference)" beforeCode={`// Copy: allocate new buffer,
// copy every character
Stock::Stock(const Stock& other)
  : symbol_(other.symbol_)
  // string allocates new memory
  // and copies all chars`} afterCode={`// Move: steal the buffer pointer
// zero-cost for the string
Stock::Stock(Stock&& other)
  : symbol_(std::move(other.symbol_))
  // just swaps internal pointers
  // other.symbol_ becomes empty`}/>

<AnnotatedCode title="Move constructor" lines={[
  {code:"Stock::Stock(Stock&& other)",why:"&& is an RVALUE REFERENCE — a special kind of reference that binds only to temporaries. It says: 'I know this object is about to die, so I can safely steal from it.'"},
  {code:"    : symbol_(std::move(other.symbol_)),",why:"std::move() casts other.symbol_ to an rvalue, triggering string's MOVE constructor. This steals the string's internal memory buffer instead of copying characters. After this, other.symbol_ is empty."},
  {code:"      price_(other.price_),",why:"For fundamental types (double), moving IS copying — just a CPU register operation. No performance difference."},
  {code:"      qty_(other.qty_)",why:"Same: int is a fundamental type, moving = copying."},
  {code:"{ }",why:"Body empty."},
]}/>

<Confusion mistake="Thinking std::move actually moves something" why="std::move doesn't move anything! It's just a cast — it converts its argument to an rvalue reference, which ENABLES move constructors/assignment to be called. The actual 'moving' (stealing of resources) happens in the move constructor or move assignment operator."/>

<H>Move Assignment Operator</H>
<AnnotatedCode lines={[
  {code:"Stock& Stock::operator=(Stock&& other) {",why:"Like copy assignment, but with && parameter — handles temporaries."},
  {code:"    if (this != &other) {",why:"Self-assignment check (same as copy assignment)."},
  {code:"        symbol_ = std::move(other.symbol_);",why:"Steal the string buffer."},
  {code:"        price_ = other.price_;",why:"Copy fundamental types."},
  {code:"        qty_ = other.qty_;",why:""},
  {code:"    }",why:""},
  {code:"    return *this;",why:"Return self for chaining."},
  {code:"}",why:""},
]}/>

<Prof>"For fundamental types like int and double, moving IS copying — it's just a CPU instruction, very cheap. But for strings and vectors, std::move steals the internal memory buffer instead of copying all the characters/elements. That's the performance gain."</Prof>

<H>Compiler-Generated Special Members</H>
<P>If you don't write these yourself, the compiler <B>may</B> generate them automatically: default constructor, copy constructor, copy assignment, destructor, move constructor, move assignment. But move operations are only generated if you haven't defined ANY of the other four.</P>

<H>= default and = delete</H>
<AnnotatedCode lines={[
  {code:"Stock(const Stock&) = default;",why:"Explicitly request the compiler's auto-generated copy constructor. More READABLE than omitting it — shows intent clearly."},
  {code:"Stock(Stock&&) = default;",why:"Request auto-generated move constructor."},
  {code:"Stock(const Stock&) = delete;",why:"FORBID copying. Any code that tries to copy a Stock gets a compile error. Used when copying doesn't make sense (e.g., unique_ptr)."},
  {code:"Stock(Stock&&) = delete;",why:"FORBID moving."},
]}/>

<Quiz questions={[
  {q:"When should you use move instead of copy?",o:["Always","When the source object is a temporary that will be destroyed anyway","When the object is small","Move is always slower"],a:1},
  {q:"What does std::move actually do?",o:["Physically moves memory","Casts its argument to an rvalue reference (enabling move operations)","Deletes the original","Creates a deep copy"],a:1},
  {q:"For `int x`, is there any difference between copying and moving?",o:["Yes, moving is faster","No — for fundamental types, move = copy (both are just a CPU instruction)","Moving is impossible for ints","Moving sets x to 0"],a:1},
  {q:"Consider:\n```cpp\nStock s1(\"MSFT\", 500, 1);\nStock s2 = std::move(s1);\ncout << s1.get_symbol() << endl;\n```\nWhat happens to s1.symbol_ after the move?",o:["Still \"MSFT\"","Empty string — the move constructor stole the string's internal buffer","Compile error","Undefined behavior"],a:1,e:"std::move casts s1 to an rvalue reference, triggering the move constructor. The string's internal buffer is transferred to s2, leaving s1.symbol_ empty."},
  {q:"Which of the following correctly describes `= delete`?\n```cpp\nStock(const Stock&) = delete;\n```",o:["Deletes the object","Forbids copying — any code that tries to copy a Stock gets a compile error","Deletes the copy constructor's memory","Makes copying optional"],a:1,e:"= delete explicitly forbids a special member function. Attempting to use it causes a compile error."},
]}/>
</>)},

// ═══════ 3.5 STATIC MEMBERS ═══════
{title:"Static Members",content:(<>
<P>Normally, each object has its own copy of every data member. But sometimes you need data <B>shared by all objects</B> of a class — for example, counting how many Stock objects exist.</P>

<AnnotatedCode title="static member example" lines={[
  {code:"class Counter {",why:""},
  {code:"public:",why:""},
  {code:"    Counter() { ++count_; }",why:"Every time a Counter is created, increment the shared count."},
  {code:"    static int get_count() { return count_; }",why:"static function: can be called on the CLASS itself, not just objects. Counter::get_count()"},
  {code:"private:",why:""},
  {code:"    static int count_;",why:"static data member: ONE copy shared by ALL Counter objects. Not stored inside any individual object."},
  {code:"};",why:""},
  {code:"",why:""},
  {code:"int Counter::count_ = 0;",why:"MUST define static members once OUTSIDE the class. This allocates the actual storage."},
  {code:"",why:""},
  {code:"Counter c1, c2, c3;",why:"Creates 3 objects. Each constructor increments count_."},
  {code:"cout << Counter::get_count();",why:"Prints 3. Access via class name (no object needed) OR via object: c1.get_count()."},
]}/>

<Tip title="Properties of static members">
• Only ONE copy for the entire class (not per object){"\n"}
• Shared by all objects{"\n"}
• Exists even if no objects are created{"\n"}
• Can be accessed via class name: Counter::get_count()
</Tip>
</>)},

// ═══════ 3.6 MEMORY MANAGEMENT ═══════
{title:"Automatic vs Free-Store Objects",content:(<>
<H>Automatic Objects (Stack)</H>
<P>Every object we've created so far is <B>automatic</B>: it's created when declared, and destroyed when it goes out of scope (the nearest closing brace). You have zero control over its lifetime.</P>

<Prof>"When is it getting created? When we execute that line. When is it getting destroyed? When this program goes out of scope. We didn't do anything to destroy it — it just got destroyed when it went out of scope."</Prof>

<P>Two limitations: (1) You can't destroy it early even if you're done with it (wastes memory). (2) It can't outlive its scope (e.g., a Stock created inside a function is destroyed when the function returns).</P>

<H>Free-Store Objects (Heap)</H>
<P>To control lifetime, create objects on the <B>free store</B> (also called the heap) using <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>new</code>:</P>

<AnnotatedCode lines={[
  {code:'Stock* s = new Stock("MSFT", 500.0, 2);',why:"'new' creates a Stock on the free store and returns its ADDRESS. We store that address in a pointer."},
  {code:"cout << s->get_symbol();",why:"Arrow operator (->): access members through a pointer. Equivalent to (*s).get_symbol()."},
  {code:"delete s;",why:"Free the memory. Without this, the object lives forever → MEMORY LEAK. The destructor is called by delete."},
]}/>

<MemDiagram title="Stack vs Heap" cells={[
  {label:"Stack (automatic)",value:"s (pointer)",color:C.b,addr:"destroyed at }"},
  {type:"arrow",label:"points to"},
  {label:"Heap (free store)",value:"Stock object",color:C.r,addr:"lives until delete"},
]}/>

<Confusion mistake="Forgetting to call delete" why="The operating system thinks that memory is still in use. It's never reclaimed → memory leak. In a long-running program (trading system, server), leaks accumulate and eventually crash the program."/>

<Confusion mistake="Calling delete twice on the same pointer" why="After the first delete, the memory is freed. The second delete tries to free already-freed memory → undefined behavior (crash, data corruption, silent bug)."/>

<H>Change #2a: PortfolioMgr with Raw Pointers</H>
<P>By storing <B>pointers</B> to stocks instead of copies, we avoid the extra copy problem:</P>
<AnnotatedCode lines={[
  {code:"vector<Stock*> stocks_;",why:"Store addresses, not objects. push_back copies the pointer (8 bytes), not the Stock."},
  {code:'Stock* s = new Stock("AAPL", 150.0, 2);',why:"Create on the heap."},
  {code:"mgr.add_stock(s);",why:"Only one Stock object exists — we just passed its address."},
]}/>
<P>Result: one constructor, zero copy constructors. But now we must manually delete every stock in the destructor — error-prone for large programs.</P>

<Quiz questions={[
  {q:"An automatic object is destroyed:",o:["When you call delete","When it goes out of scope","When main() ends","Never"],a:1},
  {q:"What does the 'new' keyword return?",o:["The object itself","The ADDRESS of the object (a pointer)","void","A reference"],a:1},
  {q:"What happens if you forget 'delete'?",o:["The compiler catches it","Memory leak — memory is never freed","The object is destroyed at program end","Nothing, C++ handles it"],a:1},
  {q:"Consider:\n```cpp\nStock* s = new Stock(\"MSFT\", 500, 1);\ncout << s->get_symbol() << endl;\ndelete s;\ncout << s->get_symbol() << endl;\n```\nWhat happens on the last line?",o:["Prints MSFT again","Undefined behavior — s points to freed memory","Compile error","Prints empty string"],a:1,e:"After delete, s is a dangling pointer — the memory it points to has been freed. Dereferencing it is undefined behavior."},
  {q:"Based on what we discussed in class, using the `delete` keyword:",o:["Removes a variable from scope","Deallocates memory previously allocated with new, calling the destructor","Removes an element from a vector","Deletes a file from disk"],a:1,e:"delete frees heap memory allocated by new. For arrays allocated with new[], use delete[]."},
]}/>
</>)},

// ═══════ 3.7 SMART POINTERS & RAII ═══════
{title:"Smart Pointers & RAII",content:(<>
<H>The Problem with Raw Pointers</H>
<Prof>"Using pointers in large programs is difficult. Copying pointers is tricky. Figuring out when to delete a free-store object can be tricky: if we delete too early, the program will crash. If we delete too late, wasting memory. If we do not delete, memory leak. Fortunately, we don't have to use raw pointers. We have better tools in modern C++."</Prof>

<P>The professor gave a vivid example: imagine two parts of a program both hold pointers to the same object. One part deletes it — the other part crashes when it tries to use the now-deleted object. Or neither deletes it → leak. Figuring out <i>when</i> to delete is the hard part.</P>

<Conversion from="Raw pointers (manual delete, error-prone)" to="Smart pointers (automatic cleanup)" feature="shared_ptr — Smart Pointer (from <memory> header)" beforeCode={`Stock* s = new Stock("MSFT", 500, 1);
// ... lots of code ...
// Did we delete yet?
// What if an exception was thrown?
// What if another pointer points here?
delete s;  // easy to forget!`} afterCode={`auto s = make_shared<Stock>(
  "MSFT", 500, 1);
// Use normally:
cout << s->get_symbol();
// No delete needed!
// Object freed when LAST
// shared_ptr dies`}/>

<H>shared_ptr: Shared Ownership</H>
<P>A <B>shared_ptr</B> (shared pointer) wraps a raw pointer and automatically deletes the object when no more shared_ptrs point to it. Multiple shared_ptrs can point to the same object — a reference count tracks how many.</P>

<AnnotatedCode lines={[
  {code:"#include <memory>",why:"Smart pointers are in the <memory> header."},
  {code:"",why:""},
  {code:'auto s1 = std::make_shared<Stock>("MSFT", 500.0, 1);',why:"make_shared creates a Stock on the heap AND wraps it in a shared_ptr. PREFERRED over 'new'. auto deduces the type: shared_ptr<Stock>."},
  {code:"auto s2 = s1;",why:"COPY the shared_ptr. Now BOTH s1 and s2 point to the SAME Stock. Reference count = 2."},
  {code:"cout << s1->get_price();",why:"Use -> just like a raw pointer."},
  {code:"",why:""},
  {code:"// When s1 goes out of scope: ref count drops to 1 (s2 still exists).",why:"Object NOT deleted yet."},
  {code:"// When s2 goes out of scope: ref count drops to 0.",why:"Object IS deleted automatically. Destructor called. No memory leak."},
]}/>

<H>Change #2b: PortfolioMgr with shared_ptr</H>
<AnnotatedCode lines={[
  {code:"class PortfolioMgr {",why:""},
  {code:"public:",why:""},
  {code:"    void add_stock(std::shared_ptr<Stock> stock);",why:"Takes a shared_ptr. No raw pointer, no manual delete."},
  {code:"private:",why:""},
  {code:"    vector<std::shared_ptr<Stock>> stocks_;",why:"Vector of smart pointers."},
  {code:"};",why:""},
  {code:"",why:""},
  {code:'auto s = std::make_shared<Stock>("AAPL", 150.0, 2);',why:"Create Stock wrapped in shared_ptr."},
  {code:"PortfolioMgr mgr;",why:""},
  {code:"mgr.add_stock(s);",why:"One Stock object, no copies, no memory leaks, no destructor needed in PortfolioMgr."},
]}/>

<Prof>"We don't create additional objects. We don't delete any free-store objects. The smart pointer takes care of cleaning up when no longer used."</Prof>

<H>RAII — Resource Acquisition Is Initialization</H>
<Tip title="RAII (Resource Acquisition Is Initialization)">
This is one of the most important patterns in C++. The full name is "Resource Acquisition Is Initialization" — it means:{"\n\n"}
<B>Acquisition:</B> Acquire the resource (memory, file, lock) in the CONSTRUCTOR.{"\n"}
<B>Release:</B> Release the resource in the DESTRUCTOR.{"\n\n"}
Since destructors run automatically when objects go out of scope, resources are always cleaned up — even if exceptions are thrown. shared_ptr is RAII for heap memory. ifstream is RAII for file handles.
</Tip>

<H>Three Smart Pointer Types</H>
<P>• <B>shared_ptr</B> — shared ownership, reference counted. Multiple can point to same object. This is what the course uses primarily.</P>
<P>• <B>unique_ptr</B> — exclusive ownership. Only ONE unique_ptr can own an object. Cannot be copied, only moved. Use when ownership should be clear and singular. Lighter weight than shared_ptr (no reference count).</P>
<P>• <B>weak_ptr</B> — non-owning observer. Points to an object managed by shared_ptr but doesn't keep it alive. Useful to break circular references.</P>

<Exam>Know all three types and when to use each. shared_ptr = default choice for shared ownership. unique_ptr = when one owner is clear (lighter, preferred when possible). weak_ptr = to observe without preventing deletion.</Exam>

<Quiz questions={[
  {q:"When is a shared_ptr's object deleted?",o:["When the first shared_ptr dies","When you call delete","When the LAST shared_ptr pointing to it dies (ref count = 0)","At program end"],a:2},
  {q:"What does RAII stand for?",o:["Reference Acquisition Is Immediate","Resource Acquisition Is Initialization","Runtime Allocation Is Implicit","Random Access Is Indexed"],a:1},
  {q:"Which smart pointer cannot be copied?",o:["shared_ptr","unique_ptr","weak_ptr","All can be copied"],a:1,e:"unique_ptr has exclusive ownership — copying would create two owners. You can only MOVE it."},
  {q:"Why use make_shared instead of `new`?",o:["make_shared is faster and exception-safe (single allocation)","There is no difference","make_shared is required by the compiler","new doesn't work with shared_ptr"],a:0},
  {q:"Consider:\n```cpp\nauto s1 = make_shared<Stock>(\"MSFT\", 500, 1);\nauto s2 = s1;\nauto s3 = s1;\ns2.reset();\n```\nAfter this code, is the Stock object still alive?",o:["No — s2 was reset so the object is deleted","Yes — s1 and s3 still point to it (ref count = 2)","Undefined behavior","Compile error"],a:1,e:"s2.reset() decrements the reference count from 3 to 2. The object is only deleted when the count reaches 0."},
  {q:"Based on our class discussions, which of the following are examples of RAII?\n\nA. Using shared_ptr to manage heap memory\nB. Using ifstream to manage file handles\nC. Manually calling delete in the destructor\nD. Using the `new` keyword",o:["A, B, C, D","A, B only","A, B, C","C, D"],a:1,e:"RAII means acquiring resources in the constructor and releasing in the destructor automatically. shared_ptr and ifstream do this. Manual delete and new are what RAII replaces."},
]}/>

<Checklist items={[
  "I understand why push_back creates extra copies",
  "I can write a copy constructor with const reference parameter",
  "I know how to access private members inside special member functions",
  "I understand the this pointer and *this",
  "I can write assignment operator with: self-check, return *this, Stock& return type",
  "I understand move semantics: rvalue references (&&), std::move, steal vs copy",
  "I know std::move is a cast, not an actual move operation",
  "I know move = copy for fundamental types (int, double)",
  "I can use = default and = delete to control compiler-generated members",
  "I understand static members (one copy shared by all objects)",
  "I know automatic (stack) vs free-store (heap) object lifetimes",
  "I can use new/delete and understand memory leaks",
  "I use shared_ptr (make_shared) instead of raw pointers",
  "I can explain RAII: acquire in constructor, release in destructor",
  "I know shared_ptr vs unique_ptr vs weak_ptr",
]}/>
</>)}
]};

export default module3;
