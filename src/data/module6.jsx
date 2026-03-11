import { C, P, H, B, M, Code, AnnotatedCode, Step, Flowchart, MemDiagram, Hierarchy, Prof, Exam, Tip, Confusion, Conversion, Hw, Quiz, Checklist } from "../components";

const module6 = {id:6,title:"AI, RL & Trading",sub:"Lec 8-9 · Eigen, Reinforcement Learning, FIX, Containers, VaR",icon:"🤖",color:C.y,sections:[

// ═══════ 6.1 LINEAR REGRESSION WITH EIGEN ═══════
{title:"Linear Regression with Eigen",content:(<>
<P>The professor revisits the Portfolio Manager to replace the simple moving average with an AI model: <B>linear regression</B>. The C++ code mirrors Python's sklearn API.</P>

<Flowchart title="Strategy: ML Pipeline in C++" steps={[
  {label:"1. Load Data",items:["DataLoader class","CSV → PriceData struct","→ Eigen matrices"],color:C.b},
  {label:"2. Train Model",items:["LinearRegression class","lr.fit(X_train, y_train)","Householder QR"],color:C.o},
  {label:"3. Predict & Evaluate",items:["lr.predict(X_test)","MSE, RMSE, MAE, R²"],color:C.g},
]}/>

<H>sklearn → C++ Translation</H>
<Conversion from="Python sklearn interface" to="C++ Eigen-based class" feature="LinearRegression class with Eigen library"
  beforeCode={`# Python
from sklearn.linear_model import \\
  LinearRegression
lr = LinearRegression()
lr.fit(X_train, y_train)
predictions = lr.predict(X_test)
beta = lr.coef_`}
  afterCode={`// C++
#include <Eigen/Dense>
LinearRegression lr;
lr.fit(X_train, y_train);
auto preds = lr.predict(X_test);
auto beta = lr.coefficients();`}
/>

<H>The PriceData Struct</H>
<AnnotatedCode lines={[
  {code:"struct PriceData {",why:"A plain struct to hold raw market data downloaded from yfinance. Each vector is one column of the CSV."},
  {code:"    vector<string> date;",why:"Date column."},
  {code:"    vector<double> open;",why:"Open prices — one per day."},
  {code:"    vector<double> high;",why:"Daily high."},
  {code:"    vector<double> low;",why:"Daily low."},
  {code:"    vector<double> close;",why:"Close prices — our prediction target (shifted by 1 day)."},
  {code:"    vector<double> volume;",why:"Trading volume."},
  {code:"};",why:""},
]}/>

<H>std::span — Non-Owning View (C++20)</H>
<Step n={1} title="span provides a lightweight view over contiguous data — no copying">
<code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>std::span&lt;double&gt;</code> doesn't own or copy data. It just points to an existing array/vector and knows its size. Like a reference to a range. Use it when designing APIs that should work with vector, array, and C-style arrays.
</Step>

<AnnotatedCode lines={[
  {code:"#include <span>",why:""},
  {code:"std::span<double> window = std::span(prices).subspan(100, 100);",why:"Creates a VIEW of prices[100..199] — zero-copy. subspan(start, count) extracts a slice."},
  {code:"fit(window);",why:"Pass the view to a function. No data was copied."},
]}/>

<H>Eigen::Map — Zero-Copy Loading into Eigen Matrices</H>
<P>The key technique for getting data from std::vector into Eigen without copying:</P>

<AnnotatedCode title="Populating Eigen feature matrix from PriceData" lines={[
  {code:"void populate_feature_matrix(const PriceData& data, Eigen::MatrixXd& X) {",why:"Takes raw data and fills an Eigen matrix."},
  {code:"    Index n_samples = data.open.size() - 1;",why:"Exclude last row: it's the prediction target, not a feature."},
  {code:"    Index n_features = 2;",why:"Using 2 features: open and close prices."},
  {code:"    X.resize(n_samples, n_features);",why:"Allocate the Eigen matrix."},
  {code:"    X.col(0) = Eigen::Map<const Eigen::VectorXd>(data.open.data(), n_samples);",why:"Eigen::Map creates a VECTOR VIEW over existing memory (data.open's internal array). No copy! .data() returns the raw pointer to the vector's internal buffer."},
  {code:"    X.col(1) = Eigen::Map<const Eigen::VectorXd>(data.close.data(), n_samples);",why:"Same for close prices. Assignment copies into the matrix column, but the Map itself is zero-copy."},
  {code:"}",why:""},
]}/>

<AnnotatedCode title="Populating target vector (shifted by 1 day)" lines={[
  {code:"void populate_target_vector(const PriceData& data, Eigen::VectorXd& target) {",why:"Target = TOMORROW's close, so we shift by 1 index."},
  {code:"    Index n = data.close.size() - 1;",why:"Same number of samples as features."},
  {code:"    target = Eigen::Map<const Eigen::VectorXd>(data.close.data() + 1, n);",why:"data() + 1 starts from index 1 (tomorrow's close). This aligns target[i] with features[i] (today's data → tomorrow's close)."},
  {code:"}",why:""},
]}/>

<H>Solving Least Squares with Householder QR</H>
<P>Linear regression minimizes <M>{"\\|X\\beta - y\\|^2"}</M>. Direct matrix inverse is numerically unstable. Instead, use QR decomposition:</P>

<AnnotatedCode title="Training: fit()" lines={[
  {code:"Eigen::MatrixXd X_aug(X.rows(), X.cols() + 1);",why:"Augment the feature matrix: add a column of 1s for the intercept term."},
  {code:"X_aug.col(0) = Eigen::VectorXd::Ones(X.rows());",why:"First column = all 1s (intercept column)."},
  {code:"X_aug.rightCols(X.cols()) = X;",why:"Remaining columns = the original features."},
  {code:"Eigen::VectorXd beta = X_aug.colPivHouseholderQr().solve(y);",why:"Solve least squares using Householder QR decomposition — numerically stable. This is what sklearn does behind the scenes."},
  {code:"intercept_ = beta(0);",why:"First element of beta is the intercept (corresponds to the 1s column)."},
  {code:"coefs_ = beta.tail(beta.size() - 1);",why:"Remaining elements are the feature coefficients."},
]}/>

<AnnotatedCode title="Prediction: predict()" lines={[
  {code:"VectorXd predictions = (X_new * coefs_).array() + intercept_;",why:"Matrix multiply features × coefficients, add intercept. .array() enables element-wise addition."},
]}/>

<H>Train/Validation/Test Split</H>
<P>Eigen provides convenient methods: topRows(n), middleRows(start,n), bottomRows(n) for matrices; head(n), segment(start,n), tail(n) for vectors.</P>

<H>Third-Party Library Setup</H>
<P>Eigen is <B>header-only</B>: no compilation, no linking. Just point your include path to the Eigen directory:</P>
<P>• CLion: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>include_directories(/path/to/eigen)</code> in CMakeLists.txt</P>
<P>• Visual Studio: Properties → C/C++ → Additional Include Directories</P>

<Quiz questions={[
  {q:"Eigen::Map creates a view over existing memory. Does it copy data?",o:["Yes, it makes a full copy","No — it wraps existing memory with zero copy","It copies only if the vector is large"],a:1},
  {q:"Why add a column of 1s to the feature matrix?",o:["For padding","To represent the intercept term (bias) in linear regression","Eigen requires it","To normalize features"],a:1},
  {q:"colPivHouseholderQr().solve(y) solves:",o:["Eigenvalue decomposition","Least squares: min ||Xβ - y||²","Matrix inversion","Singular value decomposition"],a:1},
  {q:"Consider:\n```cpp\nvector<double> prices = {100.0, 102.0, 101.5};\nEigen::Map<const Eigen::VectorXd> view(prices.data(), prices.size());\n```\nWhat does prices.data() return?",o:["A copy of the vector","A raw pointer to the vector's internal memory buffer","The first element","An iterator"],a:1,e:".data() returns a pointer to the underlying contiguous array. Eigen::Map wraps this pointer without copying."},
  {q:"The Eigen library is 'header-only.' This means:",o:["You can only use it in header files","No compilation or linking of library code is needed — just include the headers","It only works with Visual Studio","It doesn't support templates"],a:1,e:"Header-only libraries require no separate compilation step. Just point your include path to the Eigen directory."},
]}/>
</>)},

// ═══════ 6.2 REINFORCEMENT LEARNING ═══════
{title:"Reinforcement Learning: Frozen Lake",content:(<>
<Prof>"The most important thing I want to illustrate: using what we know, we can solve a lot of computing problems. The C++ tools are the same — only the problem changes."</Prof>

<H>RL Concept: Learn from Experience</H>
<P>An agent interacts with an environment. It takes actions, observes outcomes (rewards/penalties), and learns which actions are good in which states. No labeled training data — the agent discovers good behavior through trial and error.</P>

<H>Frozen Lake: The Problem</H>
<P>A 4×4 grid. Agent starts at S (state 0), must reach G (state 15, goal) without falling into H (holes).</P>

<MemDiagram title="Frozen Lake 4×4 Grid" cells={[
  {label:"0:S",value:"Start",color:C.g},
  {label:"1:F",value:"Safe",color:C.b},
  {label:"5:H",value:"Hole!",color:C.r},
  {label:"15:G",value:"Goal!",color:C.y},
]}/>

<P>16 states (0-15). 4 actions per state: 0=Left, 1=Down, 2=Right, 3=Up.</P>
<P>Rewards: +1 for reaching goal, −10 for falling in hole, 0 for all other steps.</P>

<H>The Q-Table: The Agent's "Brain"</H>
<Step n={1} title="Q-table is a 16×4 table: Q(state, action) = 'how good is this action in this state'">
Initially all zeros (agent knows nothing). Through repeated episodes, the table fills with learned values. Positive Q → action leads toward goal. Negative Q → action leads to hole.
</Step>

<H>Monte Carlo Q-Learning: Episode-Based</H>
<Flowchart title="One Episode of Training" steps={[
  {label:"1. Simulate",items:["Take actions","until goal/hole/limit"],color:C.b},
  {label:"2. Get Reward",items:["+1 goal","−10 hole"],color:C.o},
  {label:"3. Update Q-table",items:["Backward from end","to start"],color:C.g},
]}/>

<Step n={2} title="Simulate one episode: take actions until terminal state">
<AnnotatedCode lines={[
  {code:"int state = 0;",why:"Start at state 0 (top-left corner)."},
  {code:"vector<pair<int,int>> episode;",why:"Record each (state, action) pair visited during this episode."},
  {code:"for (int t = 0; t < MAX_STEPS; ++t) {",why:"Limit steps to prevent infinite wandering."},
  {code:"    int best = get_best_action(Q, state);",why:"Look up Q-table: which action has highest value in this state?"},
  {code:"    int action = select_action(best, epsilon);",why:"Usually pick best, but with probability epsilon pick random (exploration)."},
  {code:"    int new_state = step(state, action);",why:"Apply action: compute next state based on grid layout."},
  {code:"    episode.push_back({state, action});",why:"Record this state-action pair for later Q-table update."},
  {code:"    state = new_state;",why:"Move to new state."},
  {code:"    if (is_terminal(state)) break;",why:"If goal or hole reached, episode is over."},
  {code:"}",why:""},
]}/>
</Step>

<Step n={3} title="Update Q-table backward: propagate reward from end to start">
<AnnotatedCode title="Backward Monte Carlo Update" lines={[
  {code:"int reward = get_reward(state);",why:"Final reward: +1 if goal, −10 if hole."},
  {code:"for (auto it = episode.rbegin(); it != episode.rend(); ++it) {",why:"rbegin/rend: iterate in REVERSE — from last step to first. Conceptually same as backward induction in the binomial tree."},
  {code:"    int s = it->first;",why:"State visited."},
  {code:"    int a = it->second;",why:"Action taken."},
  {code:"    visits[s][a]++;",why:"Count how many times we've visited this state-action pair."},
  {code:"    Q[s][a] += (reward - Q[s][a]) / visits[s][a];",why:"Incremental average update. Converges to the mean reward for this state-action pair over many episodes."},
  {code:"}",why:"After this loop, every state-action pair in this episode gets credit (or blame) for the outcome."},
]}/>
</Step>

<Prof>"The backward propagation part is conceptually similar to what we did in the binomial tree. The Monte Carlo simulation is similar to option pricing. Same C++ tools, different problem."</Prof>

<H>Extensions</H>
<Step n={4} title="Discount factor (γ): future rewards worth less">
<P>Return: <M>{"G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\cdots"}</M></P>
<P>Multiply reward by <M>{"\\gamma^k"}</M> at each backward step (k = steps until end). Encourages shorter paths.</P>
</Step>

<Step n={5} title="Exploration vs Exploitation">
Exploitation: always pick the action with highest Q (greedy). Exploration: sometimes pick random actions to discover better paths. Balance with epsilon-greedy: with probability ε pick random, otherwise pick best.
</Step>

<Quiz questions={[
  {q:"The Q-table stores:",o:["Stock prices","Expected value of each action in each state","Neural network weights","Random numbers"],a:1},
  {q:"Why update Q-table backward through the episode?",o:["It's faster","We only know the final outcome (goal/hole) at the end","The compiler requires it","Random order works too"],a:1},
  {q:"The backward RL update is conceptually similar to:",o:["Forward pass in neural network","Backward induction in binomial tree","Sorting a vector","CSV parsing"],a:1},
  {q:"Epsilon-greedy balances:",o:["Speed and accuracy","Exploration (random actions) and exploitation (best known action)","Memory and CPU","Training and testing"],a:1},
  {q:"In the Frozen Lake Q-learning, the Q-table has dimensions 16×4. What do the 16 rows and 4 columns represent?",o:["16 episodes and 4 rewards","16 states (grid cells) and 4 actions (left/down/right/up)","16 features and 4 targets","16 agents and 4 environments"],a:1,e:"The 4×4 grid has 16 states. At each state, the agent can take 4 actions: Left, Down, Right, Up."},
  {q:"In the incremental average update:\n`Q[s][a] += (reward - Q[s][a]) / visits[s][a]`\nWhat does this formula compute?",o:["The maximum reward","The running average of rewards for state-action pair (s,a)","The discount factor","The learning rate"],a:1,e:"This is the incremental mean formula. Each new reward shifts Q toward the actual mean, with the step size decreasing as visits increase."},
]}/>
</>)},

// ═══════ 6.3 STL CONTAINER COMPARISON ═══════
{title:"STL Container Comparison",content:(<>
<Prof>"Bad programmers worry about the code. Good programmers worry about data structures and their relationships." — Linus Torvalds</Prof>

<H>Four Key Containers</H>

<Step n={1} title="std::array — Fixed size, compile-time, fast access">
Lightweight wrapper around C-style arrays. Size known at compile time. Cannot resize. Fast random access. Contiguous memory.
</Step>

<Step n={2} title="std::vector — Dynamic size, fast access, DEFAULT CHOICE">
Resizable dynamically. Fast random access (O(1)). Contiguous memory. Resizing may require copying all elements. The professor and Bjarne Stroustrup: "By default, use vector."
</Step>

<Step n={3} title="std::list — Doubly linked list, fast insert/delete, no random access">
Each node stores data + pointers to previous and next nodes. Items NOT in contiguous memory. Fast insert/delete anywhere (O(1) once you have an iterator). But NO random access: can't do list[5]. Must traverse sequentially.
</Step>

<MemDiagram title="Linked List: nodes connected by pointers" cells={[
  {label:"Node 1",value:"21",color:C.b,addr:"→ next"},
  {type:"arrow",label:"ptr"},
  {label:"Node 2",value:"12",color:C.b,addr:"← prev → next"},
  {type:"arrow",label:"ptr"},
  {label:"Node 3",value:"37",color:C.b,addr:"← prev"},
]}/>

<P><B>std::forward_list</B>: singly linked — only forward traversal. Less memory than std::list (one pointer per node instead of two).</P>

<Step n={4} title="std::map — Key-value pairs, sorted, balanced tree (Red-Black Tree)">
Ordered by key. Reliable O(log n) search — even for millions of entries. Insert/delete may require tree rebalancing.
</Step>

<H>Other STL Containers</H>
<P>• <B>std::set</B> — sorted unique values (like map without values)</P>
<P>• <B>std::unordered_map</B> — hash table, O(1) average lookup, unordered</P>
<P>• <B>std::unordered_set</B> — hash set</P>
<P>• <B>std::deque</B> — double-ended queue, fast insert at both ends</P>
<P>• <B>std::stack</B>, <B>std::queue</B>, <B>std::priority_queue</B> — adapter containers</P>

<Tip title="There is NO 'best' container">
The right choice depends on: access pattern (random vs sequential), insertion/deletion frequency, memory usage, ordering requirements. Understanding these trade-offs is what Data Structures & Algorithms courses teach.
</Tip>

<Confusion mistake="Always using vector without considering alternatives" why="Vector is the default, but if you need fast insert/delete in the middle (list), ordered key-value lookup (map), or O(1) hash lookup (unordered_map), other containers are better. Choose based on your access pattern."/>

<Quiz questions={[
  {q:"Which container should be your default choice?",o:["std::array","std::vector","std::map","std::list"],a:1},
  {q:"std::list provides fast O(1) insertion but lacks:",o:["Iterators","Random access (no operator[])","The ability to store objects","Destructors"],a:1},
  {q:"std::map is implemented using:",o:["Hash table","Balanced tree (Red-Black Tree)","Array","Linked list"],a:1},
  {q:"You need to frequently insert/delete elements in the MIDDLE of a container. Which is the best choice?",o:["std::vector — fast random access","std::list — O(1) insert/delete once at position","std::array — fixed size, fastest","std::map — sorted keys"],a:1,e:"Vector requires shifting all subsequent elements for mid-container inserts (O(n)). List can insert/delete in O(1) once you have an iterator to the position."},
  {q:"You need O(1) average-case lookup by key, and order doesn't matter. Which container?",o:["std::map (O(log n), sorted)","std::unordered_map (O(1) average, hash table)","std::vector (O(n) search)","std::set (O(log n), sorted)"],a:1,e:"unordered_map uses a hash table for O(1) average lookup. map uses a balanced tree for O(log n) lookup but maintains order."},
  {q:"What is the key difference between std::array and std::vector?",o:["array can store objects, vector cannot","array size is fixed at compile time; vector can grow dynamically","vector is faster than array","array is from C, vector is from C++"],a:1},
]}/>
</>)},

// ═══════ 6.4 ELECTRONIC TRADING (FIX) ═══════
{title:"Electronic Trading & FIX Protocol",content:(<>
<P>The professor uses electronic trading as a case study showing C++ OOP concepts in real-world systems. The focus is on C++ design patterns, not trading strategy.</P>

<H>FIX Protocol (Financial Information eXchange)</H>
<P>A standardized language for electronic communication between trading firms, brokers, and exchanges. Messages are composed of tag-value fields: tag 55 = symbol ("MSFT"), tag 54 = side (1=buy, 2=sell), tag 38 = quantity.</P>

<H>OOP Concepts in Trading Systems</H>
<P>Every C++ concept from this course appears directly in trading systems:</P>

<Step n={1} title="Classes → Orders, Messages, Sessions">
Each FIX concept is modeled as a class.
</Step>

<Step n={2} title="Inheritance → Message class hierarchy">
<Hierarchy root="Message (base)" children={["NewOrderSingle","OrderCancelRequest","OrderCancelReplaceRequest"]}/>
<P>Common fields (sender, target, timestamp) in Message base. Each derived class adds specific fields for its business action.</P>
</Step>

<Step n={3} title="Polymorphism → Application callbacks handle different message types">
<AnnotatedCode lines={[
  {code:"class Application {",why:"ABSTRACT base class — every QuickFIX application must implement this."},
  {code:"public:",why:""},
  {code:"    virtual void fromApp(const Message& msg, const SessionID& id) = 0;",why:"PURE VIRTUAL: called when a business message arrives. Each application provides its own handling logic."},
  {code:"    // ... other callbacks: toApp, onLogon, onLogout ...",why:"Event-driven design: the application REACTS to events."},
  {code:"};",why:""},
]}/>
</Step>

<Step n={4} title="Namespaces → FIX protocol versions">
<AnnotatedCode lines={[
  {code:"FIX40::NewOrderSingle order40;",why:"FIX version 4.0 order."},
  {code:"FIX42::NewOrderSingle order42;",why:"FIX version 4.2 order. Same class name, different namespace."},
  {code:"FIX44::NewOrderSingle order44;",why:"FIX version 4.4. Namespaces let the protocol evolve without name clashes."},
]}/>
</Step>

<P>The professor noted: "I don't think trading specifics will be on the exam. But the OOP concepts demonstrated through these applications are key."</P>

<Quiz questions={[
  {q:"In QuickFIX, different FIX versions (4.0, 4.2, 4.4) use:",o:["Different class names","Namespaces (FIX40::, FIX42::, FIX44::)","Templates","Inheritance only"],a:1},
  {q:"The Application class in QuickFIX is:",o:["Concrete","Abstract — trading apps must override its pure virtual callbacks","A struct","A template"],a:1},
  {q:"The FIX trading system demonstrates multiple C++ concepts. Which of the following OOP features does it use?\n\nA. Inheritance (Message → NewOrderSingle)\nB. Polymorphism (virtual fromApp callback)\nC. Namespaces (FIX40::, FIX42::)\nD. Encapsulation (private order fields)",o:["A and B only","A, B, C only","A, B, C, D — all four","C and D only"],a:2,e:"The FIX system uses inheritance for message types, polymorphism for application callbacks, namespaces for protocol versions, and encapsulation for data protection."},
  {q:"Briefly, two key differences between pointers and references in C++ are:\n\nA. A pointer can be nullptr; a reference must be bound to a valid object.\nB. A pointer can be reassigned; a reference cannot be re-bound.\nC. References are faster than pointers.\nD. Pointers use more memory than references.",o:["A and B","C and D","A, B, C, D","A and C"],a:0,e:"The two fundamental differences: (1) nullability — pointers can be null, references cannot. (2) rebindability — pointers can be reassigned, references are bound once."},
]}/>
</>)},

// ═══════ 6.5 MONTE CARLO VaR/ES ═══════
{title:"Monte Carlo for Risk Metrics (VaR/ES)",content:(<>
<H>Value-at-Risk (VaR)</H>
<P>"What is the maximum loss we expect to incur over one trading day with 99% confidence?" VaR answers this: at the 99% level, losses should not exceed $X.</P>

<H>Expected Shortfall (ES / CVaR)</H>
<P>The average loss in the tail BEYOND VaR. Addresses VaR's limitation: VaR tells you the threshold but not how bad it gets past that threshold.</P>

<H>Monte Carlo Approach</H>
<Flowchart title="MC VaR Skeleton" steps={[
  {label:"1. Simulate",items:["Many 1-day return","scenarios per asset","using GBM"],color:C.b},
  {label:"2. Aggregate",items:["Portfolio returns","= weighted sum","of asset returns"],color:C.o},
  {label:"3. Estimate",items:["Sort P&L","VaR = percentile","ES = mean of tail"],color:C.g},
]}/>

<H>Why Correlation Matters</H>
<P>Assuming assets are independent underestimates risk. Real assets move together. To model dependence:</P>
<P>1. Estimate covariance matrix from historical data</P>
<P>2. Generate correlated random shocks using <B>Cholesky decomposition</B></P>
<P>Eigen supports Cholesky: <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>Eigen::LLT</code> or <code style={{background:"rgba(255,255,255,0.08)",padding:"2px 6px",borderRadius:4}}>Eigen::LDLT</code></P>

<Confusion mistake="Assuming portfolio assets are independent in VaR calculation" why="Real assets are correlated — they tend to fall together during crises. Ignoring correlations severely underestimates portfolio risk. Use historical covariance + Cholesky decomposition to generate correlated scenarios."/>
</>)},

// ═══════ 6.6 FINAL EXAM REVIEW ═══════
{title:"Final Exam Review",content:(<>
<Prof>"This course is not about writing code. It is about how we approach a problem. Class design is the important part, the hard part. Anyone can write code."</Prof>

<Exam>
<B>CRITICAL:</B> Use implementations EXACTLY as taught in class. Different approaches lose points. The exam tests whether you understood what was taught, not alternative methods.
</Exam>

<H>Exam Format</H>
<P>Open book, in-person. Part A: paper-based (essay + short answer). Part B: multiple choice (Canvas, first-fit — can't go back). Part C: programming on computer (~1 hour, one project with several parts).</P>

<H>Complete Topic List for Final</H>
<Tip title="All Testable Topics">
<B>Lecture 1:</B> Quality metrics (5), data types (int/double/float/bool/char/string), const, static_cast, prefix vs postfix, type aliases, functions (overloading, header/source split), build process (preprocess→compile→link), references (what + why + const ref), pointers (4 const cases), arrays{"\n\n"}
<B>Lecture 2:</B> Classes (data members, member functions, constructors, destructor, member initializer list), coding standard, protection levels (public/private/protected), encapsulation and data abstraction, struct vs class, include guards (#ifndef + #pragma once), templates (function + class), STL containers (vector, map, pair), iterators (begin/end, auto, range-based for), control flow (if/else, switch, enum, for, while, do-while){"\n\n"}
<B>Lecture 3:</B> 6 special member functions, copy constructor (const ref param), this pointer, assignment operator (return *this, self-assignment check), move semantics (rvalue ref &&, std::move), =default/=delete, static members, automatic vs freestore objects, new/delete, smart pointers (shared_ptr make_shared, unique_ptr, weak_ptr), RAII{"\n\n"}
<B>Lecture 4:</B> File I/O (ifstream/ofstream, RAII), cerr/clog, string streams (istringstream), CSV parsing (two-loop getline pattern, stod), STL algorithms (accumulate, find, count, sort), exceptions (throw/try/catch, runtime_error, catch by const ref), const member functions, mutable, operator{"<<"} overloading (non-member friend), Scott Meyers quote{"\n\n"}
<B>Lectures 5-7:</B> Inheritance (base/derived, IS-A), virtual/pure virtual/abstract, override, virtual destructor, Black-Scholes formulas (d1, d2, N(x) via erf, Greeks), option class hierarchy, unit testing (Catch2, Approx), polymorphism (base pointer/ref → correct derived function at runtime), MC pricer (GBM, mt19937 + normal_distribution, payoff via polymorphism), exception hierarchy (first-fit rule, catch by ref to avoid slicing), binomial tree (Node struct, vector{"<vector<Node>>"}, 4-step algorithm, European vs American intermediate payoff), vector internals (capacity/size, reserve/resize), PricingEngine hierarchy{"\n\n"}
<B>Lectures 8-9:</B> Linear regression with Eigen (Householder QR, fit/predict), Eigen::Map, std::span, RL concepts (Q-table, Monte Carlo episodes, backward update), STL container comparison (array vs vector vs list vs map), FIX protocol (OOP concepts: inheritance, polymorphism, namespaces), VaR/ES concepts
</Tip>

<H>Key Interview Questions the Professor Mentioned</H>
<P>1. What is a reference? Why use a reference? (2 reasons + const ref)</P>
<P>2. What are include guards? What is the One Definition Rule?</P>
<P>3. What is the difference between class and struct?</P>
<P>4. What are the benefits of encapsulation and data abstraction?</P>
<P>5. Write a function to swap two variables</P>
<P>6. Pointers and const: the 4 cases (left/right of *)</P>
<P>7. What is polymorphism? Why is it useful?</P>
<P>8. Why catch exceptions by reference? (slicing, polymorphism)</P>
<P>9. What is RAII? (Name, meaning, examples: shared_ptr, ifstream)</P>

<Flowchart title="Concept Chain: How Everything Connects" steps={[
  {label:"Types & Funcs",items:["Fundamental types","Functions","References, Pointers"],color:C.g},
  {label:"Classes & OOP",items:["Encapsulation","Templates → STL","Special members"],color:C.b},
  {label:"Memory & I/O",items:["Smart pointers","RAII","File I/O, Exceptions"],color:C.o},
  {label:"Inheritance",items:["virtual / abstract","Polymorphism","Option hierarchy"],color:C.accent},
  {label:"Applications",items:["BS / MC / Tree","Regression / RL","Trading / VaR"],color:C.y},
]}/>

<Checklist items={[
  "I can list all 5 quality metrics",
  "I know all fundamental types and when to use double vs int",
  "I understand references (alias, const ref for performance)",
  "I know pointers: *, &, nullptr, and all 4 const cases",
  "I can write a complete class with coding standard",
  "I use member initializer lists in constructors",
  "I understand public/private/protected",
  "I can explain encapsulation and data abstraction",
  "I know struct vs class (default access only)",
  "I can write include guards (#ifndef and #pragma once)",
  "I understand function and class templates",
  "I can use vector, map, pair, and iterators",
  "I know all 6 special member functions (construct, destruct, copy, assign, move construct, move assign)",
  "I understand this pointer, *this, return *this for chaining",
  "I know move semantics: rvalue ref, std::move = cast not move",
  "I can use shared_ptr (make_shared) and explain RAII",
  "I can read CSV files with getline + istringstream + delimiter",
  "I know STL algorithms: accumulate, find, count, sort",
  "I can throw/try/catch exceptions by const reference",
  "I understand const member functions and mutable",
  "I can overload operator<< as a friend non-member",
  "I understand inheritance: base/derived, IS-A, protected members",
  "I know virtual vs pure virtual vs non-virtual",
  "I always use override keyword and virtual destructor",
  "I can explain abstract classes (≥1 pure virtual, cannot instantiate)",
  "I understand polymorphism: base ptr/ref → correct derived function",
  "I know BS formulas: price, d1, d2, N(x), delta, gamma",
  "I can implement MC pricer with GBM and mt19937",
  "I know binomial tree: Node, vector<vector<Node>>, 4 steps, European vs American",
  "I understand vector capacity vs size, reserve vs resize",
  "I can design PricingEngine hierarchy",
  "I know Eigen basics: MatrixXd, VectorXd, Map, colPivHouseholderQr",
  "I understand Q-table RL: episodes, backward update, exploration",
  "I know container tradeoffs: array vs vector vs list vs map",
  "I recognize OOP patterns in FIX/trading: inheritance, polymorphism, namespaces",
]}/>
</>)}
]};

export default module6;
