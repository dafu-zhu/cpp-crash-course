import { C, P, H, B, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, Checklist } from "../components";

const module4 = {id:4,title:"I/O, Algorithms, Errors",sub:"Lec 4 · File I/O, STL Algorithms, Exceptions, Operators",icon:"📦",color:C.o,sections:[

// ═══════ 4.1 FILE I/O ═══════
{title:"File I/O & CSV Parsing",content:(<>
<P>Our Portfolio Manager needs real price data. We download CSV files from Yahoo Finance using Python ("using the right tool for the right job"), then read them in C++. The data is stored in a <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>map&lt;string, vector&lt;double&gt;&gt;</code> — key is the stock symbol, value is its price history.</P>

<H>Stream Classes for I/O</H>
<P>C++ uses stream objects for all input/output. We've already seen <B>cin</B> (keyboard input) and <B>cout</B> (console output). Two more:</P>
<Step n={1} title="cerr and clog — separate output channels">
<B>cerr</B>: for error messages. Attached to standard error device. <B>Not buffered</B> — output appears immediately (important during crashes).{"\n"}
<B>clog</B>: for log messages. Attached to standard log device. Buffered — output accumulates then flushes.{"\n\n"}
In large programs, separating output (cout), errors (cerr), and logs (clog) helps you identify problems fast.
</Step>

<P><B>Buffering:</B> Some streams accumulate output in a buffer before writing to the device. Use <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>flush()</code> or <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>endl</code> to force the buffer to write immediately.</P>

<H>File I/O: ofstream and ifstream</H>
<P>Three stream types for files, all in <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&lt;fstream&gt;</code>:</P>
<P>• <B>ofstream</B> — write to files</P>
<P>• <B>ifstream</B> — read from files</P>
<P>• <B>fstream</B> — both read and write</P>

<P>Files are <B>resources</B>: they must be opened before use and closed when done. C++ file streams use <B>RAII</B> — file opens in the constructor (when you pass a filename), file closes in the destructor (when the stream goes out of scope). No manual close needed!</P>

<AnnotatedCode title="Writing to a file" lines={[
  {code:'string filename = "output.txt";',why:"The file we want to write to."},
  {code:"ofstream outfile(filename);",why:"Create output stream AND open the file. RAII: file opens in constructor."},
  {code:"if (outfile) {",why:"ALWAYS check if the file opened. Resources can fail — file might not exist, permissions denied, etc."},
  {code:'    outfile << "Hello" << endl;',why:"Write to file using << — SAME syntax as cout! Stream classes share this interface."},
  {code:"}",why:""},
  {code:"// file auto-closes when outfile goes out of scope (RAII)",why:"Destructor closes the file. No leak even if exception is thrown."},
]}/>

<AnnotatedCode title="Reading a file line by line" lines={[
  {code:'ifstream infile("data.csv");',why:"Open file for reading."},
  {code:"if (!infile) {",why:"Check if open failed. ! tests the stream's error state."},
  {code:'    cerr << "Cannot open file" << endl;',why:"Send error to cerr (not cout). cerr is unbuffered — message appears immediately."},
  {code:"    return;",why:"Exit early — can't proceed without data."},
  {code:"}",why:""},
  {code:"string line;",why:"Buffer to hold each line."},
  {code:"while (getline(infile, line)) {",why:"getline reads ONE LINE from infile, stores in 'line'. Returns true if read succeeded. Loop continues until end of file."},
  {code:"    // process 'line'",why:"Each iteration, 'line' contains the next line of the file."},
  {code:"}",why:"When getline reaches EOF, it returns false and loop exits."},
]}/>

<H>String Streams — Parsing Tokens from a String</H>
<P><code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>istringstream</code> (from <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&lt;sstream&gt;</code>) treats a string as a stream — so you can use stream operations on it:</P>

<AnnotatedCode title="Extracting fields from a string" lines={[
  {code:'string s = "MSFT 500.0";',why:"A string with two tokens separated by a space."},
  {code:"istringstream iss(s);",why:"Wrap the string in an input stream. Now we can extract from it."},
  {code:"string symbol; double price;",why:"Variables to hold extracted values."},
  {code:"iss >> symbol >> price;",why:">> extracts tokens separated by whitespace. symbol gets \"MSFT\", price gets 500.0."},
]}/>

<H>The Complete CSV Parsing Pattern</H>
<P>This is the professor's key technique for reading CSV files. Outer loop reads lines, inner loop splits each line by commas:</P>

<AnnotatedCode title="Reading a CSV file — the two-loop pattern" lines={[
  {code:"while (getline(infile, line)) {",why:"OUTER LOOP: read one LINE at a time from the file."},
  {code:"    istringstream iss(line);",why:"Turn this line into a stream so we can parse it field by field."},
  {code:"    string field;",why:"Buffer for each comma-separated field."},
  {code:"    int i = 0;",why:"Track which column we're on (0 = first column, 1 = second, etc.)."},
  {code:"    while (getline(iss, field, ',')) {",why:"INNER LOOP: getline with ',' delimiter reads one field at a time, stopping at each comma."},
  {code:"        if (i == 0) symbol = field;",why:"First column is the symbol (or date)."},
  {code:"        else rate = stod(field);",why:"Other columns are numbers. stod() converts string to double: \"231.78\" → 231.78."},
  {code:"        i++;",why:"Move to next column."},
  {code:"    }",why:"Inner loop ends when no more commas (end of line)."},
  {code:"}",why:"Outer loop ends when no more lines (end of file)."},
]}/>

<Prof>"For the assignment, the CSV file has a header row with symbol names. You'll need to figure out how to handle that first line differently. Programming requires a little bit of imagination and creativity."</Prof>

<Quiz questions={[
  {q:"What does istringstream do?",o:["Writes to a file","Treats a string as a stream for parsing","Converts ints to strings","Reads from keyboard"],a:1},
  {q:"What does stod() do?",o:["String to double","String to date","Stream to double"],a:0},
  {q:"File I/O uses RAII. This means:",o:["Files are opened and closed manually","Files open in constructor, close automatically in destructor","Files never close","RAII is a file format"],a:1},
  {q:"cerr vs cout: cerr is:",o:["Faster","Unbuffered — output appears immediately, good for errors","Only for numbers","The same as cout"],a:1},
]}/>
</>)},

// ═══════ 4.2 STL ALGORITHMS ═══════
{title:"STL Algorithms",content:(<>
<P>The STL has three pillars: <B>containers</B> (where data lives), <B>iterators</B> (how you traverse), and <B>algorithms</B> (what you do with data). Algorithms operate on ranges defined by iterators — so the same algorithm works on any container.</P>

<P>Main headers: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&lt;algorithm&gt;</code> (sort, find, count) and <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>&lt;numeric&gt;</code> (accumulate, inner_product).</P>

<H>std::accumulate — Sum Elements</H>
<AnnotatedCode lines={[
  {code:"#include <numeric>",why:"accumulate is in the <numeric> header."},
  {code:"vector<int> v{1,2,3,4,5,6,7,8,9,10};",why:""},
  {code:"int sum = accumulate(v.begin(), v.end(), 0);",why:"Sum all elements. Third arg (0) is the initial value. Result: 55."},
]}/>

<Confusion mistake="Using 0 instead of 0.0 as initial value with doubles" why="accumulate(v.begin(), v.end(), 0) treats the sum as int even if v contains doubles — truncating decimals! Use 0.0 for double vectors."/>

<H>std::find — Search for a Value</H>
<AnnotatedCode lines={[
  {code:"#include <algorithm>",why:"find is in <algorithm>."},
  {code:"vector<int> v{10, 20, 30, 40};",why:""},
  {code:"auto it = find(v.begin(), v.end(), 30);",why:"Search for 30. Returns iterator to found element."},
  {code:"if (it != v.end())",why:"If find returns v.end(), the element was NOT found. v.end() is the 'past-the-end' iterator — one position after the last element."},
  {code:'    cout << "Found: " << *it;',why:"Dereference iterator to get the value."},
]}/>

<H>std::count — Count Occurrences</H>
<Code code={`vector<int> v{1, 2, 2, 3, 2, 4};
int n = count(v.begin(), v.end(), 2);
// n = 3 — the value 2 appears 3 times`}/>

<H>std::sort — Sort a Container</H>
<Code code={`vector<double> prices{300, 100, 250, 150};
sort(prices.begin(), prices.end());
// prices now {100, 150, 250, 300} — ascending`}/>

<H>Moving Average (Homework)</H>
<P>The professor assigned computing a moving average using STL algorithms. For a 30-day window, sum the last 30 prices and divide by 30:</P>
<Code title="Moving average concept" code={`double moving_avg(const vector<double>& prices, int window) {
    if (prices.size() < window)
        throw runtime_error("Not enough data");
    auto start = prices.end() - window;
    double sum = accumulate(start, prices.end(), 0.0);
    return sum / window;
}`}/>

<Quiz questions={[
  {q:"accumulate(v.begin(), v.end(), 0.0) computes:",o:["Average","Sum starting from 0.0","Count","Maximum"],a:1},
  {q:"find() returns v.end() when:",o:["Element is found at end","Element not found","Vector is empty","Always"],a:1,e:"v.end() is the past-the-end iterator — a sentinel meaning 'not found.'"},
]}/>
</>)},

// ═══════ 4.3 EXCEPTION HANDLING ═══════
{title:"Exception Handling",content:(<>
<Prof>"Very often, the location where an error is detected may not know how to handle the error. We have to propagate the error back to a place where it can be handled properly."</Prof>

<Flowchart title="Exception Flow" steps={[
  {label:"Detect Error",items:["Symbol not found","in price_history_"],color:C.r},
  {label:"throw",items:["Raise exception","runtime_error"],color:C.o},
  {label:"try / catch",items:["Catch in caller","Handle or report"],color:C.g},
]}/>

<H>The Three Keywords</H>
<Step n={1} title="throw — raise an exception when something goes wrong">
<Code code={`auto iter = price_history_.find(symbol);
if (iter == price_history_.end()) {
    throw std::runtime_error("Symbol not found: " + symbol);
}
return iter->second;`}/>
</Step>

<Step n={2} title="try — wrap code that might throw">
<Code code={`try {
    double ret = mgr.next_day_return("XYZ");  // might throw!
    cout << ret << endl;
}`}/>
</Step>

<Step n={3} title="catch — handle the exception">
<Code code={`catch (const std::runtime_error& e) {
    cout << "Error: " << e.what() << endl;
    // e.what() returns the message string
}`}/>
</Step>

<P>Flow: code in try runs normally. If throw executes (anywhere in the call chain), execution immediately jumps to the matching catch. Remaining code in try is skipped.</P>

<Exam>Always catch by <B>const reference</B>: catch(const std::runtime_error&amp; e). Three reasons: (1) avoids copying the exception. (2) preserves polymorphism — virtual functions like what() work correctly. (3) prevents object slicing. We'll fully explain why after learning inheritance.</Exam>

<H>std::optional (Brief Mention)</H>
<P>When the absence of a value is valid (not an error), C++17 provides <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>std::optional</code>: a wrapper that either holds a value or holds nothing (<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>std::nullopt</code>). Check with <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>if (val)</code> before using <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>*val</code>.</P>

<Quiz questions={[
  {q:"Why catch exceptions by const reference?",o:["It's faster","Avoids copy, preserves polymorphism, prevents slicing","Compiler requires it","No difference"],a:1},
  {q:"e.what() returns:",o:["The exception type","The error message string","The line number"],a:1},
  {q:"If an exception is thrown inside try, what happens to code after the throw?",o:["It still runs","It's skipped — control jumps to catch","It runs after catch","Undefined behavior"],a:1},
]}/>
</>)},

// ═══════ 4.4 CONST MEMBERS & OPERATOR<< ═══════
{title:"const Members & operator<<",content:(<>
<H>const Member Functions</H>
<P>If you create a <B>const object</B>, you should still be able to call functions that only READ data. But the compiler doesn't know which functions modify the object — you must tell it explicitly.</P>

<AnnotatedCode title="The problem" lines={[
  {code:'const Stock s("MSFT", 450.0, 1);',why:"A const Stock. We promised not to change it."},
  {code:"cout << s.get_symbol();",why:"COMPILE ERROR! get_symbol() isn't marked const, so the compiler assumes it might modify s."},
]}/>

<AnnotatedCode title="The fix: mark getter as const" lines={[
  {code:"string get_symbol() const;",why:"const AFTER the () means: 'this function does not modify the object.' Now it can be called on const objects."},
  {code:"string Stock::get_symbol() const {",why:"const must appear in BOTH declaration AND implementation."},
  {code:"    return symbol_;",why:"Only reads — doesn't modify."},
  {code:"}",why:""},
]}/>

<Prof>"The compiler doesn't know whether getPrice changes the object. We have to tell the compiler explicitly using the const keyword."</Prof>

<Confusion mistake="Putting const before the return type: const string get_symbol()" why="That makes the RETURN VALUE const (a const string), not the function. To promise 'I don't modify the object,' put const AFTER the parentheses: string get_symbol() const;"/>

<P><B>mutable</B>: the exception to the rule. A member marked <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>mutable</code> CAN be modified even inside a const member function. Used for caching, logging counters, etc.</P>

<H>Overloading operator{"<<"} — The Full Story</H>
<P>The professor built this step-by-step, showing why it must be a non-member friend function:</P>

<Step n={1} title="If operator<< is a member function, usage is backwards">
<Code code={`// As a member function:
s.operator<<(cout);  // means s << cout
// Usage: s << cout;    ← BACKWARDS! Not how anyone uses cout.`}/>
</Step>

<Step n={2} title="Make it a non-member function so cout comes first">
<Code code={`// Non-member: first param is ostream, second is Stock
ostream& operator<<(ostream& os, const Stock& s);
// Usage: cout << s;    ← CORRECT!`}/>
</Step>

<Step n={3} title="Problem: non-member can't access private data. Solution: friend">
<AnnotatedCode lines={[
  {code:"class Stock {",why:""},
  {code:"public:",why:""},
  {code:"    // ... other members ...",why:""},
  {code:"    friend ostream& operator<<(ostream& os, const Stock& s);",why:"Declare as FRIEND inside the class. This grants access to private members (symbol_, price_, qty_) without being a member function."},
  {code:"private:",why:""},
  {code:"    string symbol_; double price_; int qty_;",why:""},
  {code:"};",why:""},
  {code:"",why:""},
  {code:"ostream& operator<<(ostream& os, const Stock& s) {",why:"Implement as NON-MEMBER. Not Stock::operator<< — no scope resolution."},
  {code:'    os << s.symbol_ << ", $" << s.price_ << ", qty: " << s.qty_;',why:"Access private members directly thanks to friend declaration."},
  {code:"    return os;",why:"Return the stream for chaining: cout << s1 << s2;"},
  {code:"}",why:""},
]}/>
</Step>

<Prof>Scott Meyers: "Whenever you can avoid friend functions, you should, because, much as in real life, friends are often more trouble than they're worth."</Prof>

<P>Use friend functions only when there's a valid conceptual reason — like operator{"<<"} which belongs to the class interface but can't be a member.</P>

<Hw num={2} title="OO Portfolio Manager (4%)" desc={`Starting from Assignment 1, incorporate ALL 6 changes:
Change #1: PortfolioMgr class
Change #2: Smart pointers (shared_ptr)
Change #3: Download CSV from Yahoo Finance, read in program
Change #4: Compute next-day returns (moving average + STL algorithm)
Change #5: Exception handling for missing symbols
Change #6: Overload operator<< for Stock
Include .csv data files. Use RELATIVE paths so TAs can build without modification.
Due: February 11`} practice={`Build a GradeBook application:
1. Student class (name, id, vector<double> scores) in separate .h/.cpp
2. Read student data from CSV using the two-loop getline pattern
3. Use std::accumulate to compute each student's average
4. Use std::sort to rank students by average (highest first)
5. Throw runtime_error if CSV file cannot be opened
6. Overload operator<< for Student: "John Doe (ID: 12345) — Avg: 92.5"
7. Write find_student(map, id) that throws if ID not found`}/>

<Quiz questions={[
  {q:"Can a const object call a non-const member function?",o:["Yes","No — const objects can ONLY call const member functions"],a:1},
  {q:"Why is operator<< a friend non-member instead of a member?",o:["It's faster","As a member, usage would be s << cout (backwards)","Friends are always better","It must return void"],a:1},
  {q:"What does 'mutable' allow?",o:["Makes a variable const","Allows modification of a member even inside a const member function","Prevents modification","Creates a copy"],a:1},
]}/>

<Checklist items={[
  "I can use ofstream/ifstream for file I/O (and know files use RAII)",
  "I know cerr (unbuffered errors) vs clog (buffered logs) vs cout (output)",
  "I can parse CSV files with the two-loop getline pattern",
  "I know stod() converts string to double",
  "I can use STL algorithms: accumulate, find, count, sort",
  "I know accumulate's initial value matters (0 vs 0.0)",
  "I can throw runtime_error and catch by const reference",
  "I know e.what() returns the error message",
  "I mark getter functions const (after the parentheses)",
  "I understand mutable: exception to the const rule",
  "I can overload operator<< as a friend non-member function",
  "I know Scott Meyers' advice: use friend sparingly",
]}/>
</>)}
]};

export default module4;
