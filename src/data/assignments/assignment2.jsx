import { C, P, H, B, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, Checklist } from "../../components";

const assignment2 = {title:"Assignment 2: Portfolio Manager with CSV Data",content:(<>
<Hw num={2} title="OO Portfolio Manager" desc={`Starting from Assignment 1, build a complete Portfolio Manager:
Change #1: PortfolioMgr class that contains vector<Stock>
Change #2: Read stock data from CSV file (Yahoo Finance format)
Change #3: Compute next-day returns using STL algorithms
Change #4: Exception handling for missing symbols
Change #5: Overload operator<< for Stock
Change #6: Use proper const member functions

Use RELATIVE paths so TAs can build without modification.`}/>

<H>Sample CSV Data (Yahoo Finance Format)</H>
<P>Download historical stock data from Yahoo Finance. Each stock gets its own CSV file (e.g., AAPL.csv, MSFT.csv). The format looks like this:</P>

<Code title="AAPL.csv — sample data" code={`Date,Open,High,Low,Close,Adj Close,Volume
2024-10-01,230.00,230.20,229.49,229.62,229.62,69423746
2024-10-02,229.62,233.68,228.49,232.15,232.15,56598928
2024-10-03,232.15,236.02,231.35,235.38,235.38,53913819
2024-10-04,235.38,237.17,234.48,235.96,235.96,68051262
2024-10-07,236.48,237.49,233.95,234.82,234.82,45123500
2024-10-08,234.82,236.19,233.00,235.10,235.10,38654200`}/>

<AnnotatedCode title="CSV column meanings" lines={[
  {code:"Date",why:"Trading date (YYYY-MM-DD format). First row is header — skip it!"},
  {code:"Open",why:"Opening price for the day."},
  {code:"High",why:"Highest price during the day."},
  {code:"Low",why:"Lowest price during the day."},
  {code:"Close",why:"Closing price — USE THIS for portfolio valuation."},
  {code:"Adj Close",why:"Adjusted for splits/dividends. Use for historical analysis."},
  {code:"Volume",why:"Number of shares traded."}
]}/>

<Tip title="Downloading Data">
Use Python to download from Yahoo Finance:{"\n"}
```python{"\n"}
import yfinance as yf{"\n"}
data = yf.download("AAPL", start="2024-10-01", end="2024-12-31"){"\n"}
data.to_csv("AAPL.csv"){"\n"}
```{"\n"}
Or download manually from finance.yahoo.com → Historical Data → Download.
</Tip>

<Flowchart title="Strategy: CSV → Portfolio → Analysis" steps={[
  {label:"1. Read CSV",items:["ifstream","getline loop","istringstream"],color:C.b},
  {label:"2. Parse Fields",items:["Split by comma","stod() for numbers","Store in Stock"],color:C.o},
  {label:"3. Build Portfolio",items:["PortfolioMgr class","vector<Stock>","Add/remove stocks"],color:C.g},
  {label:"4. Compute",items:["accumulate total","Find by symbol","Exception if missing"],color:C.accent}
]}/>

<H>Part 1: The PortfolioMgr Class</H>
<P>PortfolioMgr is a class that CONTAINS a vector of stocks (composition). It provides operations on the entire portfolio.</P>

<Conversion from="Standalone vector in main()" to="Encapsulated in PortfolioMgr class" feature="Composition (has-a relationship)"
  beforeCode={`// main.cpp — data + logic mixed
int main() {
  vector<Stock> portfolio;
  portfolio.push_back(...);
  double total = 0;
  for (auto& s : portfolio)
    total += s.get_market_value();
}`}
  afterCode={`// PortfolioMgr class — data + logic bundled
class PortfolioMgr {
  vector<Stock> stocks_;
public:
  void add_stock(const Stock& s);
  double total_value() const;
};
// main.cpp — clean
int main() {
  PortfolioMgr mgr;
  mgr.add_stock(Stock(...));
  cout << mgr.total_value();
}`}/>

<AnnotatedCode title="portfolio_mgr.h" lines={[
  {code:"#ifndef PORTFOLIO_MGR_H",why:"Include guard."},
  {code:"#define PORTFOLIO_MGR_H",why:""},
  {code:"",why:""},
  {code:'#include "stock.h"',why:"Need Stock class definition."},
  {code:"#include <vector>",why:"For vector container."},
  {code:"#include <string>",why:"For symbol parameter."},
  {code:"#include <stdexcept>",why:"For runtime_error."},
  {code:"",why:""},
  {code:"class PortfolioMgr {",why:""},
  {code:"public:",why:""},
  {code:"    void add_stock(const Stock& stock);",why:"Add a stock. const& avoids copying the argument."},
  {code:"    void remove_stock(const std::string& symbol);",why:"Remove by symbol. Throws if not found."},
  {code:"    const Stock& get_stock(const std::string& symbol) const;",why:"Find by symbol. Returns const ref. Throws if not found."},
  {code:"    double total_value() const;",why:"Sum of all market values using accumulate."},
  {code:"    size_t size() const;",why:"Number of stocks in portfolio."},
  {code:"    const std::vector<Stock>& stocks() const;",why:"Read-only access to entire vector."},
  {code:"",why:""},
  {code:"private:",why:""},
  {code:"    std::vector<Stock> stocks_;",why:"COMPOSITION: PortfolioMgr HAS-A vector of stocks."},
  {code:"};",why:""},
  {code:"",why:""},
  {code:"#endif",why:""}
]}/>

<Step n={1} title="Implement total_value using std::accumulate">
<P>Instead of a manual loop, we use the STL algorithm accumulate. This requires a lambda to extract the value from each Stock.</P>
</Step>

<AnnotatedCode title="portfolio_mgr.cpp — key functions" lines={[
  {code:'#include "portfolio_mgr.h"',why:""},
  {code:"#include <algorithm>",why:"For std::find_if."},
  {code:"#include <numeric>",why:"For std::accumulate."},
  {code:"",why:""},
  {code:"void PortfolioMgr::add_stock(const Stock& stock) {",why:""},
  {code:"    stocks_.push_back(stock);",why:"Add to end of vector."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"const Stock& PortfolioMgr::get_stock(const std::string& symbol) const {",why:"Returns const reference — no copying."},
  {code:"    for (const auto& stock : stocks_) {",why:"Search through all stocks."},
  {code:"        if (stock.get_symbol() == symbol)",why:"Compare symbols."},
  {code:"            return stock;",why:"Found — return reference to the actual Stock in vector."},
  {code:"    }",why:""},
  {code:'    throw std::runtime_error("Symbol not found: " + symbol);',why:"Not found — throw exception. Caller must catch."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"double PortfolioMgr::total_value() const {",why:""},
  {code:"    return std::accumulate(",why:"STL algorithm that sums a range."},
  {code:"        stocks_.begin(), stocks_.end(),",why:"Range: all stocks."},
  {code:"        0.0,",why:"CRITICAL: 0.0 (double), not 0 (int). Initial value type determines return type."},
  {code:"        [](double sum, const Stock& s) {",why:"LAMBDA: takes running sum + current Stock, returns new sum."},
  {code:"            return sum + s.get_market_value();",why:"Extract market value from Stock."},
  {code:"        }",why:""},
  {code:"    );",why:""},
  {code:"}",why:""}
]}/>

<Confusion mistake="Using 0 instead of 0.0 as accumulate's initial value" why="accumulate(v.begin(), v.end(), 0, ...) treats the result as INT even if values are doubles — truncating all decimals! Use 0.0 to get a double result."/>

<MemDiagram title="PortfolioMgr Contains vector<Stock>" cells={[
  {addr:"PortfolioMgr",label:"mgr",value:"Object",color:C.accent},
  {type:"arrow",label:"has-a"},
  {addr:"stocks_",label:"vector<Stock>",value:"size=3",color:C.b},
  {type:"arrow",label:"contains"},
  {addr:"[0]",label:"Stock",value:"AAPL",color:C.g},
  {addr:"[1]",label:"Stock",value:"MSFT",color:C.g},
  {addr:"[2]",label:"Stock",value:"GOOGL",color:C.g}
]}/>

<H>Part 2: Reading CSV Files</H>
<P>We use the two-loop pattern: outer loop reads lines, inner loop splits by comma.</P>

<Step n={2} title="Open file and check for errors">
<P>Files are resources that can fail to open. Always check!</P>
</Step>

<AnnotatedCode title="csv_reader.cpp — reading stock data" lines={[
  {code:'#include "portfolio_mgr.h"',why:""},
  {code:"#include <fstream>",why:"For ifstream."},
  {code:"#include <sstream>",why:"For istringstream."},
  {code:"#include <string>",why:""},
  {code:"",why:""},
  {code:"void load_from_csv(PortfolioMgr& mgr, const std::string& filename) {",why:"Takes reference to modify the existing PortfolioMgr."},
  {code:"    std::ifstream infile(filename);",why:"Open file. RAII: closes automatically when infile goes out of scope."},
  {code:"    if (!infile) {",why:"Check if open failed. ! tests stream's error state."},
  {code:'        throw std::runtime_error("Cannot open file: " + filename);',why:"Throw exception — caller must handle."},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:"    std::string line;",why:"Buffer for each line."},
  {code:"    std::getline(infile, line);",why:"SKIP HEADER ROW. CSV has column names in first line."},
  {code:"",why:""},
  {code:"    while (std::getline(infile, line)) {",why:"OUTER LOOP: read one line at a time."},
  {code:"        std::istringstream iss(line);",why:"Wrap line in a stream for parsing."},
  {code:"        std::string field;",why:"Buffer for each comma-separated field."},
  {code:"        std::vector<std::string> fields;",why:"Collect all fields from this line."},
  {code:"",why:""},
  {code:"        while (std::getline(iss, field, ',')) {",why:"INNER LOOP: split by comma."},
  {code:"            fields.push_back(field);",why:"Store each field."},
  {code:"        }",why:""},
  {code:"",why:""},
  {code:"        // CSV: Date,Open,High,Low,Close,Volume,Symbol",why:""},
  {code:"        if (fields.size() >= 7) {",why:"Validate we have all columns."},
  {code:"            std::string symbol = fields[6];",why:"Symbol is 7th column (index 6)."},
  {code:"            double price = std::stod(fields[4]);",why:"Close price is 5th column. stod converts string to double."},
  {code:"            int qty = 100;",why:"Default quantity (or read from another source)."},
  {code:"            mgr.add_stock(Stock(symbol, price, qty));",why:"Create Stock and add to portfolio."},
  {code:"        }",why:""},
  {code:"    }",why:""},
  {code:"}",why:"File auto-closes here (RAII destructor)."}
]}/>

<Confusion mistake="Forgetting to skip the header row" why={`CSV files typically have column names in the first line (Date,Open,High,...). If you try to parse this as data, stod("Date") throws an exception. Call getline once before the loop to discard the header.`}/>

<H>Part 3: Exception Handling</H>
<Step n={3} title="Catch and handle exceptions">
<P>When get_stock throws because a symbol isn't found, the caller must catch the exception.</P>
</Step>

<AnnotatedCode title="main.cpp — using the portfolio with exceptions" lines={[
  {code:'#include "portfolio_mgr.h"',why:""},
  {code:"#include <iostream>",why:""},
  {code:"",why:""},
  {code:"int main() {",why:""},
  {code:"    PortfolioMgr mgr;",why:""},
  {code:"    // ... load data ...",why:""},
  {code:"",why:""},
  {code:"    try {",why:"Wrap code that might throw."},
  {code:'        const Stock& stock = mgr.get_stock("XYZ");',why:"Might throw if XYZ not in portfolio."},
  {code:"        std::cout << stock.get_price() << std::endl;",why:""},
  {code:"    }",why:""},
  {code:"    catch (const std::runtime_error& e) {",why:"Catch by CONST REFERENCE. Avoids copy, preserves polymorphism."},
  {code:'        std::cerr << "Error: " << e.what() << std::endl;',why:"e.what() returns the message string."},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:"    return 0;",why:""},
  {code:"}",why:""}
]}/>

<H>Part 4: Overloading operator{"<<"}</H>
<Step n={4} title="Make Stock printable with cout << stock">
<P>operator{"<<"} must be a friend non-member function so cout comes first.</P>
</Step>

<AnnotatedCode title="operator<< for Stock" lines={[
  {code:"// In stock.h, inside class Stock:",why:""},
  {code:"friend std::ostream& operator<<(std::ostream& os, const Stock& s);",why:"FRIEND: grants access to private members without being a member function."},
  {code:"",why:""},
  {code:"// In stock.cpp:",why:""},
  {code:"std::ostream& operator<<(std::ostream& os, const Stock& s) {",why:"NON-MEMBER function (no Stock::)."},
  {code:'    os << s.symbol_ << ": $" << s.price_',why:"Access private members directly (thanks to friend)."},
  {code:'       << " x " << s.quantity_',why:""},
  {code:'       << " = $" << s.get_market_value();',why:"Can also use public functions."},
  {code:"    return os;",why:"Return stream for chaining: cout << s1 << s2;"},
  {code:"}",why:""}
]}/>

<Conversion from="Manual print function" to="operator<< overload" feature="Operator Overloading"
  beforeCode={`void print_stock(const Stock& s) {
  cout << s.get_symbol() << ": $"
       << s.get_price() << endl;
}
// Usage:
print_stock(s1);
print_stock(s2);`}
  afterCode={`ostream& operator<<(ostream& os,
                    const Stock& s) {
  os << s.symbol_ << ": $"
     << s.price_;
  return os;
}
// Usage:
cout << s1 << endl << s2 << endl;
// Chainable!`}/>

<Tip title="The Complete Pattern">
1. <B>PortfolioMgr</B>: encapsulates vector + operations{"\n"}
2. <B>CSV reading</B>: ifstream + getline + istringstream + stod{"\n"}
3. <B>STL algorithms</B>: accumulate with lambda for computed values{"\n"}
4. <B>Exceptions</B>: throw when symbol not found, catch by const ref{"\n"}
5. <B>operator{"<<"}</B>: friend non-member for natural printing
</Tip>

<Quiz questions={[
  {q:"Why does accumulate(v.begin(), v.end(), 0, lambda) truncate doubles?",o:["Lambda is wrong","Initial value 0 is int, so result is int — decimals lost","accumulate can't handle doubles","Bug in STL"],a:1},
  {q:"In CSV parsing, why call getline once before the while loop?",o:["Required by C++","To skip the header row containing column names","To initialize the stream","No reason"],a:1},
  {q:"get_stock() throws when symbol not found. The caller should:",o:["Ignore it","Wrap in try/catch to handle the exception","Check manually before calling","Return nullptr"],a:1},
  {q:"operator<< is a friend because:",o:["It's faster","As a member, usage would be s << cout (backwards)","Friends are required for operators","cout is special"],a:1},
  {q:"Consider:\n```cpp\nPortfolioMgr mgr;\nmgr.add_stock(Stock(\"AAPL\", 150.0, 10));\nconst Stock& s = mgr.get_stock(\"AAPL\");\ns.set_price(200.0);  // Line A\n```\nWhat happens at Line A?",o:["Price changes to 200","Compile error — s is const reference, cannot call non-const function","Runtime error","Nothing"],a:1,e:"s is a const reference. set_price() is not const (it modifies the object), so calling it on a const reference is a compile error."},
  {q:"Consider:\n```cpp\nstd::ifstream infile(\"data.csv\");\nif (!infile) {\n    std::cerr << \"Failed\" << std::endl;\n    return 1;\n}\nstd::string line;\nwhile (std::getline(infile, line)) {\n    // process line\n}\n// Is infile.close() needed here?\n```\nWhat happens when the function returns?",o:["Memory leak — close() was not called","File auto-closes due to RAII — destructor closes it","Undefined behavior","File stays open forever"],a:1,e:"RAII (Resource Acquisition Is Initialization): ifstream's destructor automatically closes the file. No manual close() needed."}
]}/>

<Checklist items={[
  "Created PortfolioMgr class with vector<Stock> member (composition)",
  "Implemented add_stock, get_stock, total_value, size functions",
  "Used std::accumulate with lambda to compute total value",
  "Used 0.0 (not 0) as initial value for double accumulation",
  "Implemented CSV reading with two-loop getline pattern",
  "Skipped header row before main parsing loop",
  "Used stod() to convert string fields to double",
  "Threw std::runtime_error when symbol not found",
  "Caught exceptions by const reference",
  "Overloaded operator<< as friend non-member function",
  "Used relative paths for CSV files",
  "All getters marked const"
]}/>
</>)};

export default assignment2;
