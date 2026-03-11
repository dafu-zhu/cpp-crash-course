import { C, P, H, B, M, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, FullCode } from "../../components";

const assignment3 = {title:"Assignment 3: Option Pricing with Inheritance",content:(<>
<Hw num={3} title="Black-Scholes Pricer" desc={`Use inheritance to write an OO Black-Scholes Pricer.

Required classes:
• Option (abstract base class with pure virtual price())
• EuropeanCall (derived, implements call pricing formula)
• EuropeanPut (derived, implements put pricing formula)

Required functions:
• price(S, r, v) — compute option price
• delta(S, r, v) — first Greek
• gamma(S, r, v) — second Greek

Test cases:
• Call: S₀=100, K=100, T=1, σ=0.3, r=0.05
• Put: S₀=120, K=120, T=2, σ=0.4, r=0.1`}/>

<Flowchart title="Strategy: Inheritance Hierarchy Design" steps={[
  {label:"1. Identify Common",items:["K, T (strike, maturity)","d1(), d2() formulas","virtual destructor"],color:C.r},
  {label:"2. Base Class",items:["Option (abstract)","pure virtual price()","protected: K_, T_"],color:C.b},
  {label:"3. Derived Classes",items:["EuropeanCall","EuropeanPut","Different price formulas"],color:C.g},
  {label:"4. Test",items:["Create both types","Price through base ptr","Verify with known values"],color:C.o}
]}/>

<H>Part 1: The Option Base Class (Abstract)</H>
<P>Option is the base class. It contains common data (K_, T_) and helper functions (d1, d2). The price() function is pure virtual because each option type has a different formula.</P>

<Hierarchy root="Option (abstract)" children={["EuropeanCall","EuropeanPut"]} grandchildren={[["+ price()","+ delta()","+ gamma()"],["+ price()","+ delta()","+ gamma()"]]}/>

<Step n={1} title="Define the abstract base class">
<P>A class with at least one pure virtual function (= 0) is abstract — you cannot create objects of it directly.</P>
</Step>

<AnnotatedCode title="option.h — abstract base class" lines={[
  {code:"#ifndef OPTION_H",why:"Include guard."},
  {code:"#define OPTION_H",why:""},
  {code:"",why:""},
  {code:"#include <cmath>",why:"For sqrt, exp, log, erf."},
  {code:"",why:""},
  {code:"class Option {",why:"Abstract base class for all option types."},
  {code:"public:",why:""},
  {code:"    Option(double K, double T);",why:"Constructor: K=strike, T=maturity."},
  {code:"    virtual ~Option() = default;",why:"VIRTUAL DESTRUCTOR: essential for any base class with virtual functions!"},
  {code:"",why:""},
  {code:"    // Pure virtual: MUST be implemented by derived classes",why:""},
  {code:"    virtual double price(double S, double r, double v) const = 0;",why:"= 0 makes it pure virtual. No default implementation exists."},
  {code:"",why:""},
  {code:"    // Getters",why:""},
  {code:"    double get_K() const { return K_; }",why:"Inline getter."},
  {code:"    double get_T() const { return T_; }",why:""},
  {code:"",why:""},
  {code:"protected:",why:"Accessible by derived classes but NOT outside code."},
  {code:"    double d1(double S, double r, double v) const;",why:"Helper: d1 formula. Non-virtual — same for all option types."},
  {code:"    double d2(double S, double r, double v) const;",why:"Helper: d2 = d1 - v*sqrt(T)."},
  {code:"    double N(double x) const;",why:"Standard normal CDF: N(x) = 0.5 * (1 + erf(x/sqrt(2)))."},
  {code:"    double Nprime(double x) const;",why:"Standard normal PDF: N'(x) = exp(-x²/2) / sqrt(2π)."},
  {code:"",why:""},
  {code:"    double K_;",why:"Strike price. Protected so derived classes can access."},
  {code:"    double T_;",why:"Time to maturity in years."},
  {code:"};",why:""},
  {code:"",why:""},
  {code:"#endif",why:""}
]}/>

<Confusion mistake="Making K_ and T_ private in the base class" why="Private members are invisible to derived classes. EuropeanCall needs to use K_ in its price formula. Make them protected so derived classes can access directly."/>

<Step n={2} title="Implement helper functions in option.cpp">
<P>The mathematical helpers are the same for all option types, so they're implemented once in the base class.</P>
</Step>

<AnnotatedCode title="option.cpp — base class implementation" lines={[
  {code:'#include "option.h"',why:""},
  {code:"#include <cmath>",why:"Math functions."},
  {code:"",why:""},
  {code:"Option::Option(double K, double T)",why:"Constructor."},
  {code:"    : K_(K), T_(T)",why:"Initialize protected members."},
  {code:"{ }",why:""},
  {code:"",why:""},
  {code:"double Option::d1(double S, double r, double v) const {",why:"d1 formula."},
  {code:"    return (std::log(S * std::exp(r * T_) / K_)) / (v * std::sqrt(T_))",why:"log(S·e^(rT)/K) / (v·√T)"},
  {code:"           + 0.5 * v * std::sqrt(T_);",why:"+ v·√T/2"},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"double Option::d2(double S, double r, double v) const {",why:"d2 = d1 - v·√T."},
  {code:"    return d1(S, r, v) - v * std::sqrt(T_);",why:""},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"double Option::N(double x) const {",why:"Standard normal CDF."},
  {code:"    return 0.5 * (1.0 + std::erf(x / std::sqrt(2.0)));",why:"N(x) = ½[1 + erf(x/√2)]"},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"double Option::Nprime(double x) const {",why:"Standard normal PDF."},
  {code:"    const double PI = 3.14159265358979323846;",why:"π constant."},
  {code:"    return std::exp(-0.5 * x * x) / std::sqrt(2.0 * PI);",why:"N'(x) = e^(-x²/2) / √(2π)"},
  {code:"}",why:""}
]}/>

<H>Part 2: EuropeanCall Derived Class</H>
<Step n={3} title="Implement the call pricing formula">
<P>Call price: <M>{"V = S \\cdot N(d_1) - K \\cdot e^{-rT} \\cdot N(d_2)"}</M>. Override price() with this formula.</P>
</Step>

<AnnotatedCode title="european_call.h" lines={[
  {code:"#ifndef EUROPEAN_CALL_H",why:""},
  {code:"#define EUROPEAN_CALL_H",why:""},
  {code:'#include "option.h"',why:"Need Option base class definition."},
  {code:"",why:""},
  {code:"class EuropeanCall : public Option {",why:"IS-A Option. Inherits K_, T_, d1(), d2(), N(), Nprime()."},
  {code:"public:",why:""},
  {code:"    EuropeanCall(double K, double T);",why:"Constructor passes K,T to base."},
  {code:"",why:""},
  {code:"    double price(double S, double r, double v) const override;",why:"OVERRIDE: implements the pure virtual from Option. 'override' catches signature mismatches."},
  {code:"    double delta(double S, double r, double v) const;",why:"Call delta: N(d1)."},
  {code:"    double gamma(double S, double r, double v) const;",why:"Call gamma: N'(d1) / (S·v·√T)."},
  {code:"};",why:""},
  {code:"",why:""},
  {code:"#endif",why:""}
]}/>

<AnnotatedCode title="european_call.cpp" lines={[
  {code:'#include "european_call.h"',why:""},
  {code:"#include <cmath>",why:""},
  {code:"",why:""},
  {code:"EuropeanCall::EuropeanCall(double K, double T)",why:""},
  {code:"    : Option(K, T)",why:"MUST call base constructor in initializer list to initialize K_ and T_."},
  {code:"{ }",why:""},
  {code:"",why:""},
  {code:"double EuropeanCall::price(double S, double r, double v) const {",why:""},
  {code:"    double d1_val = d1(S, r, v);",why:"Call inherited helper. No Option:: needed — it's inherited."},
  {code:"    double d2_val = d2(S, r, v);",why:""},
  {code:"    return S * N(d1_val) - K_ * std::exp(-r * T_) * N(d2_val);",why:"Call formula: S·N(d1) - K·e^(-rT)·N(d2)."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"double EuropeanCall::delta(double S, double r, double v) const {",why:""},
  {code:"    return N(d1(S, r, v));",why:"Call delta = N(d1)."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"double EuropeanCall::gamma(double S, double r, double v) const {",why:""},
  {code:"    double d1_val = d1(S, r, v);",why:""},
  {code:"    return Nprime(d1_val) / (S * v * std::sqrt(T_));",why:"Gamma = N'(d1) / (S·v·√T). Same for call and put."},
  {code:"}",why:""}
]}/>

<Conversion from="Forgetting override keyword" to="Using override keyword" feature="override Keyword (C++11)"
  beforeCode={`class EuropeanCall : public Option {
  double price(...) const; // compiles
  // But if base signature differs:
  // you silently create a NEW function
  // instead of overriding!
};`}
  afterCode={`class EuropeanCall : public Option {
  double price(...) const override;
  // COMPILER ERROR if base signature
  // doesn't match — catches bugs!
};`}/>

<H>Part 3: EuropeanPut Derived Class</H>
<Step n={4} title="Implement the put pricing formula">
<P>Put price: V = K·e^(−rT)·N(−d₂) − S·N(−d₁). Notice the negative arguments to N().</P>
</Step>

<AnnotatedCode title="european_put.cpp (header similar to call)" lines={[
  {code:'#include "european_put.h"',why:""},
  {code:"#include <cmath>",why:""},
  {code:"",why:""},
  {code:"EuropeanPut::EuropeanPut(double K, double T)",why:""},
  {code:"    : Option(K, T)",why:"Call base constructor."},
  {code:"{ }",why:""},
  {code:"",why:""},
  {code:"double EuropeanPut::price(double S, double r, double v) const {",why:""},
  {code:"    double d1_val = d1(S, r, v);",why:""},
  {code:"    double d2_val = d2(S, r, v);",why:""},
  {code:"    return K_ * std::exp(-r * T_) * N(-d2_val) - S * N(-d1_val);",why:"Put formula: K·e^(-rT)·N(-d2) - S·N(-d1). Note NEGATIVE signs."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"double EuropeanPut::delta(double S, double r, double v) const {",why:""},
  {code:"    return N(d1(S, r, v)) - 1.0;",why:"Put delta = N(d1) - 1. Always negative (put increases as S decreases)."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"double EuropeanPut::gamma(double S, double r, double v) const {",why:""},
  {code:"    return Nprime(d1(S, r, v)) / (S * v * std::sqrt(T_));",why:"Same formula as call. Gamma is always positive."},
  {code:"}",why:""}
]}/>

<H>Part 4: Using Polymorphism</H>
<Step n={5} title="Price any option through base pointer">
<P>A function taking Option& or Option* can price ANY option type without knowing the concrete type.</P>
</Step>

<AnnotatedCode title="main.cpp — polymorphic pricing" lines={[
  {code:'#include "european_call.h"',why:""},
  {code:'#include "european_put.h"',why:""},
  {code:"#include <iostream>",why:""},
  {code:"#include <iomanip>",why:""},
  {code:"#include <vector>",why:""},
  {code:"",why:""},
  {code:"void print_price(const Option& opt, double S, double r, double v) {",why:"Takes BASE CLASS reference — any option type works!"},
  {code:'    std::cout << "Price: " << opt.price(S, r, v) << std::endl;',why:"POLYMORPHISM: calls correct derived price() at runtime."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"int main() {",why:""},
  {code:"    EuropeanCall call(100.0, 1.0);",why:"K=100, T=1 year."},
  {code:"    EuropeanPut put(120.0, 2.0);",why:"K=120, T=2 years."},
  {code:"",why:""},
  {code:"    // Test call",why:""},
  {code:'    std::cout << "Call (S=100, r=0.05, v=0.3):" << std::endl;',why:""},
  {code:"    print_price(call, 100.0, 0.05, 0.3);",why:"Passes EuropeanCall to Option& parameter."},
  {code:'    std::cout << "Delta: " << call.delta(100.0, 0.05, 0.3) << std::endl;',why:""},
  {code:'    std::cout << "Gamma: " << call.gamma(100.0, 0.05, 0.3) << std::endl;',why:""},
  {code:"",why:""},
  {code:"    // Test put",why:""},
  {code:'    std::cout << "\\nPut (S=120, r=0.1, v=0.4):" << std::endl;',why:""},
  {code:"    print_price(put, 120.0, 0.1, 0.4);",why:"Same function works for Put!"},
  {code:"",why:""},
  {code:"    // Vector of different options (polymorphic container)",why:""},
  {code:"    std::vector<Option*> options;",why:"Vector of BASE POINTERS."},
  {code:"    options.push_back(&call);",why:"Add call (EuropeanCall*)."},
  {code:"    options.push_back(&put);",why:"Add put (EuropeanPut*)."},
  {code:"",why:""},
  {code:"    for (const auto* opt : options) {",why:"Iterate through base pointers."},
  {code:"        print_price(*opt, 100.0, 0.05, 0.3);",why:"Each calls the correct derived price()."},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:"    return 0;",why:""}
]}/>

<MemDiagram title="Polymorphism: Base Pointer to Derived Objects" cells={[
  {addr:"Option* ptr",label:"ptr",value:"base pointer",color:C.accent},
  {type:"arrow",label:"points to"},
  {addr:"EuropeanCall",label:"call",value:"K=100,T=1",color:C.g},
  {addr:"vtable",label:"",value:"→ EuropeanCall::price()",color:C.o}
]}/>

<Confusion mistake="Forgetting virtual destructor in Option base class" why="If you delete a derived object through a base pointer without a virtual destructor, only the base destructor runs — derived resources leak. Always: virtual ~Option() = default;"/>

<Exam>The override keyword is your friend. It catches two common bugs at compile time: (1) misspelling the function name, (2) wrong parameter types. Without override, you silently create a new function that doesn't override anything.</Exam>

<Quiz questions={[
  {q:"A pure virtual function (= 0) means:",o:["Default implementation exists","Derived classes MAY override it","Derived classes MUST implement it","The function is deleted"],a:2},
  {q:"d1() and d2() are NON-virtual in Option because:",o:["They're complex","The formula is the same for all option types — no need to override","Virtual is slow","They're private"],a:1},
  {q:"Why make K_ and T_ protected instead of private?",o:["It's faster","Derived classes need direct access to them for pricing formulas","Protected is always better","No reason"],a:1},
  {q:"Consider:\n```cpp\nOption opt(100, 1);  // Line A\nEuropeanCall call(100, 1);  // Line B\n```\nWhich line causes a compile error?",o:["Line A — Option is abstract (has pure virtual price())","Line B — EuropeanCall needs more parameters","Both lines","Neither line"],a:0,e:"Option has a pure virtual function, making it abstract. You cannot create objects of abstract classes."},
  {q:"If you forget the override keyword and misspell price as prcie:\n```cpp\ndouble prcie(double S, double r, double v) const;\n```\nWhat happens?",o:["Compile error","You create a NEW function prcie() — Option's price() remains pure virtual — EuropeanCall is still abstract — compile error when trying to instantiate","Runtime error","Nothing wrong"],a:1,e:"Without override, the compiler doesn't know you intended to override. But since Option::price() remains pure virtual (unimplemented), EuropeanCall is still abstract and cannot be instantiated."},
  {q:"The line `return K_ * std::exp(-r * T_) * N(-d2_val)` in EuropeanPut::price uses K_ and T_ directly because:",o:["They're public","They're protected — accessible by derived classes","It's a friend function","C++ allows it"],a:1}
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
};

#endif`},
{name:"EuropeanCall.cpp",code:`#include "EuropeanCall.h"
#include <cmath>

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
};

#endif`},
{name:"EuropeanPut.cpp",code:`#include "EuropeanPut.h"
#include <cmath>

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
}`},
{name:"main.cpp",code:`#include <iostream>
#include <iomanip>
#include "EuropeanCall.h"
#include "EuropeanPut.h"

int main() {
    std::cout << std::fixed << std::setprecision(6);

    // Call: S0 = 100, K = 100, T = 1, sigma = 0.3, r = 0.05
    {
        double S0 = 100.0;
        double K  = 100.0;
        double T  = 1.0;
        double v  = 0.3;
        double r  = 0.05;

        EuropeanCall call(K, T);
        std::cout << "European Call Option:" << std::endl;
        std::cout << "  S0 = " << S0 << ", K = " << K
                  << ", T = " << T << ", sigma = " << v
                  << ", r = " << r << std::endl;
        std::cout << "  Price: " << call.price(S0, r, v) << std::endl;
        std::cout << "  Delta: " << call.delta(S0, r, v) << std::endl;
        std::cout << "  Gamma: " << call.gamma(S0, r, v) << std::endl;
        std::cout << std::endl;
    }

    // Put: S0 = 120, K = 120, T = 2, sigma = 0.4, r = 0.1
    {
        double S0 = 120.0;
        double K  = 120.0;
        double T  = 2.0;
        double v  = 0.4;
        double r  = 0.1;

        EuropeanPut put(K, T);
        std::cout << "European Put Option:" << std::endl;
        std::cout << "  S0 = " << S0 << ", K = " << K
                  << ", T = " << T << ", sigma = " << v
                  << ", r = " << r << std::endl;
        std::cout << "  Price: " << put.price(S0, r, v) << std::endl;
        std::cout << "  Delta: " << put.delta(S0, r, v) << std::endl;
        std::cout << "  Gamma: " << put.gamma(S0, r, v) << std::endl;
    }

    return 0;
}`}
]}/>
</>)};

export default assignment3;
