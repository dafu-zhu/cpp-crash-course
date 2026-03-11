import { C, P, H, B, M, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, Checklist } from "../../components";

const assignment5 = {title:"Assignment 5: Extensible Multi-Method Pricer",content:(<>
<Hw num={5} title="Extensible Pricing Engine" desc={`Create a pricing system with two independent hierarchies:
1. Option hierarchy: Option → EuropeanCall, EuropeanPut
2. PricingEngine hierarchy: PricingEngine → BSPricer, MCPricer, TreePricer

This design allows adding new options WITHOUT modifying pricers,
and adding new pricers WITHOUT modifying options.

Requirements:
• Abstract PricingEngine base class with virtual price()
• BSPricer: analytical Black-Scholes
• MCPricer: Monte Carlo simulation
• TreePricer: Binomial tree (Jarrow-Rudd)
• Use smart pointers (unique_ptr) for ownership

Test Tree: K=100, S₀=100, r=0.05, σ=0.3, T=1yr, N=1000 steps
Test MC: S₀=100, σ=0.3, r=0.01, T=2, K=100, M=10000 paths`}/>

<Flowchart title="Strategy: Two Independent Hierarchies" steps={[
  {label:"Option Hierarchy",items:["Option (abstract)","EuropeanCall","EuropeanPut"],color:C.b},
  {label:"Engine Hierarchy",items:["PricingEngine (abstract)","BSPricer","MCPricer","TreePricer"],color:C.g},
  {label:"Connection",items:["Engine.price(Option&)","Polymorphism on BOTH sides!"],color:C.o},
  {label:"Result",items:["Add new options freely","Add new pricers freely"],color:C.accent}
]}/>

<H>Part 1: The PricingEngine Abstract Base</H>
<P>Extract pricing logic into its own hierarchy. Each engine implements a different pricing method.</P>

<Hierarchy root="PricingEngine (abstract)" children={["BSPricer","MCPricer","JRTreePricer"]} grandchildren={[["BS formulas"],["MC simulation"],["Binomial tree"]]}/>

<Step n={1} title="Define the abstract PricingEngine">
<P>Pure virtual price() function that takes any Option by reference.</P>
</Step>

<AnnotatedCode title="pricing_engine.h — abstract base" lines={[
  {code:"#ifndef PRICING_ENGINE_H",why:""},
  {code:"#define PRICING_ENGINE_H",why:""},
  {code:'#include "option.h"',why:"Need Option class for price() parameter."},
  {code:"",why:""},
  {code:"class PricingEngine {",why:"Abstract base for all pricing methods."},
  {code:"public:",why:""},
  {code:"    virtual ~PricingEngine() = default;",why:"Virtual destructor for safe polymorphic deletion."},
  {code:"",why:""},
  {code:"    virtual double price(const Option& option,",why:"Pure virtual: each engine implements its own method."},
  {code:"                        double S, double r, double v) const = 0;",why:"Takes any Option type via polymorphism."},
  {code:"",why:""},
  {code:"    virtual std::string name() const = 0;",why:"Returns engine name for logging/debugging."},
  {code:"};",why:""},
  {code:"",why:""},
  {code:"#endif",why:""}
]}/>

<H>Part 2: BSPricer Implementation</H>
<Step n={2} title="Implement analytical Black-Scholes">
<P>BSPricer delegates to the Option's own price() function (which uses BS formulas).</P>
</Step>

<AnnotatedCode title="bs_pricer.h and bs_pricer.cpp" lines={[
  {code:'#include "pricing_engine.h"',why:""},
  {code:"",why:""},
  {code:"class BSPricer : public PricingEngine {",why:"Concrete pricer."},
  {code:"public:",why:""},
  {code:"    double price(const Option& option,",why:""},
  {code:"                 double S, double r, double v) const override {",why:""},
  {code:"        return option.price(S, r, v);",why:"DELEGATES to Option's price(). Call/Put formula determined by polymorphism."},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:'    std::string name() const override { return "Black-Scholes"; }',why:"Identify this engine."},
  {code:"};",why:""}
]}/>

<Confusion mistake="Duplicating BS formulas inside BSPricer" why="The formulas already exist in EuropeanCall and EuropeanPut. BSPricer should delegate to option.price(), not reimplement. This is the Strategy pattern: behavior is selected via the object passed in."/>

<H>Part 3: TreePricer Implementation</H>
<P>The binomial tree pricer builds a price tree and back-propagates option values.</P>

<Step n={3} title="Jarrow-Rudd binomial tree">
<P><M>{"S_{\\text{up}} = S \\cdot e^{(r-\\sigma^2/2)\\Delta t + \\sigma\\sqrt{\\Delta t}}"}</M>, <M>{"S_{\\text{down}} = S \\cdot e^{(r-\\sigma^2/2)\\Delta t - \\sigma\\sqrt{\\Delta t}}"}</M></P>
</Step>

<AnnotatedCode title="jr_tree_pricer.cpp — key algorithm" lines={[
  {code:"double JRTreePricer::price(const Option& option,",why:""},
  {code:"    double S, double r, double v) const {",why:""},
  {code:"",why:""},
  {code:"    double T = option.get_T();",why:""},
  {code:"    double dt = T / N_;",why:"Time step."},
  {code:"    double nu = r - 0.5 * v * v;",why:"Drift term."},
  {code:"    double sqrt_dt = std::sqrt(dt);",why:"√Δt"},
  {code:"    double discount = std::exp(-r * dt);",why:"One-step discount factor."},
  {code:"",why:""},
  {code:"    // Build tree structure",why:""},
  {code:"    using Tree = std::vector<std::vector<double>>;",why:"tree[i][j] = option value at step i, node j."},
  {code:"    Tree tree(N_ + 1);",why:"N+1 time steps."},
  {code:"    for (int i = 0; i <= N_; ++i)",why:""},
  {code:"        tree[i].resize(i + 1);",why:"Step i has i+1 nodes."},
  {code:"",why:""},
  {code:"    // Terminal payoffs (step 4 first, then back-propagate)",why:""},
  {code:"    for (int j = 0; j <= N_; ++j) {",why:"At maturity (step N)."},
  {code:"        double ST = S * std::exp(nu * T + v * sqrt_dt * (2*j - N_));",why:"Stock price at this node."},
  {code:"        tree[N_][j] = option.get_payoff(ST);",why:"POLYMORPHISM: correct payoff for Call/Put."},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:"    // Backward induction",why:""},
  {code:"    for (int i = N_ - 1; i >= 0; --i) {",why:"From T back to 0."},
  {code:"        for (int j = 0; j <= i; ++j) {",why:"Each node at step i."},
  {code:"            double expected = 0.5 * (tree[i+1][j+1] + tree[i+1][j]);",why:"Equal prob up/down."},
  {code:"            tree[i][j] = discount * expected;",why:"Discounted expected value."},
  {code:"        }",why:""},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:"    return tree[0][0];",why:"Price at root."},
  {code:"}",why:""}
]}/>

<MemDiagram title="Binomial Tree Structure" cells={[
  {addr:"tree[0][0]",label:"Step 0",value:"S₀ → Price",color:C.b},
  {type:"arrow"},
  {addr:"tree[1][0..1]",label:"Step 1",value:"2 nodes",color:C.o},
  {type:"arrow"},
  {addr:"tree[N][0..N]",label:"Step N",value:"N+1 payoffs",color:C.g}
]}/>

<H>Part 4: Using Smart Pointers</H>
<Step n={4} title="unique_ptr for ownership">
<P>std::unique_ptr manages ownership of dynamically allocated objects. When unique_ptr goes out of scope, the object is automatically deleted.</P>
</Step>

<Conversion from="Raw pointers (manual delete)" to="unique_ptr (automatic cleanup)" feature="std::unique_ptr (RAII for dynamic memory)"
  beforeCode={`PricingEngine* engine = new MCPricer();
double p = engine->price(option, ...);
delete engine; // MUST remember!
// If exception thrown, leak!`}
  afterCode={`auto engine = std::make_unique<MCPricer>();
double p = engine->price(option, ...);
// auto deleted when engine goes out of scope
// Exception-safe!`}/>

<AnnotatedCode title="main.cpp — using the pricing system" lines={[
  {code:"#include <memory>",why:"For unique_ptr."},
  {code:'#include "bs_pricer.h"',why:""},
  {code:'#include "mc_pricer.h"',why:""},
  {code:'#include "jr_tree_pricer.h"',why:""},
  {code:'#include "european_call.h"',why:""},
  {code:'#include "european_put.h"',why:""},
  {code:"#include <iostream>",why:""},
  {code:"#include <vector>",why:""},
  {code:"",why:""},
  {code:"int main() {",why:""},
  {code:"    // Create options",why:""},
  {code:"    EuropeanCall call(100.0, 1.0);",why:""},
  {code:"    EuropeanPut put(100.0, 1.0);",why:""},
  {code:"",why:""},
  {code:"    // Create pricers using unique_ptr",why:""},
  {code:"    std::vector<std::unique_ptr<PricingEngine>> engines;",why:"Vector of base pointers (smart)."},
  {code:"    engines.push_back(std::make_unique<BSPricer>());",why:"Add BS pricer."},
  {code:"    engines.push_back(std::make_unique<MCPricer>(771, 100000));",why:"MC with seed and paths."},
  {code:"    engines.push_back(std::make_unique<JRTreePricer>(1000));",why:"Tree with 1000 steps."},
  {code:"",why:""},
  {code:"    double S = 100.0, r = 0.05, v = 0.3;",why:""},
  {code:"",why:""},
  {code:"    // Price with each engine",why:""},
  {code:'    std::cout << "=== Call Option ===" << std::endl;',why:""},
  {code:"    for (const auto& engine : engines) {",why:"Iterate through unique_ptrs."},
  {code:"        std::cout << engine->name() << \": \"",why:""},
  {code:"                  << engine->price(call, S, r, v) << std::endl;",why:"Polymorphism: correct price() called."},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:'    std::cout << "\\n=== Put Option ===" << std::endl;',why:""},
  {code:"    for (const auto& engine : engines) {",why:""},
  {code:"        std::cout << engine->name() << \": \"",why:""},
  {code:"                  << engine->price(put, S, r, v) << std::endl;",why:"Same engines work for Put!"},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:"    return 0;",why:"All engines auto-deleted when vector destroyed."},
  {code:"}",why:""}
]}/>

<Confusion mistake="Trying to copy unique_ptr: engines.push_back(engine)" why="unique_ptr cannot be copied — it has unique ownership. Use std::move to transfer ownership: engines.push_back(std::move(engine)). Or use make_unique directly in push_back as shown above."/>

<H>Design Summary: Strategy Pattern</H>
<P>This is the Strategy Pattern: the algorithm (pricing method) is encapsulated in separate classes. You can swap strategies (BS, MC, Tree) without changing the client code or the option classes.</P>

<MemDiagram title="Dual Polymorphism" cells={[
  {addr:"PricingEngine*",label:"engine",value:"MCPricer",color:C.accent},
  {type:"arrow",label:"price(opt,...)"},
  {addr:"const Option&",label:"opt",value:"EuropeanCall",color:C.g},
  {type:"arrow",label:"get_payoff()"},
  {addr:"Result",label:"",value:"double price",color:C.b}
]}/>

<Tip title="Extensibility Achieved">
<B>Adding new option type</B> (e.g., AmericanPut):{"\n"}
• Implement get_payoff() and price() in the new class{"\n"}
• All existing pricers work without modification!{"\n\n"}
<B>Adding new pricing method</B> (e.g., PDEPricer):{"\n"}
• Derive from PricingEngine, implement price(){"\n"}
• Works with all existing option types!{"\n\n"}
This is the Open/Closed Principle: open for extension, closed for modification.
</Tip>

<Quiz questions={[
  {q:"Why use two separate hierarchies (Option and PricingEngine)?",o:["It's required by C++","Adding new options doesn't require changing pricers, and vice versa","It's faster","No reason"],a:1},
  {q:"std::unique_ptr provides:",o:["Shared ownership","Unique ownership with automatic deletion","No ownership","Manual delete required"],a:1},
  {q:"BSPricer delegates to option.price() because:",o:["It's faster","The BS formula already exists in EuropeanCall/Put — no duplication needed","BSPricer doesn't know math","It's required"],a:1},
  {q:"Consider:\n```cpp\nauto eng1 = std::make_unique<MCPricer>();\nauto eng2 = eng1;  // Line A\n```\nWhat happens at Line A?",o:["eng2 points to the same pricer","Compile error — unique_ptr cannot be copied","Runtime error","eng1 becomes null"],a:1,e:"unique_ptr has unique ownership — copying would create two owners. Use std::move(eng1) to transfer ownership."},
  {q:"In the tree pricer, option.get_payoff(ST) is called. This uses:",o:["Templates","Polymorphism — correct payoff (Call or Put) selected at runtime","Operator overloading","Static binding"],a:1},
  {q:"If you add a new BarrierOption class with proper get_payoff(), which statement is true?",o:["MCPricer must be modified","TreePricer must be modified","BSPricer must be modified","All existing pricers work automatically via polymorphism"],a:3,e:"This is the power of the Strategy pattern with polymorphism. New options work with existing pricers automatically."}
]}/>

<Checklist items={[
  "Created abstract PricingEngine base class",
  "Added virtual destructor: virtual ~PricingEngine() = default",
  "Defined pure virtual price(const Option&, S, r, v) const",
  "Implemented BSPricer delegating to option.price()",
  "Implemented MCPricer with random number generation",
  "Implemented JRTreePricer with binomial tree algorithm",
  "Used std::make_unique to create pricing engines",
  "Stored engines in vector<unique_ptr<PricingEngine>>",
  "Used range-based for with const auto& for iteration",
  "Tested all pricers with EuropeanCall and EuropeanPut",
  "Verified prices converge: Tree(N→∞) → BS, MC(M→∞) → BS",
  "Understood Open/Closed Principle: add new types without modifying existing code"
]}/>
</>)};

export default assignment5;
