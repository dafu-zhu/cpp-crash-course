import { C, P, H, B, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, Checklist } from "../components";

const module5 = {id:5,title:"Inheritance & Pricing",sub:"Lec 5-7 · Inheritance, Polymorphism, BS, MC, Binomial Tree",icon:"🧬",color:"#7c6cf0",sections:[

// ═══════ 5.1 INHERITANCE ═══════
{title:"Inheritance: Sharing Common Code",content:(<>
<P>We've covered two of four OOP pillars: (1) Classes/Objects, (2) Encapsulation/Abstraction. Now: <B>Inheritance</B> — creating new classes from existing ones to share common code.</P>

<H>The Problem: Duplicated Code</H>
<P>The professor uses this classroom example: we need Student and Employee classes. Both have name and email, but Student has major while Employee has job title.</P>

<Conversion from="Two classes with duplicated members" to="Base class + derived classes" feature="Inheritance (class Student : public Person)"
  beforeCode={`class Student {
  string name_;   // duplicated!
  string email_;  // duplicated!
  string major_;
  // duplicated functions...
};
class Employee {
  string name_;   // duplicated!
  string email_;  // duplicated!
  string job_;
  // duplicated functions...
};`}
  afterCode={`class Person {   // BASE: common code
  string name_;
  string email_;
};
class Student : public Person {
  string major_; // only the NEW part
};
class Employee : public Person {
  string job_;   // only the NEW part
};`}
/>

<Hierarchy root="Person (base)" children={["Student","Employee"]} grandchildren={[["+ major_","+ get_major()"],["+ job_","+ get_job()"]]}/>

<H>Key Terminology</H>
<Step n={1} title="Base class: contains common code shared by all derived classes">
Person has name_, email_, get_name(), get_email(). Written once, inherited by all.
</Step>
<Step n={2} title="Derived class: inherits everything from base, adds specialized members">
Student inherits all Person members AND adds major_. It IS-A Person. <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>class Student : public Person</code> — the colon means "inherits from."
</Step>

<H>Derived Class Constructor</H>
<P>A derived class must call the base class constructor to initialize inherited members:</P>

<AnnotatedCode title="Derived class constructor" lines={[
  {code:"Student::Student(string name, string email, string major)",why:"Takes ALL parameters — both inherited (name, email) and new (major)."},
  {code:"    : Person(name, email),",why:"Call base class constructor FIRST. This initializes name_ and email_ in Person."},
  {code:"      major_(major)",why:"Then initialize the derived class's own members."},
  {code:"{ }",why:""},
]}/>

<H>Protection Levels: public, private, protected</H>
<P>Inheritance introduces a third protection level — <B>protected</B>:</P>

<Tip title="Three Protection Levels (Complete Picture)">
<B>public:</B> anyone can access (outside code, derived classes, the class itself){"\n"}
<B>private:</B> ONLY the class itself can access. Derived classes CANNOT.{"\n"}
<B>protected:</B> the class itself AND derived classes can access. Outside code CANNOT.{"\n\n"}
Use protected for base class data that derived classes need (like K_ and T_ in the Option class).
</Tip>

<AnnotatedCode title="Base class with protected members" lines={[
  {code:"class Person {",why:""},
  {code:"public:",why:"Interface — anyone can use."},
  {code:"    string get_name() const;",why:"Public: accessible by everyone."},
  {code:"protected:",why:"Shared with derived classes — but NOT outside code."},
  {code:"    string name_;",why:"Student/Employee can access this directly. Outside code cannot."},
  {code:"    string email_;",why:"Same: accessible inside Person, Student, Employee only."},
  {code:"};",why:""},
]}/>

<Confusion mistake="Making base class data private when derived classes need it" why="Private members are completely invisible to derived classes. If Student needs to access name_, it must be protected (accessible by class + derived) not private (accessible by class only)."/>

<H>Inheritance Advantages</H>
<P>1. <B>Reusability:</B> common code written once in base. 2. <B>Maintainability:</B> fix a bug in Person → fixed for all derived. 3. <B>Extensibility:</B> add new types (Visitor) without modifying existing code.</P>

<Quiz questions={[
  {q:"'class Student : public Person' means:",o:["Student contains a Person","Student IS-A Person (inherits all Person members)","Person inherits from Student","Student replaces Person"],a:1},
  {q:"protected members are accessible by:",o:["Anyone","Only the class itself","The class itself AND derived classes","Only derived classes"],a:2},
  {q:"In a derived constructor, the base constructor is called:",o:["After the derived body","In the member initializer list, before own members","Automatically with no arguments","It's not called"],a:1},
]}/>
</>)},

// ═══════ 5.2 VIRTUAL FUNCTIONS & ABSTRACT CLASSES ═══════
{title:"virtual, pure virtual, abstract",content:(<>
<H>The Problem: Different Implementations</H>
<P>Base classes share common code. But what about functions where each derived class needs a DIFFERENT implementation? For option pricing: Call and Put both have price(), but the formulas are completely different.</P>

<H>virtual: "Derived classes MAY override this"</H>
<AnnotatedCode title="virtual functions" lines={[
  {code:"class Base1 {",why:""},
  {code:"public:",why:""},
  {code:"    virtual void fun1();",why:"VIRTUAL: base provides a default implementation. Derived classes CAN override it with their own."},
  {code:"    virtual void fun2();",why:"Also virtual. Derived can override or inherit the default."},
  {code:"    void fun3();",why:"NOT virtual. Derived classes SHOULD NOT override this. They inherit it as-is."},
  {code:"};",why:""},
]}/>

<AnnotatedCode title="Derived overrides fun1, inherits fun2 and fun3" lines={[
  {code:"class Derived1 : public Base1 {",why:""},
  {code:"public:",why:""},
  {code:"    void fun1() override;",why:"OVERRIDE keyword (C++11): explicitly says 'I'm overriding a virtual function.' If the base signature doesn't match, the COMPILER catches the error."},
  {code:"};",why:"Derived1 gets its own fun1(), inherits Base1's fun2() and fun3()."},
]}/>

<Confusion mistake="Overriding a non-virtual function" why="The professor's slide says: 'We should not override inherited non-virtual functions.' Non-virtual functions are not meant to be overridden — doing so leads to confusing behavior depending on whether you call through base or derived pointer."/>

<H>pure virtual (= 0): "Derived classes MUST implement this"</H>
<P>Sometimes there's no reasonable default implementation. For Option::price(), there's no formula that works for all option types. We make it <B>pure virtual</B>:</P>

<AnnotatedCode lines={[
  {code:"class Base2 {",why:""},
  {code:"public:",why:""},
  {code:"    virtual void fun1() = 0;",why:"PURE VIRTUAL: the '= 0' means 'no default implementation.' Every derived class MUST provide its own implementation. Without it, the derived class is also abstract."},
  {code:"};",why:""},
]}/>

<H>Abstract Classes</H>
<Step n={3} title="A class with at least one pure virtual function is abstract">
You CANNOT create objects of an abstract class. You can only create objects of concrete derived classes that implement all pure virtual functions. This makes sense: "Option" is a concept — you always have a specific option type.
</Step>

<AnnotatedCode title="Abstract class → concrete derived" lines={[
  {code:"Option opt(100, 1);",why:"ERROR! Option is abstract (has pure virtual price()). Cannot instantiate."},
  {code:"EuropeanCall call(100, 1);",why:"OK! EuropeanCall implements price(). It's concrete."},
  {code:"EuropeanPut put(100, 1);",why:"OK! EuropeanPut also implements price()."},
]}/>

<Exam>The override keyword is optional but strongly recommended. It tells the compiler: "I intend to override a virtual function." If you misspell the function name or get parameters wrong, the compiler catches the error at compile time instead of silently creating a new function that doesn't override anything.</Exam>

<Quiz questions={[
  {q:"A pure virtual function has:",o:["A default implementation","= 0 (no implementation, derived MUST provide one)","override keyword","No return type"],a:1},
  {q:"An abstract class:",o:["Has all functions implemented","Has at least one pure virtual function and CANNOT be instantiated","Cannot have any data members","Must be derived from another abstract class"],a:1},
  {q:"The override keyword:",o:["Creates a new virtual function","Tells compiler 'I'm overriding a base virtual function' — catches signature mismatches","Makes a function pure virtual","Is required for all virtual functions"],a:1},
]}/>
</>)},

// ═══════ 5.3 BLACK-SCHOLES PRICER ═══════
{title:"Black-Scholes Formulas & Option Hierarchy",content:(<>
<Flowchart title="Strategy: BS Pricer Design" steps={[
  {label:"Goal",items:["Price European","Call and Put","with Greeks"],color:"#e74c3c"},
  {label:"Design Question",items:["One class or two?","Common code?","What's different?"],color:"#3498db"},
  {label:"Solution",items:["Option base (abstract)","EuropeanCall derived","EuropeanPut derived"],color:"#2ecc71"},
]}/>

<H>The Formulas</H>
<P>Call price: V_call = S₀·N(d₁) − K·e^(−rT)·N(d₂)</P>
<P>Put price: V_put = K·e^(−rT)·N(−d₂) − S₀·N(−d₁)</P>
<P>Where d₁ = [ln(S·e^(rT)/K)] / (σ√T) + σ√T/2, and d₂ = d₁ − σ√T</P>
<P>N(x) = CDF of standard normal = ½[1 + erf(x/√2)]</P>

<H>The Greeks (Risk Sensitivities)</H>
<P>Call Delta: N(d₁). Put Delta: N(d₁) − 1.</P>
<P>Gamma (same for call and put): N'(d₁) / (S·σ·√T), where N'(x) = (1/√(2π))·exp(−x²/2)</P>

<H>Math Functions from &lt;cmath&gt;</H>
<P>sqrt(), exp(), log() (natural log), erf() (error function). C++20 also provides std::numbers::pi.</P>

<H>Class Design: The Option Hierarchy</H>
<Hierarchy root="Option (abstract)" children={["EuropeanCall","EuropeanPut"]}/>

<AnnotatedCode title="Option base class" lines={[
  {code:"class Option {",why:""},
  {code:"public:",why:""},
  {code:"    Option(double K, double T);",why:"Constructor takes strike and maturity — common to all options."},
  {code:"    virtual double price(double S, double r, double v) const = 0;",why:"PURE VIRTUAL: each option type has a different pricing formula. const because pricing doesn't modify the option."},
  {code:"    virtual ~Option() = default;",why:"VIRTUAL DESTRUCTOR: essential in any base class with virtual functions. Without it, deleting a derived through base pointer → undefined behavior."},
  {code:"protected:",why:"Derived classes need access to these."},
  {code:"    double d1(double S, double r, double v) const;",why:"Common helper: d1 calculation shared by calls and puts. Non-virtual — same formula for all."},
  {code:"    double d2(double S, double r, double v) const;",why:"Common helper: d2 = d1 − σ√T."},
  {code:"    double K_;",why:"Strike price. Protected so EuropeanCall/Put can access."},
  {code:"    double T_;",why:"Time to maturity."},
  {code:"};",why:""},
]}/>

<AnnotatedCode title="EuropeanCall derived class" lines={[
  {code:"class EuropeanCall : public Option {",why:"IS-A Option. Inherits K_, T_, d1(), d2()."},
  {code:"public:",why:""},
  {code:"    EuropeanCall(double K, double T);",why:"Passes K,T to Option constructor."},
  {code:"    double price(double S, double r, double v) const override;",why:"Implements the call pricing formula. override catches signature mismatches."},
  {code:"    double delta(double S, double r, double v) const;",why:"Call delta: N(d1)."},
  {code:"    double gamma(double S, double r, double v) const;",why:"Call gamma: N'(d1)/(S·σ·√T)."},
  {code:"};",why:""},
]}/>

<H>BSPricer_Revisit: EuropeanVanilla Intermediate Class</H>
<P>The professor revisited this design to handle a subtle issue: Gamma is the SAME formula for vanilla calls and puts. Where should we put it?</P>
<P>Three choices: (1) non-virtual in Option base — but not all option types share this gamma (e.g., binary options). (2) virtual with default — same problem. (3) pure virtual — then we repeat code in Call and Put.</P>
<P>Solution: add an intermediate class <B>EuropeanVanilla</B> between Option and Call/Put:</P>

<Hierarchy root="Option (abstract)" children={["EuropeanVanilla","EuropeanBinary"]} grandchildren={[["EuropeanCall","EuropeanPut"],["BinaryCall","BinaryPut"]]}/>

<P>Gamma is implemented once in EuropeanVanilla. Call and Put inherit it. Binary options implement their own gamma. Code reuse without forcing a wrong default on all types.</P>

<Hw num={3} title="Black-Scholes Pricer (5%)" desc={`Use inheritance to write an OO Black Scholes Pricer.
• Option base class (abstract, pure virtual price)
• EuropeanCall and EuropeanPut derived classes
• Support: price(), delta(), gamma()
• Test: Call S₀=100, K=100, T=1, σ=0.3, r=0.05
        Put  S₀=120, K=120, T=2, σ=0.4, r=0.1
Due: Feb 18`} practice={`Extend to Binary (Digital) options.
BinaryCall pays 1 if S_T > K, else 0. BinaryPut pays 1 if S_T < K, else 0.
Build hierarchy: Option → EuropeanVanilla → {Call,Put}, Option → EuropeanBinary → {BinaryCall, BinaryPut}.
Gamma for vanilla is shared; gamma for binary is different.`}/>

<Quiz questions={[
  {q:"Why is price() pure virtual in the Option base class?",o:["For performance","There's no single formula that works for all option types","The compiler requires it","It makes the class concrete"],a:1},
  {q:"d1() and d2() are NON-virtual in Option because:",o:["They're private","Their formula is the same for all option types — no need to override","Virtual functions are slow","They return double"],a:1},
  {q:"Why add an EuropeanVanilla intermediate class?",o:["For fun","To share gamma implementation between Call and Put without forcing it on all option types","It's required by C++","To make the hierarchy deeper"],a:1},
]}/>
</>)},

// ═══════ 5.4 UNIT TESTING ═══════
{title:"Unit Testing (Catch2)",content:(<>
<P>The professor introduced unit testing alongside the BS pricer: "Testing is an important part of software development."</P>

<H>Why Unit Tests?</H>
<P>Software changes. When you fix a bug or add a feature, you might break something else. Unit tests catch regressions automatically. Write tests alongside code, keep them permanently.</P>

<H>Testing Guidelines</H>
<P>1. One test per unit/function. 2. Test normal cases AND edge cases. 3. For floating-point, use tolerance (Approx) not exact equality.</P>

<H>Catch2 Framework</H>
<AnnotatedCode title="Catch2 test example" lines={[
  {code:"#define CATCH_CONFIG_MAIN",why:"Tells Catch2 to generate a main() function automatically."},
  {code:'#include "catch.hpp"',why:"Single-header testing library — no installation needed, just include."},
  {code:"",why:""},
  {code:'TEST_CASE("BS Call price is correct", "[BS]") {',why:"Define a test case with a name and tags."},
  {code:"    EuropeanCall call(100.0, 1.0);",why:"Create the object to test."},
  {code:"    double price = call.price(100.0, 0.05, 0.3);",why:"Call the function being tested."},
  {code:"    REQUIRE(price == Approx(14.2313).epsilon(0.001));",why:"REQUIRE checks the result. Approx handles floating-point imprecision: passes if within 0.1% of expected value."},
  {code:"}",why:""},
]}/>

<Confusion mistake="Comparing doubles with exact equality: REQUIRE(price == 14.2313)" why="Floating-point arithmetic has rounding errors. Use Approx: REQUIRE(price == Approx(14.2313).epsilon(0.001)). The epsilon sets the tolerance."/>
</>)},

// ═══════ 5.5 POLYMORPHISM ═══════
{title:"Polymorphism",content:(<>
<P>The fourth and final OOP pillar. Greek: "many forms." The professor's definition:</P>
<Prof>"Types related by inheritance form a polymorphic hierarchy when the base class declares virtual functions. Polymorphic types can be used interchangeably through base class pointers or references."</Prof>

<H>The Liskov Substitution Principle (LSP)</H>
<Step n={1} title="A base pointer/reference can refer to ANY derived type">
<AnnotatedCode lines={[
  {code:"Option* opt = new EuropeanCall(100, 1);",why:"Base pointer pointing to a derived object. Legal because EuropeanCall IS-A Option."},
  {code:"opt->price(100, 0.05, 0.3);",why:"Calls EuropeanCall::price() — not Option::price()! The correct derived function is chosen at RUNTIME based on the actual type."},
  {code:"",why:""},
  {code:"EuropeanPut put(100, 1);",why:""},
  {code:"Option& ref = put;",why:"Base REFERENCE bound to derived object. Also polymorphic."},
  {code:"ref.price(120, 0.1, 0.4);",why:"Calls EuropeanPut::price()."},
]}/>
</Step>

<H>The Power: One Function for All Option Types</H>
<Step n={2} title="Write code against the base class — it works for any derived">
<AnnotatedCode lines={[
  {code:"// WITHOUT polymorphism: separate functions for each type",why:""},
  {code:"double value(const vector<EuropeanCall>& calls);",why:"One function for calls."},
  {code:"double value(const vector<EuropeanPut>& puts);",why:"Another for puts. NOT extensible — add a new type, write a new function."},
  {code:"",why:""},
  {code:"// WITH polymorphism: ONE function for ALL option types",why:""},
  {code:"double value(const vector<Option*>& options) {",why:"Takes base pointers. Works with ANY option type — call, put, barrier, binary..."},
  {code:"    double sum = 0;",why:""},
  {code:"    for (auto opt : options)",why:"Iterate through all options."},
  {code:"        sum += opt->price(S, r, v);",why:"POLYMORPHISM: each opt->price() calls the CORRECT derived implementation."},
  {code:"    return sum;",why:""},
  {code:"}",why:"Add a new option type → this function works without modification!"},
]}/>
</Step>

<Prof>"Note how we pass a reference to the base Option class and use it to get the actual payoff using the derived type of the object. We don't need separate functions for calls and puts."</Prof>

<Exam>Polymorphism = base class pointer/reference → calls correct derived function at runtime. This is the KEY concept for extensibility. When you add AmericanPut, BarrierCall, etc., the MC pricer and Tree pricer work without modification.</Exam>

<Quiz questions={[
  {q:"Polymorphism requires:",o:["Templates","Virtual functions + base class pointer or reference","Operator overloading","Friend functions"],a:1},
  {q:"If you add a new option type (AsianCall), do existing pricers need modification?",o:["Yes","No — polymorphism handles it automatically through base class interface"],a:1},
]}/>
</>)},

// ═══════ 5.6 MONTE CARLO PRICER ═══════
{title:"Monte Carlo Pricer",content:(<>
<Flowchart title="MC Pricing: Step by Step" steps={[
  {label:"1. Draw z",items:["z ~ N(0,1)","random number"],color:"#3498db"},
  {label:"2. Simulate S_T",items:["GBM formula","S·exp(...)"],color:"#f39c12"},
  {label:"3. Compute payoff",items:["max(S_T-K, 0)","polymorphism!"],color:"#2ecc71"},
  {label:"4. Average M paths",items:["Ĉ = e^(-rT) × mean","of all payoffs"],color:"#7c6cf0"},
]}/>

<H>Stock Price Simulation (GBM)</H>
<P>Under the risk-neutral measure, stock price at time T is:</P>
<P>S_T = S₀ · exp((r − σ²/2)·T + σ·√T·z), where z ~ N(0,1)</P>

<H>The MC Algorithm</H>
<AnnotatedCode title="MC pricing loop" lines={[
  {code:"double MCPricer::price(const Option& option,",why:"Takes a BASE CLASS reference — any option type works (polymorphism)."},
  {code:"    double S, double vol, double rate, unsigned long M) {",why:"M = number of simulation paths."},
  {code:"    double T = option.get_T();",why:"Get maturity from the option."},
  {code:"    double sum = 0.0;",why:"Accumulate payoffs."},
  {code:"    for (unsigned long i = 0; i < M; ++i) {",why:"Repeat M times."},
  {code:"        double z = ndist_(eng_);",why:"Draw one random number from N(0,1) using mt19937 engine + normal_distribution."},
  {code:"        double ST = S * exp((rate-0.5*vol*vol)*T + vol*sqrt(T)*z);",why:"GBM formula: simulate stock price at expiry."},
  {code:"        sum += option.get_expiration_payoff(ST);",why:"POLYMORPHISM! Calls the correct payoff: EuropeanCall returns max(ST-K,0), EuropeanPut returns max(K-ST,0)."},
  {code:"    }",why:""},
  {code:"    return exp(-rate * T) * sum / M;",why:"Discount the average payoff back to time 0."},
  {code:"}",why:""},
]}/>

<H>Random Number Generation</H>
<AnnotatedCode lines={[
  {code:"#include <random>",why:""},
  {code:"std::mt19937 eng_;",why:"Mersenne Twister engine — high-quality pseudo-random generator."},
  {code:"eng_.seed(771);",why:"Fixed seed → same sequence every run → reproducible results for debugging."},
  {code:"std::normal_distribution<double> ndist_(0.0, 1.0);",why:"Transforms uniform randoms from engine into N(0,1) standard normal."},
  {code:"double z = ndist_(eng_);",why:"Generate one N(0,1) sample."},
]}/>

<H>Standard Error and Confidence Interval</H>
<P>Standard error: ε = ω/√M (where ω = sample std dev of discounted payoffs)</P>
<P>95% confidence interval: [Ĉ − 1.96·ω/√M, Ĉ + 1.96·ω/√M]</P>
<P>To halve the error, you need 4× more paths.</P>

<Hw num={4} title="Monte Carlo Pricer (6%)" desc={`Complete MC option pricer.
• Use Box-Muller method for random number generation
• Price European Call and Put
• S₀=100, σ=0.3, r=0.01, T=2.0, K=100
• M = 10000, 100000, 1000000 paths
Due: Feb 25`} practice={`Add 95% confidence interval:
CI = [Ĉ ± 1.96 × ω/√M]
Print price, CI bounds, and CI width for each M.
Verify CI narrows as M increases.`}/>

<Quiz questions={[
  {q:"In the MC pricer, option.get_expiration_payoff(ST) uses:",o:["Template metaprogramming","Polymorphism — the correct derived payoff is called through base reference","Operator overloading","Static dispatch"],a:1},
  {q:"Using a fixed seed gives:",o:["Better random numbers","Reproducible results (same sequence every run)","Faster execution","True randomness"],a:1},
  {q:"To reduce MC error by half, you need:",o:["2× more paths","4× more paths","10× more paths","Same paths, different seed"],a:1,e:"ε = ω/√M. Halving ε requires quadrupling M."},
]}/>
</>)},

// ═══════ 5.7 MORE INHERITANCE ═══════
{title:"Virtual Destructor, Catch by Reference, First-Fit",content:(<>
<H>Virtual Destructor — ESSENTIAL</H>
<AnnotatedCode lines={[
  {code:"Base1* p = new Derived1();",why:"Base pointer to derived object."},
  {code:"delete p;",why:"If Base1's destructor is NOT virtual: only ~Base1() runs. ~Derived1() is SKIPPED → undefined behavior, resource leaks."},
  {code:"",why:""},
  {code:"// FIX: make base destructor virtual",why:""},
  {code:"virtual ~Base1() = default;",why:"Now delete p calls ~Derived1() THEN ~Base1(). Correct order."},
]}/>

<Exam>Virtual destructor is ESSENTIAL in any base class with virtual functions. The professor emphasizes this repeatedly. Always add: virtual ~ClassName() = default;</Exam>

<H>Why Catch Exceptions by Reference</H>
<P>Now that we know inheritance, the professor explains WHY we catch by const reference:</P>

<Step n={1} title="Exceptions form a class hierarchy (std::exception → std::runtime_error)">
If you catch by VALUE (not reference), the derived part is <B>sliced off</B> — virtual functions like what() may not work correctly.
</Step>

<AnnotatedCode title="Correct: catch by const reference" lines={[
  {code:"catch (const std::runtime_error& e) {",why:"Reference preserves the full derived object. what() works correctly. No copy. No slicing."},
  {code:"    cout << e.what() << endl;",why:""},
  {code:"}",why:""},
]}/>

<H>First-Fit Rule</H>
<Confusion mistake="Putting general catch before specific: catch(exception&) before catch(runtime_error&)" why="Exception handlers are checked IN ORDER. The first match wins. If std::exception& comes first, it catches EVERYTHING derived from exception — the runtime_error catch block is NEVER reached. Put specific exceptions BEFORE general ones."/>

<AnnotatedCode title="Correct order: specific before general" lines={[
  {code:"catch (const std::runtime_error& e) {",why:"SPECIFIC — checked first."},
  {code:"    // handle runtime errors",why:""},
  {code:"}",why:""},
  {code:"catch (const std::exception& e) {",why:"GENERAL — catches anything else derived from exception."},
  {code:"    // handle other exceptions",why:""},
  {code:"}",why:""},
]}/>

<H>Multiple Inheritance</H>
<P>C++ allows a class to inherit from more than one base class. The stream class hierarchy uses this: iostream inherits from both istream and ostream. Used in the FIX protocol trading example (Lecture 9).</P>
</>)},

// ═══════ 5.8 BINOMIAL TREE ═══════
{title:"Binomial Tree Pricer",content:(<>
<Flowchart title="4-Step Tree Algorithm" steps={[
  {label:"1. Create tree",items:["N+1 time steps","i+1 nodes at step i"],color:"#3498db"},
  {label:"2. Stock prices",items:["Left → right","GBM up/down"],color:"#f39c12"},
  {label:"3. Terminal payoffs",items:["At t=T","max(S-K,0) etc."],color:"#e74c3c"},
  {label:"4. Back-propagate",items:["Right → left","Discounted expected"],color:"#2ecc71"},
]}/>

<H>Jarrow-Rudd Model</H>
<P>At each step, stock goes up or down with equal probability (p_up = p_down = 0.5):</P>
<P>S_up = S · exp((r−σ²/2)Δt + σ√Δt)</P>
<P>S_down = S · exp((r−σ²/2)Δt − σ√Δt)</P>
<P>The tree <B>recombines</B>: up-then-down = down-then-up → same node. This keeps the tree manageable.</P>

<H>Data Structure — Professor's Exact Design</H>
<AnnotatedCode title="Node and Tree representation" lines={[
  {code:"struct Node {",why:"Each node stores TWO values."},
  {code:"    double S;",why:"Stock price at this node."},
  {code:"    double C;",why:"Option price at this node."},
  {code:"};",why:""},
  {code:"",why:""},
  {code:"using Tree = vector<vector<Node>>;",why:"2D structure: tree_[i] = all nodes at time step i. tree_[i][j] = node at step i, vertical position j."},
  {code:"Tree tree_;",why:"At step i, there are (i+1) nodes. Step 0: 1 node. Step N: N+1 nodes."},
]}/>

<MemDiagram title="Tree structure: tree_[i][j]" cells={[
  {label:"tree_[0][0]",value:"S₀",color:"#3498db"},
  {type:"arrow"},
  {label:"tree_[1][0..1]",value:"2 nodes",color:"#f39c12"},
  {type:"arrow"},
  {label:"tree_[2][0..2]",value:"3 nodes",color:"#2ecc71"},
  {type:"arrow"},
  {label:"tree_[N][0..N]",value:"N+1 nodes",color:"#7c6cf0"},
]}/>

<H>The 4-Step Algorithm</H>
<Step n={1} title="Create tree structure">
<Code code={`tree_.resize(N_ + 1);              // N+1 time steps
for (int i = 0; i <= N_; i++)
    tree_[i].resize(i + 1);        // i+1 nodes at step i`}/>
</Step>

<Step n={2} title="Populate stock prices (left → right)">
<Code code={`tree_[0][0].S = S0_;               // root: starting price
for (int i = 1; i <= N_; i++)
    for (int j = 0; j <= i; j++)
        tree_[i][j].S = S0_ * exp(nu_*i*dt_ + v_*sqrt_dt_*(2*j - i));`}/>
</Step>

<Step n={3} title="Terminal payoffs at t = T (rightmost nodes)">
<Code code={`for (int j = 0; j <= N_; j++)
    tree_[N_][j].C = option.get_expiration_payoff(tree_[N_][j].S);
// Polymorphism: correct payoff for any option type`}/>
</Step>

<Step n={4} title="Backward induction (right → left)">
<Code code={`for (int ir = N_ - 1; ir >= 0; --ir)
    for (int j = 0; j <= ir; ++j) {
        double discExp = disc_ * 0.5 *
            (tree_[ir+1][j+1].C + tree_[ir+1][j].C);
        double St = tree_[ir][j].S;
        tree_[ir][j].C = option.get_intermediate_payoff(St, discExp);
        // POLYMORPHISM decides European vs American vs Barrier!
    }
return tree_[0][0].C;  // Answer is at the root`}/>
</Step>

<H>European vs American — The Polymorphic Difference</H>
<AnnotatedCode title="get_intermediate_payoff implementations" lines={[
  {code:"// European: just use discounted expected payoff",why:""},
  {code:"double EuropeanCall::get_intermediate_payoff(",why:""},
  {code:"    double St, double discExp) const {",why:""},
  {code:"    return discExp;",why:"European: no early exercise. Intermediate value = discounted expected."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"// American: compare with early exercise, take the better one",why:""},
  {code:"double AmericanPut::get_intermediate_payoff(",why:""},
  {code:"    double St, double discExp) const {",why:""},
  {code:"    return max(discExp, max(K_ - St, 0.0));",why:"American: investor exercises early if intrinsic value > holding value."},
  {code:"}",why:""},
]}/>

<H>Barrier Options</H>
<P>Check if the barrier is hit at each node. If hit, option value is zero (or rebate). Otherwise, calculation is same as European/American counterpart.</P>
</>)},

// ═══════ 5.9 VECTOR INTERNALS ═══════
{title:"Vector Internals: capacity, size, reserve, resize",content:(<>
<P>The professor took a detour during the tree discussion to explain how vectors work internally — important for performance and interviews.</P>

<H>Two Key Attributes</H>
<Step n={1} title="size: number of elements currently stored">
<Code code={`vector<int> v;
cout << v.size();    // 0 — empty
v.push_back(10);
cout << v.size();    // 1 — one element`}/>
</Step>

<Step n={2} title="capacity: number of elements it has SPACE for">
<Code code={`vector<int> v;
cout << v.capacity(); // 0 — no space allocated
v.push_back(10);
cout << v.capacity(); // implementation-defined (often 1 or 2)`}/>
</Step>

<P>size ≤ capacity always. When push_back is called and size == capacity, the vector must grow: allocate new larger memory block, copy all elements, free old block. This is <B>expensive</B>.</P>

<H>reserve vs resize</H>
<AnnotatedCode lines={[
  {code:"vector<int> v;",why:""},
  {code:"v.reserve(10);",why:"RESERVE: allocates space for 10 elements but creates NONE. capacity=10, size=0. Cannot access v[0] yet."},
  {code:"",why:""},
  {code:"vector<int> w;",why:""},
  {code:"w.resize(10);",why:"RESIZE: creates 10 elements (default-constructed to 0). capacity=10, size=10. CAN access w[0]."},
]}/>

<Confusion mistake="Using reserve then immediately accessing elements by index" why="reserve only allocates space — it doesn't create elements. v.reserve(10); v[0] = 42; is undefined behavior because size is still 0. Use resize to create elements, or push_back to add them."/>

<P><B>push_back growth:</B> When capacity is exhausted, most implementations double the capacity. This means push_back is <B>amortized O(1)</B> — usually instant, but occasionally expensive when reallocation happens.</P>

<Quiz questions={[
  {q:"reserve(10) vs resize(10):",o:["They're the same","reserve allocates space only (size=0); resize creates 10 elements (size=10)","reserve creates elements; resize allocates space","Neither changes the vector"],a:1},
  {q:"Why is push_back sometimes expensive?",o:["It sorts the vector","When capacity is full, it must allocate new memory, copy all elements, and free old memory","It locks the vector","It's always cheap"],a:1},
]}/>
</>)},

// ═══════ 5.10 PRICING ENGINE & WRAP-UP ═══════
{title:"PricingEngine Hierarchy & Summary",content:(<>
<H>Extensible Pricing Design</H>
<P>The professor identified a limitation: pricing logic is inside the Option class. To add a new pricing technique (MC, Tree, PDE), we'd need to modify Option. That's not extensible.</P>
<P>Solution: extract pricing into its own hierarchy:</P>

<Hierarchy root="PricingEngine (abstract)" children={["BSPricer","MCPricer","JRTreePricer","PDESolver"]}/>

<AnnotatedCode title="PricingEngine abstract base" lines={[
  {code:"class PricingEngine {",why:"Abstract base for all pricers."},
  {code:"public:",why:""},
  {code:"    virtual double price(const Option& option) const = 0;",why:"Pure virtual: each engine implements its own pricing method. Takes any Option type via polymorphism."},
  {code:"    virtual ~PricingEngine() = default;",why:"Virtual destructor."},
  {code:"};",why:""},
  {code:"",why:""},
  {code:"class MCPricer : public PricingEngine {",why:"MC implementation."},
  {code:"    double price(const Option& opt) const override;",why:""},
  {code:"};",why:""},
  {code:"class JRTreePricer : public PricingEngine {",why:"Tree implementation."},
  {code:"    double price(const Option& opt) const override;",why:""},
  {code:"};",why:""},
]}/>

<P>Now you can swap pricers without changing option classes, and add new options without changing pricers. This is the power of two independent hierarchies connected through polymorphism.</P>

<Hw num={5} title="Extensible Pricer OR Regression (7%)" desc={`Choose one track:
Track A — Extensible Pricer: PricingEngine hierarchy. Support MC + Tree.
  Tree: K=100, S₀=100, r=0.05, σ=0.3, T=1yr, N=1000 steps
  MC: S₀=100, σ=0.3, r=0.01, T=2, K=100, M=10000
Track B — Linear Regression with Eigen library.
Due: March 7`} practice={`Track A: Add trinomial tree (up/flat/down with p=1/6, 2/3, 1/6).
Compare European call prices from MC, binomial, and trinomial.`}/>

<Checklist items={[
  "I can write base classes with public/protected/private",
  "I understand inheritance: derived IS-A base, inherits all members",
  "Derived constructors call base constructor in initializer list",
  "I know virtual (may override) vs pure virtual (= 0, must override) vs non-virtual (don't override)",
  "I use override keyword on all overriding functions",
  "I always add virtual destructor to base classes",
  "I can explain abstract class: has ≥1 pure virtual, cannot instantiate",
  "I know all BS formulas: price (call/put), d1, d2, N(x) via erf, delta, gamma, N'(x)",
  "I can use <cmath>: sqrt, exp, log, erf",
  "I understand polymorphism: base pointer/reference → correct derived function at runtime",
  "I can write MC pricer: GBM simulation, mt19937 + normal_distribution, payoff via polymorphism",
  "I know standard error ε = ω/√M and 95% CI formula",
  "I understand exception hierarchy, catch by const ref (avoid slicing), first-fit rule",
  "I can implement binomial tree: Node struct, vector<vector<Node>>, 4-step algorithm",
  "I know European vs American intermediate payoff difference",
  "I understand vector capacity vs size, reserve vs resize, push_back growth",
  "I can design PricingEngine hierarchy with independent option and pricer hierarchies",
]}/>
</>)}
]};

export default module5;
