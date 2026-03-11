import { C, P, H, B, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, FullCode } from "../../components";

const assignment1 = {title:"Assignment 1: Building a Stock Portfolio",content:(<>
<Hw num={1} title="Stock Portfolio Manager" desc={`Build a complete Stock class following the FINM 326 coding standard.
Store 5 stocks in a vector<Stock>. Compute total portfolio value V = Σ(price_i × qty_i).
Print each stock's details and the total portfolio value to the console.

Requirements:
• Stock class in separate stock.h / stock.cpp files
• Member initializer lists in constructors
• Private data members with trailing underscore
• Public getters (const-correct)
• Include guards (#ifndef or #pragma once)`}/>

<Flowchart title="Strategy: What We're Building" steps={[
  {label:"Goal",items:["Stock class","Portfolio vector","Total value"],color:C.g},
  {label:"Data",items:["symbol_","price_","quantity_"],color:C.b},
  {label:"Operations",items:["getters","getMarketValue()"],color:C.o},
  {label:"Main",items:["Create 5 stocks","Store in vector","Compute total"],color:C.accent}
]}/>

<H>Part 1: The Stock Header File (stock.h)</H>
<P>We start with the header file that defines WHAT the Stock class contains. Every line serves a purpose.</P>

<Step n={1} title="Include guard prevents double inclusion">
<P>If stock.h is included multiple times (directly and indirectly), the preprocessor sees the definition twice → compile error. The include guard ensures the code is only processed once.</P>
</Step>

<AnnotatedCode title="stock.h — complete header" lines={[
  {code:"#ifndef STOCK_H",why:"IF NOT DEFINED: first time, STOCK_H isn't defined, so preprocessor enters this block."},
  {code:"#define STOCK_H",why:"Define STOCK_H now. Next time this file is included, #ifndef fails → skip entire content."},
  {code:"",why:""},
  {code:"#include <string>",why:"Need std::string for the symbol member."},
  {code:"using std::string;",why:"Professor's style: qualify individually so we write 'string' not 'std::string'."},
  {code:"",why:""},
  {code:"class Stock {",why:"Begin class definition. This creates a NEW TYPE called Stock."},
  {code:"public:",why:"Everything below is accessible to anyone — the class INTERFACE."},
  {code:"    // Constructors",why:""},
  {code:"    Stock();",why:"Default constructor: creates empty/zero stock. Required if you want Stock s; syntax."},
  {code:"    Stock(string symbol, double price, int quantity);",why:"Parameterized constructor: the useful one. Creates a fully initialized Stock."},
  {code:"    ~Stock();",why:"Destructor: called when object destroyed. Empty here but good practice to declare."},
  {code:"",why:""},
  {code:"    // Getters (const-correct)",why:""},
  {code:"    string get_symbol() const;",why:"const AFTER () means: this function does not modify the object. Can be called on const Stock."},
  {code:"    double get_price() const;",why:"Getter for price. Returns a COPY of the value."},
  {code:"    int get_quantity() const;",why:"Getter for quantity."},
  {code:"    double get_market_value() const;",why:"Computed property: price × quantity. Also const because it only reads data."},
  {code:"",why:""},
  {code:"    // Setters",why:""},
  {code:"    void set_price(double price);",why:"Allows changing the price from outside the class."},
  {code:"    void set_quantity(int quantity);",why:"Allows changing the quantity."},
  {code:"",why:""},
  {code:"private:",why:"Everything below is HIDDEN — only Stock's own functions can access these."},
  {code:"    string symbol_;",why:"Trailing underscore _ = FINM 326 convention for private members."},
  {code:"    double price_;",why:"Stock price. double for 15 digits of precision."},
  {code:"    int quantity_;",why:"Number of shares held."},
  {code:"};",why:"CRITICAL: semicolon after closing brace! Classes/structs MUST end with };"},
  {code:"",why:""},
  {code:"#endif // STOCK_H",why:"End of include guard. Comment is optional but documents what we're ending."}
]}/>

<Confusion mistake="Forgetting const on getters: double get_price();" why="Without const, you cannot call get_price() on a const Stock object. The compiler assumes the function might modify the object. Add const AFTER the parentheses: double get_price() const;"/>

<H>Part 2: The Implementation File (stock.cpp)</H>
<P>The header says WHAT exists. The implementation says HOW it works. Each function is prefixed with Stock:: to indicate it belongs to the Stock class.</P>

<Conversion from="Assignment in constructor body (two operations per member)" to="Member initializer list (one operation per member)" feature="Member Initializer List"
  beforeCode={`Stock::Stock(string s, double p,
              int q) {
  symbol_ = s;  // default construct
  price_ = p;   // THEN assign
  quantity_ = q;// two operations!
}`}
  afterCode={`Stock::Stock(string s, double p,
              int q)
  : symbol_(s),   // directly
    price_(p),    // initialize
    quantity_(q)  // ONE operation!
{ }`}/>

<Step n={2} title="Implement all member functions">
<P>Each function must match the declaration exactly — same name, same parameters, same const-ness. The return type and const are part of the signature.</P>
</Step>

<AnnotatedCode title="stock.cpp — complete implementation" lines={[
  {code:'#include "stock.h"',why:"Include our own header so this .cpp knows about the Stock class definition."},
  {code:"",why:""},
  {code:"// Default constructor",why:""},
  {code:"Stock::Stock()",why:"Stock:: means 'this function belongs to the Stock class'."},
  {code:'    : symbol_(""), price_(0.0), quantity_(0)',why:"Initialize to empty/zero defaults using initializer list."},
  {code:"{ }",why:"Body is empty — all initialization done in the list."},
  {code:"",why:""},
  {code:"// Parameterized constructor",why:""},
  {code:"Stock::Stock(string symbol, double price, int quantity)",why:"Takes all three values."},
  {code:"    : symbol_(symbol), price_(price), quantity_(quantity)",why:"Initialize each member directly. More efficient than assignment."},
  {code:"{ }",why:""},
  {code:"",why:""},
  {code:"// Destructor",why:""},
  {code:"Stock::~Stock() { }",why:"Nothing to clean up (no dynamic allocation). Still good to define explicitly."},
  {code:"",why:""},
  {code:"// Getters",why:""},
  {code:"string Stock::get_symbol() const {",why:"const must appear in both declaration AND definition."},
  {code:"    return symbol_;",why:"Returns a COPY of the symbol string."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"double Stock::get_price() const {",why:""},
  {code:"    return price_;",why:""},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"int Stock::get_quantity() const {",why:""},
  {code:"    return quantity_;",why:""},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"double Stock::get_market_value() const {",why:"Computed property: calculates value on demand."},
  {code:"    return price_ * quantity_;",why:"No separate member needed — calculate from existing data."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"// Setters",why:""},
  {code:"void Stock::set_price(double price) {",why:""},
  {code:"    price_ = price;",why:"Overwrites private member. This is the ONLY way to change price from outside."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"void Stock::set_quantity(int quantity) {",why:""},
  {code:"    quantity_ = quantity;",why:""},
  {code:"}",why:""}
]}/>

<H>Part 3: Using the Stock Class (main.cpp)</H>
<P>Now we create Stock objects, store them in a vector, and compute the total portfolio value.</P>

<Step n={3} title="Create and store stocks in a vector">
<P>vector&lt;Stock&gt; stores Stock objects. push_back adds to the end. We iterate to compute total value.</P>
</Step>

<AnnotatedCode title="main.cpp — portfolio manager" lines={[
  {code:'#include "stock.h"',why:"Include Stock class definition."},
  {code:"#include <iostream>",why:"For cout."},
  {code:"#include <vector>",why:"For vector container."},
  {code:"#include <iomanip>",why:"For setprecision to format dollar amounts."},
  {code:"",why:""},
  {code:"using std::cout;",why:"Professor's style: qualify each name individually."},
  {code:"using std::endl;",why:""},
  {code:"using std::vector;",why:""},
  {code:"using std::fixed;",why:""},
  {code:"using std::setprecision;",why:""},
  {code:"",why:""},
  {code:"int main() {",why:""},
  {code:"    // Create a portfolio (vector of stocks)",why:""},
  {code:"    vector<Stock> portfolio;",why:"Empty vector. size=0."},
  {code:"",why:""},
  {code:"    // Add 5 stocks",why:""},
  {code:'    portfolio.push_back(Stock("AAPL", 178.50, 100));',why:"Create Stock, add to vector. push_back copies the object."},
  {code:'    portfolio.push_back(Stock("MSFT", 378.25, 50));',why:""},
  {code:'    portfolio.push_back(Stock("GOOGL", 141.80, 75));',why:""},
  {code:'    portfolio.push_back(Stock("AMZN", 178.35, 40));',why:""},
  {code:'    portfolio.push_back(Stock("NVDA", 875.40, 25));',why:""},
  {code:"",why:""},
  {code:"    // Compute total portfolio value",why:""},
  {code:"    double total_value = 0.0;",why:"Accumulator for sum."},
  {code:"",why:""},
  {code:"    cout << fixed << setprecision(2);",why:"Format output: 2 decimal places."},
  {code:'    cout << "=== Portfolio ===" << endl;',why:""},
  {code:"",why:""},
  {code:"    for (const auto& stock : portfolio) {",why:"Range-based for. const auto& avoids copying, allows read-only access."},
  {code:"        cout << stock.get_symbol()",why:"Call getter through the reference."},
  {code:'             << ": $" << stock.get_price()',why:""},
  {code:'             << " x " << stock.get_quantity()',why:""},
  {code:'             << " = $" << stock.get_market_value()',why:"Computed on demand."},
  {code:"             << endl;",why:""},
  {code:"        total_value += stock.get_market_value();",why:"Add to running total."},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:'    cout << "\\nTotal Portfolio Value: $" << total_value << endl;',why:"Print final result."},
  {code:"",why:""},
  {code:"    return 0;",why:""},
  {code:"}",why:""}
]}/>

<MemDiagram title="Vector of Stocks in Memory" cells={[
  {addr:"portfolio",label:"vector<Stock>",value:"size=5, capacity≥5",color:C.b},
  {type:"arrow",label:"contains"},
  {addr:"[0]",label:"Stock",value:'AAPL,$178.50,100',color:C.g},
  {addr:"[1]",label:"Stock",value:'MSFT,$378.25,50',color:C.g},
  {addr:"[2]",label:"Stock",value:'GOOGL,$141.80,75',color:C.g},
  {addr:"...",label:"",value:"",color:C.td}
]}/>

<H>Building and Running</H>
<Step n={4} title="Compile all files together">
<Code code={`# Compile each .cpp to object files
g++ -c stock.cpp -o stock.o
g++ -c main.cpp -o main.o

# Link object files into executable
g++ stock.o main.o -o portfolio

# Run
./portfolio`}/>
</Step>

<Code title="Expected output" code={`=== Portfolio ===
AAPL: $178.50 x 100 = $17850.00
MSFT: $378.25 x 50 = $18912.50
GOOGL: $141.80 x 75 = $10635.00
AMZN: $178.35 x 40 = $7134.00
NVDA: $875.40 x 25 = $21885.00

Total Portfolio Value: $76416.50`}/>

<Confusion mistake="Using s.price_ directly instead of s.get_price()" why="price_ is private. Direct access causes compile error: 'cannot access private member'. Use the public getter: s.get_price(). This is encapsulation working as intended."/>

<Tip title="Key Design Decisions">
1. <B>get_market_value()</B>: Computed property, not stored. Avoids data inconsistency.{"\n"}
2. <B>No set_symbol()</B>: Symbol is fixed at construction. Deliberate design choice.{"\n"}
3. <B>const getters</B>: Allows calling on const Stock objects.{"\n"}
4. <B>Member initializer list</B>: One operation vs two. More efficient.
</Tip>

<Quiz questions={[
  {q:"Why use member initializer lists instead of assignment in constructor body?",o:["Shorter code","Members are initialized directly (one operation) instead of default-constructed then assigned (two operations)","Compiler requires it","No difference"],a:1},
  {q:"What does the trailing underscore in `symbol_` indicate?",o:["It's a pointer","It's a constant","Private member (FINM 326 naming convention)","It's static"],a:2},
  {q:"Consider:\n```cpp\nconst Stock s(\"AAPL\", 150.0, 10);\ncout << s.get_price();\n```\nThis compiles because:",o:["const objects can call any function","get_price() is marked const — it doesn't modify the object","s is actually not const","Stock is a special class"],a:1},
  {q:"Consider:\n```cpp\nvector<Stock> portfolio;\nportfolio.push_back(Stock(\"AAPL\", 150.0, 10));\ncout << portfolio[0].get_symbol();\n```\nWhat is printed?",o:["AAPL","Compile error — Stock not copyable","Runtime error","Nothing"],a:0,e:"push_back copies the Stock into the vector. portfolio[0] accesses the first element, and get_symbol() returns \"AAPL\"."},
  {q:"Why is there no set_symbol() function?",o:["It's required by C++","The professor forgot","Deliberate design: a stock's symbol should not change after creation","Symbols are automatically generated"],a:2,e:"Design choice: some attributes are immutable after construction. The professor said: 'For a stock, changing the symbol may not make much sense.'"},
  {q:"In `for (const auto& stock : portfolio)`, why use `const auto&`?",o:["Required by C++","const prevents modification, & avoids copying each Stock object","It's faster than auto","No reason"],a:1,e:"const auto& gives read-only access without copying. Without &, each Stock would be copied every iteration."}
]}/>

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
    std::vector<Stock> portfolio;

    portfolio.emplace_back("AAPL", 248.04, 100);
    portfolio.emplace_back("GOOGL", 327.93, 50);
    portfolio.emplace_back("MSFT", 465.95, 75);
    portfolio.emplace_back("AMZN", 239.16, 30);
    portfolio.emplace_back("NVDA", 187.67, 40);

    double totalValue = 0.0;
    for (auto it = portfolio.begin(); it != portfolio.end(); ++it) {
        totalValue += it->getMarketValue();
    }

    std::cout << "=== Stock Portfolio ===" << std::endl;
    for (const auto& stock : portfolio) {
        std::cout << stock.getTicker() << ": $" << stock.getMarketValue() << std::endl;
    }

    std::cout << "Total: $" << totalValue << std::endl;

    return 0;
}`}
]}/>
</>)};

export default assignment1;
