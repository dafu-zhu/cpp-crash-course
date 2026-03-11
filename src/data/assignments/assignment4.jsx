import { C, P, H, B, M, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, Checklist } from "../../components";

const assignment4 = {title:"Assignment 4: Monte Carlo Pricer",content:(<>
<Hw num={4} title="Monte Carlo Option Pricer" desc={`Implement a Monte Carlo option pricer using modern C++ random number generation.

Requirements:
• Use Box-Muller method OR <random> library for N(0,1) samples
• Simulate stock paths using GBM: S_T = S₀·exp((r-σ²/2)T + σ√T·z)
• Price European Call and Put using polymorphism
• Compute 95% confidence interval

Test parameters:
• S₀=100, σ=0.3, r=0.01, T=2.0, K=100
• M = 10000, 100000, 1000000 paths
• Compare with BS analytical price`}/>

<Flowchart title="MC Pricing Algorithm" steps={[
  {label:"1. Draw z",items:["z ~ N(0,1)","mt19937 engine","normal_distribution"],color:C.b},
  {label:"2. Simulate S_T",items:["GBM formula","S·exp(drift + diffusion)"],color:C.o},
  {label:"3. Payoff",items:["Call: max(S_T-K, 0)","Put: max(K-S_T, 0)","polymorphism!"],color:C.g},
  {label:"4. Average",items:["Sum payoffs","Discount: e^(-rT)","÷ M paths"],color:C.accent}
]}/>

<H>Part 1: Random Number Generation</H>
<P>We need N(0,1) random numbers. Modern C++ provides &lt;random&gt; with high-quality generators.</P>

<Step n={1} title="Set up the random number generator">
<P>mt19937 is the Mersenne Twister engine — high-quality pseudo-random generator. normal_distribution transforms uniform numbers to N(0,1).</P>
</Step>

<AnnotatedCode title="Random number setup" lines={[
  {code:"#include <random>",why:"Modern C++ random number library."},
  {code:"",why:""},
  {code:"class MCPricer {",why:"Monte Carlo pricer class."},
  {code:"public:",why:""},
  {code:"    MCPricer(unsigned long seed = 771);",why:"Constructor takes seed. Fixed seed → reproducible results."},
  {code:"    double price(const Option& option, double S, double vol,",why:""},
  {code:"                 double rate, unsigned long M) const;",why:"M = number of simulation paths."},
  {code:"",why:""},
  {code:"private:",why:""},
  {code:"    mutable std::mt19937 eng_;",why:"MUTABLE: allows modification even in const member functions. Needed because generating random numbers modifies state."},
  {code:"    mutable std::normal_distribution<double> ndist_;",why:"Transforms engine output to N(0,1)."},
  {code:"};",why:""}
]}/>

<Confusion mistake="Not making eng_ and ndist_ mutable" why="The price() function is const (it doesn't logically modify the pricer), but generating random numbers modifies the engine's internal state. mutable allows this specific modification inside a const function."/>

<AnnotatedCode title="mc_pricer.cpp" lines={[
  {code:'#include "mc_pricer.h"',why:""},
  {code:'#include "option.h"',why:""},
  {code:"#include <cmath>",why:"For exp, sqrt."},
  {code:"",why:""},
  {code:"MCPricer::MCPricer(unsigned long seed)",why:""},
  {code:"    : eng_(seed), ndist_(0.0, 1.0)",why:"Initialize engine with seed. ndist_(0.0, 1.0) = N(0,1)."},
  {code:"{ }",why:""},
  {code:"",why:""},
  {code:"double MCPricer::price(const Option& option, double S,",why:"Takes BASE CLASS reference — any option type works."},
  {code:"    double vol, double rate, unsigned long M) const {",why:"M = number of paths."},
  {code:"",why:""},
  {code:"    double T = option.get_T();",why:"Get maturity from option."},
  {code:"    double K = option.get_K();",why:"Get strike."},
  {code:"",why:""},
  {code:"    // Pre-compute constants",why:""},
  {code:"    double drift = (rate - 0.5 * vol * vol) * T;",why:"(r - σ²/2)·T"},
  {code:"    double diffusion = vol * std::sqrt(T);",why:"σ·√T"},
  {code:"    double discount = std::exp(-rate * T);",why:"e^(-rT) for discounting."},
  {code:"",why:""},
  {code:"    double sum = 0.0;",why:"Accumulate payoffs."},
  {code:"",why:""},
  {code:"    for (unsigned long i = 0; i < M; ++i) {",why:"Simulate M paths."},
  {code:"        double z = ndist_(eng_);",why:"Draw one N(0,1) sample."},
  {code:"        double ST = S * std::exp(drift + diffusion * z);",why:"GBM formula: S_T = S₀·exp((r-σ²/2)T + σ√T·z)"},
  {code:"        sum += option.get_payoff(ST);",why:"POLYMORPHISM: calls correct payoff for Call or Put."},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:"    return discount * sum / M;",why:"Discounted average payoff."},
  {code:"}",why:""}
]}/>

<H>Part 2: Add Payoff to Option Hierarchy</H>
<Step n={2} title="Add get_payoff to Option base class">
<P>MC pricer needs to compute payoff given S_T. This is option-type specific, so it's virtual.</P>
</Step>

<AnnotatedCode title="Adding payoff to option hierarchy" lines={[
  {code:"// In Option base class (option.h):",why:""},
  {code:"virtual double get_payoff(double ST) const = 0;",why:"Pure virtual: derived classes implement."},
  {code:"",why:""},
  {code:"// In EuropeanCall:",why:""},
  {code:"double EuropeanCall::get_payoff(double ST) const {",why:""},
  {code:"    return std::max(ST - K_, 0.0);",why:"Call payoff: max(S_T - K, 0)."},
  {code:"}",why:""},
  {code:"",why:""},
  {code:"// In EuropeanPut:",why:""},
  {code:"double EuropeanPut::get_payoff(double ST) const {",why:""},
  {code:"    return std::max(K_ - ST, 0.0);",why:"Put payoff: max(K - S_T, 0)."},
  {code:"}",why:""}
]}/>

<MemDiagram title="MC Pricer: Polymorphic Dispatch" cells={[
  {addr:"MCPricer",label:"pricer",value:"eng_, ndist_",color:C.b},
  {type:"arrow",label:"price(option,...)"},
  {addr:"const Option&",label:"option",value:"polymorphic ref",color:C.accent},
  {type:"arrow",label:"get_payoff()"},
  {addr:"EuropeanCall",label:"actual",value:"max(ST-K,0)",color:C.g}
]}/>

<H>Part 3: Confidence Interval</H>
<Step n={3} title="Compute standard error and 95% CI">
<P>Standard error (<M>{"\\sigma"}</M> = sample std dev of discounted payoffs):</P>
<M block>{"\\varepsilon = \\frac{\\sigma}{\\sqrt{M}}"}</M>
<P>95% CI: <M>{"[\\hat{C} - 1.96\\varepsilon, \\; \\hat{C} + 1.96\\varepsilon]"}</M></P>
</Step>

<AnnotatedCode title="Computing confidence interval" lines={[
  {code:"// Enhanced price function that also returns CI",why:""},
  {code:"struct MCResult {",why:"Bundle price + CI together."},
  {code:"    double price;",why:""},
  {code:"    double ci_low;",why:"Lower bound of 95% CI."},
  {code:"    double ci_high;",why:"Upper bound."},
  {code:"    double std_error;",why:"Standard error ε."},
  {code:"};",why:""},
  {code:"",why:""},
  {code:"MCResult MCPricer::price_with_ci(...) const {",why:""},
  {code:"    double sum = 0.0;",why:"Sum of discounted payoffs."},
  {code:"    double sum_sq = 0.0;",why:"Sum of squared payoffs for variance."},
  {code:"",why:""},
  {code:"    for (unsigned long i = 0; i < M; ++i) {",why:""},
  {code:"        double z = ndist_(eng_);",why:""},
  {code:"        double ST = S * std::exp(drift + diffusion * z);",why:""},
  {code:"        double payoff = discount * option.get_payoff(ST);",why:"Discounted payoff."},
  {code:"        sum += payoff;",why:""},
  {code:"        sum_sq += payoff * payoff;",why:"For variance calculation."},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:"    double mean = sum / M;",why:"MC price estimate."},
  {code:"    double variance = (sum_sq / M) - (mean * mean);",why:"Var = E[X²] - E[X]²."},
  {code:"    double std_error = std::sqrt(variance / M);",why:"SE = σ/√M."},
  {code:"",why:""},
  {code:"    return {mean, mean - 1.96*std_error, mean + 1.96*std_error, std_error};",why:"Return price and 95% CI."},
  {code:"}",why:""}
]}/>

<Conversion from="Not using reproducible seed" to="Using fixed seed for testing" feature="Reproducible Random Numbers"
  beforeCode={`std::random_device rd;
std::mt19937 eng(rd()); // Different
// every run — hard to debug!

// Results vary each execution
// Can't verify against expected`}
  afterCode={`std::mt19937 eng(771); // Fixed seed
// SAME sequence every run!

// Results reproducible
// Easy to test against expected
// Use random_device for production`}/>

<H>Part 4: Using the MC Pricer</H>
<Step n={4} title="Test with different path counts">
<P>More paths → smaller standard error → tighter CI. Error decreases as 1/√M.</P>
</Step>

<AnnotatedCode title="main.cpp — testing MC pricer" lines={[
  {code:'#include "mc_pricer.h"',why:""},
  {code:'#include "european_call.h"',why:""},
  {code:'#include "european_put.h"',why:""},
  {code:"#include <iostream>",why:""},
  {code:"#include <iomanip>",why:""},
  {code:"",why:""},
  {code:"int main() {",why:""},
  {code:"    EuropeanCall call(100.0, 2.0);",why:"K=100, T=2."},
  {code:"    MCPricer pricer(771);",why:"Fixed seed for reproducibility."},
  {code:"",why:""},
  {code:"    double S = 100.0, vol = 0.3, rate = 0.01;",why:"Test parameters."},
  {code:"",why:""},
  {code:'    std::cout << std::fixed << std::setprecision(4);',why:""},
  {code:'    std::cout << "Paths\\tPrice\\t\\t95% CI" << std::endl;',why:""},
  {code:"",why:""},
  {code:"    for (unsigned long M : {10000UL, 100000UL, 1000000UL}) {",why:"Test different path counts."},
  {code:"        auto result = pricer.price_with_ci(call, S, vol, rate, M);",why:""},
  {code:"        std::cout << M << '\\t' << result.price",why:""},
  {code:'                  << "\\t\\t[" << result.ci_low << ", "',why:""},
  {code:"                  << result.ci_high << ']' << std::endl;",why:""},
  {code:"    }",why:""},
  {code:"",why:""},
  {code:"    return 0;",why:""}
]}/>

<Tip title="Key MC Concepts">
1. <B>GBM formula</B>: S_T = S₀·exp((r-σ²/2)T + σ√T·z){"\n"}
2. <B>Standard error</B>: ε = σ/√M — halving error needs 4× paths{"\n"}
3. <B>95% CI</B>: [price ± 1.96·ε]{"\n"}
4. <B>Polymorphism</B>: One pricer works for any option type{"\n"}
5. <B>mutable</B>: Allows RNG state change in const function
</Tip>

<Quiz questions={[
  {q:"To halve the MC standard error, you need:",o:["2× more paths","4× more paths (SE = σ/√M)","10× more paths","Same paths, different seed"],a:1},
  {q:"Why is the random engine marked 'mutable'?",o:["It's required by C++","Generating random numbers modifies engine state, but we want price() to be const","mutable makes it faster","No reason"],a:1},
  {q:"In the GBM formula S_T = S·exp((r-σ²/2)T + σ√T·z), the (r-σ²/2) term is called:",o:["Diffusion","Drift (risk-neutral)","Volatility","Strike"],a:1},
  {q:"Why use a fixed seed (771) instead of random_device?",o:["It's faster","Fixed seed gives reproducible results for testing and debugging","random_device is broken","No difference"],a:1},
  {q:"Consider:\n```cpp\nMCPricer pricer(42);\nEuropeanCall call(100, 1);\ndouble p1 = pricer.price(call, 100, 0.3, 0.05, 10000);\ndouble p2 = pricer.price(call, 100, 0.3, 0.05, 10000);\n```\nAre p1 and p2 equal?",o:["Yes — same seed","No — engine state changed after first call, second call uses different random numbers","Depends on the option","Compile error"],a:1,e:"After the first price() call, the engine has advanced through 10000 random numbers. The second call continues from that state, so it uses different random numbers and gives a different result."},
  {q:"The pricer takes `const Option& option`. This enables:",o:["Faster code","Polymorphism — any derived option type (Call, Put, Barrier) can be priced","Read-only access","All of the above"],a:3}
]}/>

<Checklist items={[
  "Set up mt19937 engine with fixed seed for reproducibility",
  "Created normal_distribution<double>(0.0, 1.0) for N(0,1) samples",
  "Made engine and distribution mutable for use in const functions",
  "Implemented GBM simulation: ST = S·exp((r-σ²/2)T + σ√T·z)",
  "Added get_payoff() virtual function to Option hierarchy",
  "Implemented Call payoff: max(ST - K, 0)",
  "Implemented Put payoff: max(K - ST, 0)",
  "Used polymorphism: price() takes const Option& parameter",
  "Computed discounted average: e^(-rT) × (sum of payoffs) / M",
  "Implemented standard error: ε = σ/√M",
  "Computed 95% CI: [price ± 1.96·ε]",
  "Tested with M = 10000, 100000, 1000000 paths",
  "Verified CI narrows as M increases"
]}/>
</>)};

export default assignment4;
