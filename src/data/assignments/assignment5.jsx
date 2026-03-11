import { C, P, H, B, M, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, FullCode } from "../../components";

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

<FullCode files={[
{name:"Option.h",code:`#ifndef OPTION_H
#define OPTION_H

class Option {
public:
    Option(double K, double T);
    virtual ~Option() = default;

    virtual double price(double S0, double r, double v) = 0;
    virtual double delta(double S0, double r, double v) = 0;
    virtual double gamma(double S0, double r, double v) = 0;

    virtual double get_expiration_payoff(double ST) const = 0;

    virtual bool is_american() const = 0;

    double get_T() const;
    double get_K() const;

protected:
    double d1(double S0, double r, double v);
    double d2(double S0, double r, double v);
    double normalCDF(double x);
    double normalPDF(double x);

    double K_;
    double T_;
};

#endif`},
{name:"Option.cpp",code:`#include "Option.h"
#include <cmath>
#include <numbers>

Option::Option(double K, double T)
    : K_(K), T_(T)
{}

double Option::get_T() const {
    return T_;
}

double Option::get_K() const {
    return K_;
}

double Option::d1(double S0, double r, double v) {
    return (std::log(S0 * std::exp(r * T_) / K_)) / (v * std::sqrt(T_))
           + (v * std::sqrt(T_)) / 2.0;
}

double Option::d2(double S0, double r, double v) {
    return (std::log(S0 * std::exp(r * T_) / K_)) / (v * std::sqrt(T_))
           - (v * std::sqrt(T_)) / 2.0;
}

double Option::normalCDF(double x) {
    return 0.5 * (1.0 + std::erf(x / std::sqrt(2.0)));
}

double Option::normalPDF(double x) {
    return (1.0 / std::sqrt(2.0 * std::numbers::pi)) * std::exp(-x * x / 2.0);
}`},
{name:"EuropeanCall.h",code:`#ifndef EUROPEANCALL_H
#define EUROPEANCALL_H

#include "Option.h"

class EuropeanCall : public Option {
public:
    EuropeanCall(double K, double T);
    double price(double S0, double r, double v) override;
    double delta(double S0, double r, double v) override;
    double gamma(double S0, double r, double v) override;
    double get_expiration_payoff(double ST) const override;
    bool is_american() const override { return false; }
};

#endif`},
{name:"EuropeanCall.cpp",code:`#include "EuropeanCall.h"
#include <cmath>
#include <algorithm>

EuropeanCall::EuropeanCall(double K, double T)
    : Option(K, T)
{}

double EuropeanCall::price(double S0, double r, double v) {
    double D1 = d1(S0, r, v);
    double D2 = d2(S0, r, v);
    return S0 * normalCDF(D1) - K_ * std::exp(-r * T_) * normalCDF(D2);
}

double EuropeanCall::delta(double S0, double r, double v) {
    return normalCDF(d1(S0, r, v));
}

double EuropeanCall::gamma(double S0, double r, double v) {
    double D1 = d1(S0, r, v);
    return normalPDF(D1) / (S0 * v * std::sqrt(T_));
}

double EuropeanCall::get_expiration_payoff(double ST) const {
    return std::max(ST - K_, 0.0);
}`},
{name:"EuropeanPut.h",code:`#ifndef EUROPEANPUT_H
#define EUROPEANPUT_H

#include "Option.h"

class EuropeanPut : public Option {
public:
    EuropeanPut(double K, double T);
    double price(double S0, double r, double v) override;
    double delta(double S0, double r, double v) override;
    double gamma(double S0, double r, double v) override;
    double get_expiration_payoff(double ST) const override;
    bool is_american() const override { return false; }
};

#endif`},
{name:"EuropeanPut.cpp",code:`#include "EuropeanPut.h"
#include <cmath>
#include <algorithm>

EuropeanPut::EuropeanPut(double K, double T)
    : Option(K, T)
{}

double EuropeanPut::price(double S0, double r, double v) {
    double D1 = d1(S0, r, v);
    double D2 = d2(S0, r, v);
    return K_ * std::exp(-r * T_) * normalCDF(-D2) - S0 * normalCDF(-D1);
}

double EuropeanPut::delta(double S0, double r, double v) {
    return normalCDF(d1(S0, r, v)) - 1.0;
}

double EuropeanPut::gamma(double S0, double r, double v) {
    double D1 = d1(S0, r, v);
    return normalPDF(D1) / (S0 * v * std::sqrt(T_));
}

double EuropeanPut::get_expiration_payoff(double ST) const {
    return std::max(K_ - ST, 0.0);
}`},
{name:"AmericanCall.h",code:`#ifndef AMERICANCALL_H
#define AMERICANCALL_H

#include "Option.h"

class AmericanCall : public Option {
public:
    AmericanCall(double K, double T);

    double price(double S0, double r, double v) override;
    double delta(double S0, double r, double v) override;
    double gamma(double S0, double r, double v) override;

    double get_expiration_payoff(double ST) const override;
    bool is_american() const override { return true; }
};

#endif`},
{name:"AmericanCall.cpp",code:`#include "AmericanCall.h"
#include <cmath>
#include <algorithm>
#include <stdexcept>

AmericanCall::AmericanCall(double K, double T)
    : Option(K, T)
{}

double AmericanCall::price(double /*S0*/, double /*r*/, double /*v*/) {
    throw std::runtime_error(
        "AmericanCall has no closed-form price. Use a numerical pricer (e.g., TreePricer).");
}

double AmericanCall::delta(double /*S0*/, double /*r*/, double /*v*/) {
    throw std::runtime_error(
        "AmericanCall has no closed-form delta. Use a numerical pricer.");
}

double AmericanCall::gamma(double /*S0*/, double /*r*/, double /*v*/) {
    throw std::runtime_error(
        "AmericanCall has no closed-form gamma. Use a numerical pricer.");
}

double AmericanCall::get_expiration_payoff(double ST) const {
    return std::max(ST - K_, 0.0);
}`},
{name:"AmericanPut.h",code:`#ifndef AMERICANPUT_H
#define AMERICANPUT_H

#include "Option.h"

class AmericanPut : public Option {
public:
    AmericanPut(double K, double T);

    double price(double S0, double r, double v) override;
    double delta(double S0, double r, double v) override;
    double gamma(double S0, double r, double v) override;

    double get_expiration_payoff(double ST) const override;
    bool is_american() const override { return true; }
};

#endif`},
{name:"AmericanPut.cpp",code:`#include "AmericanPut.h"
#include <cmath>
#include <algorithm>
#include <stdexcept>

AmericanPut::AmericanPut(double K, double T)
    : Option(K, T)
{}

double AmericanPut::price(double /*S0*/, double /*r*/, double /*v*/) {
    throw std::runtime_error(
        "AmericanPut has no closed-form price. Use a numerical pricer (e.g., TreePricer).");
}

double AmericanPut::delta(double /*S0*/, double /*r*/, double /*v*/) {
    throw std::runtime_error(
        "AmericanPut has no closed-form delta. Use a numerical pricer.");
}

double AmericanPut::gamma(double /*S0*/, double /*r*/, double /*v*/) {
    throw std::runtime_error(
        "AmericanPut has no closed-form gamma. Use a numerical pricer.");
}

double AmericanPut::get_expiration_payoff(double ST) const {
    return std::max(K_ - ST, 0.0);
}`},
{name:"Pricer.h",code:`#ifndef PRICER_H
#define PRICER_H

#include "Option.h"

class Pricer {
public:
    virtual ~Pricer() = default;

    virtual double price(const Option& option,
                         double S0, double vol, double rate) = 0;
};

#endif`},
{name:"MCPricer.h",code:`#ifndef MCPRICER_H
#define MCPRICER_H

#include "Pricer.h"
#include <random>

class MCPricer : public Pricer {
public:
    explicit MCPricer(unsigned long paths = 10000);

    double price(const Option& option,
                 double S0, double vol, double rate) override;

private:
    double boxMuller();

    unsigned long paths_;
    std::mt19937 eng_;
    std::uniform_real_distribution<double> udist_;
};

#endif`},
{name:"MCPricer.cpp",code:`#include "MCPricer.h"
#include <cmath>
#include <numbers>
#include <stdexcept>

MCPricer::MCPricer(unsigned long paths)
    : paths_(paths),
      eng_(std::random_device{}()),
      udist_(0.0, 1.0)
{}

double MCPricer::boxMuller() {
    double u1 = udist_(eng_);
    double u2 = udist_(eng_);
    return std::sqrt(-2.0 * std::log(u1)) * std::cos(2.0 * std::numbers::pi * u2);
}

double MCPricer::price(const Option& option,
                       double S0, double vol, double rate) {
    if (option.is_american()) {
        throw std::runtime_error(
            "MCPricer does not support American options. Use TreePricer instead.");
    }

    double T = option.get_T();
    double drift = (rate - vol * vol / 2.0) * T;
    double diffusion = vol * std::sqrt(T);
    double discount = std::exp(-rate * T);

    double sumPayoffs = 0.0;
    for (unsigned long i = 0; i < paths_; ++i) {
        double z = boxMuller();
        double ST = S0 * std::exp(drift + diffusion * z);
        double payoff = option.get_expiration_payoff(ST);
        sumPayoffs += payoff;
    }

    return discount * (sumPayoffs / static_cast<double>(paths_));
}`},
{name:"TreePricer.h",code:`#ifndef TREEPRICER_H
#define TREEPRICER_H

#include "Pricer.h"

class TreePricer : public Pricer {
public:
    explicit TreePricer(int numSteps = 1000);

    double price(const Option& option,
                 double S0, double vol, double rate) override;

private:
    int numSteps_;
};

#endif`},
{name:"TreePricer.cpp",code:`#include "TreePricer.h"
#include <cmath>
#include <vector>
#include <algorithm>

TreePricer::TreePricer(int numSteps)
    : numSteps_(numSteps)
{}

double TreePricer::price(const Option& option,
                         double S0, double vol, double rate) {
    double T  = option.get_T();
    double dt = T / numSteps_;

    double nu = rate - 0.5 * vol * vol;
    double u  = std::exp(nu * dt + vol * std::sqrt(dt));
    double d  = std::exp(nu * dt - vol * std::sqrt(dt));
    double p  = 0.5;
    double disc = std::exp(-rate * dt);

    bool american = option.is_american();

    int N = numSteps_;
    std::vector<double> optionValues(N + 1);

    for (int j = 0; j <= N; ++j) {
        double ST = S0 * std::pow(u, j) * std::pow(d, N - j);
        optionValues[j] = option.get_expiration_payoff(ST);
    }

    for (int i = N - 1; i >= 0; --i) {
        for (int j = 0; j <= i; ++j) {
            double cont = disc * (p * optionValues[j + 1] + (1.0 - p) * optionValues[j]);

            if (american) {
                double S_ij = S0 * std::pow(u, j) * std::pow(d, i - j);
                double exercise = option.get_expiration_payoff(S_ij);
                optionValues[j] = std::max(cont, exercise);
            } else {
                optionValues[j] = cont;
            }
        }
    }

    return optionValues[0];
}`},
{name:"main.cpp",code:`#include <iostream>
#include <iomanip>
#include <memory>
#include <vector>
#include <string>

#include "EuropeanCall.h"
#include "EuropeanPut.h"
#include "AmericanCall.h"
#include "AmericanPut.h"
#include "MCPricer.h"
#include "TreePricer.h"

int main() {
    std::cout << std::fixed << std::setprecision(6);

    // Part 1: Jarrow-Rudd Binomial Tree Pricing
    {
        double S0    = 100.0;
        double K     = 100.0;
        double r     = 0.05;
        double sigma = 0.3;
        double T     = 1.0;
        int    N     = 1000;

        std::cout << "============================================================\\n";
        std::cout << "Jarrow-Rudd Binomial Tree Pricing\\n";
        std::cout << "Parameters: S0=" << S0 << ", K=" << K
                  << ", r=" << r << ", sigma=" << sigma
                  << ", T=" << T << ", N=" << N << "\\n";
        std::cout << "============================================================\\n";

        TreePricer treePricer(N);

        EuropeanCall euroCall(K, T);
        EuropeanPut  euroPut(K, T);

        double treeEuroCallPrice = treePricer.price(euroCall, S0, sigma, r);
        double treeEuroPutPrice  = treePricer.price(euroPut,  S0, sigma, r);

        double bsCallPrice = euroCall.price(S0, r, sigma);
        double bsPutPrice  = euroPut.price(S0, r, sigma);

        std::cout << "\\nEuropean Call:\\n";
        std::cout << "  Tree Price : " << treeEuroCallPrice << "\\n";
        std::cout << "  BS Price   : " << bsCallPrice << "\\n";

        std::cout << "\\nEuropean Put:\\n";
        std::cout << "  Tree Price : " << treeEuroPutPrice << "\\n";
        std::cout << "  BS Price   : " << bsPutPrice << "\\n";

        AmericanCall amerCall(K, T);
        AmericanPut  amerPut(K, T);

        double treeAmerCallPrice = treePricer.price(amerCall, S0, sigma, r);
        double treeAmerPutPrice  = treePricer.price(amerPut,  S0, sigma, r);

        std::cout << "\\nAmerican Call:\\n";
        std::cout << "  Tree Price : " << treeAmerCallPrice << "\\n";

        std::cout << "\\nAmerican Put:\\n";
        std::cout << "  Tree Price : " << treeAmerPutPrice << "\\n";
    }

    std::cout << "\\n";

    // Part 2: Monte Carlo Pricing (European Options)
    {
        double S0    = 100.0;
        double K     = 100.0;
        double r     = 0.01;
        double sigma = 0.3;
        double T     = 2.0;
        unsigned long M = 10000;

        std::cout << "============================================================\\n";
        std::cout << "Monte Carlo Pricing\\n";
        std::cout << "Parameters: S0=" << S0 << ", K=" << K
                  << ", r=" << r << ", sigma=" << sigma
                  << ", T=" << T << ", M=" << M << "\\n";
        std::cout << "============================================================\\n";

        EuropeanCall euroCall(K, T);
        EuropeanPut  euroPut(K, T);

        double bsCallPrice = euroCall.price(S0, r, sigma);
        double bsPutPrice  = euroPut.price(S0, r, sigma);

        MCPricer mcPricer(M);

        double mcCallPrice = mcPricer.price(euroCall, S0, sigma, r);
        double mcPutPrice  = mcPricer.price(euroPut,  S0, sigma, r);

        std::cout << "\\nEuropean Call:\\n";
        std::cout << "  MC Price   : " << mcCallPrice << "\\n";
        std::cout << "  BS Price   : " << bsCallPrice << "\\n";

        std::cout << "\\nEuropean Put:\\n";
        std::cout << "  MC Price   : " << mcPutPrice << "\\n";
        std::cout << "  BS Price   : " << bsPutPrice << "\\n";
    }

    std::cout << "\\n";

    // Part 3: Extensibility Demonstration
    {
        double S0    = 100.0;
        double K     = 100.0;
        double r     = 0.05;
        double sigma = 0.3;
        double T     = 1.0;

        std::cout << "============================================================\\n";
        std::cout << "Extensibility: Pricing via Pricer base class\\n";
        std::cout << "============================================================\\n";

        EuropeanCall euroCall(K, T);

        std::vector<std::pair<std::string, std::unique_ptr<Pricer>>> pricers;
        pricers.emplace_back("Monte Carlo (M=100000)", std::make_unique<MCPricer>(100000));
        pricers.emplace_back("Jarrow-Rudd Tree (N=1000)", std::make_unique<TreePricer>(1000));

        double bsPrice = euroCall.price(S0, r, sigma);
        std::cout << "\\n  BS Analytical Price : " << bsPrice << "\\n\\n";

        for (auto& [name, pricer] : pricers) {
            double p = pricer->price(euroCall, S0, sigma, r);
            std::cout << "  " << name << " : " << p << "\\n";
        }
    }

    std::cout << "\\n";

    return 0;
}`}
]}/>
</>)};

export default assignment5;
