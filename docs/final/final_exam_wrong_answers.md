# C++ Final Exam — Incorrect Questions

---

## Question 4 (0/2 pts)

**Which of the following lists correctly includes Modern C++ features that we have used in this course?**

- A. distributions, `std::span`, `std::numbers::pi`
- B. smart pointers, distributions, RAII, `std::span`
- C. smart pointers, distributions, `std::vector`, `std::span`
- D. smart pointers, distributions, RAII, `std::numbers::pi`

**Your answer:** D  
**Correct answer:** B

**Explanation:** The course used smart pointers (shared pointers), distributions (random number generation), RAII (resource management with smart pointers and file streams), and `std::span` (introduced in C++20 for non-owning views of contiguous data). `std::numbers::pi` was not used in this course. `std::vector` is not a "Modern C++" feature — it predates the modern C++ era (C++11+).

---

## Question 5 (0/2 pts)

**Consider the following C++ program:**

```cpp
#include <iostream>

class Base {
public:
    virtual void func();
};

class Derived : public Base {
public:
    void func() override;
};

void Base::func() {
    std::cout << "Base::func()" << std::endl;
}

void Derived::func() {
    std::cout << "Derived::func()" << std::endl;
}

void call_func(const Base& b) {
    b.func();
}

int main() {
    Derived d;
    call_func(d);
}
```

**Which of the following is correct about this program?**

- A. When executed, it will print: Derived::func()
- B. When executed, it will print: Base::func()
- C. This program will not compile.
- D. The program will compile but produce a runtime error.

**Your answer:** A  
**Correct answer:** C

**Explanation:** The function `call_func` takes a `const Base&`, but `func()` is not declared as `const` in the `Base` class. You cannot call a non-const member function on a const reference. The program will not compile. To fix it, `func()` would need to be declared as `virtual void func() const;` in both the base and derived classes.

---

## Question 9 (0/2 pts)

**Consider the following program:**

```cpp
#include <string>
#include <vector>
#include <iostream>
using namespace std;

class Student {
    Student(std::string name);
private:
    std::string name_;
};

Student::Student(std::string name)
    :name_(name) {
}

int main()
{
    std::vector<Student> students(5);
    cout << "size=" << students.size() << endl;
}
```

**What do you expect to see when this program is run?**

- A) Error at runtime
- B) Won't compile so it won't run
- C) size=5
- D) size=0

**Your answer:** D  
**Correct answer:** B

**Explanation:** Creating `std::vector<Student> students(5)` requires default-constructing 5 `Student` objects. However, the `Student` class only has a constructor taking a `std::string` argument and no default constructor. Since a user-defined constructor exists, the compiler will not generate a default constructor. The program won't compile because `Student` has no default constructor.

---

## Question 10 (0/2 pts)

**Member variables and member functions declared as private in a class can be accessed by:**

- for read, but not write, only by member functions of the same class and its friends
- for read, but not write, only by member functions of any class
- the class itself
- the class itself, any derived class and friend functions
- the class itself and for read only by friend functions

**Your answer:** the class itself and for read only by friend functions  
**Correct answer:** the class itself (and its friend functions, with full read/write access)

**Explanation:** Private members can be accessed (both read and write) by the class's own member functions and by friend functions. They cannot be accessed by derived classes (that requires `protected`). The option "the class itself" is the best answer among the choices. Friend functions get full access (read and write), not read-only.

---

## Question 11 (0/2 pts)

**Consider the following C++ containers: a C-style array, `std::vector`, `std::map`. Which statement about element access is correct?**

- A. All three containers support fast random access using the operator `[]`.
- B. C-style arrays and `std::vector` support constant-time random access by numeric index using the operator `[]`.
- C. `std::vector` and `std::map` support random access, but C-style arrays must be accessed sequentially.
- D. Only `std::map` supports random access because it organizes elements using keys.

**Your answer:** D  
**Correct answer:** B

**Explanation:** C-style arrays and `std::vector` both store elements in contiguous memory, so accessing by numeric index with `[]` is O(1) constant time. `std::map` supports `[]` access by key, but it is O(log n) — not constant-time random access. C-style arrays absolutely support random access (they are the most fundamental random-access container).

---

## Question 12 (0/2 pts)

**Given the following class definition, which methods must a publicly derived class declare and implement in order to be instantiable?**

```cpp
class Base
{
public:
    void func1();
    virtual void func2();
    virtual void func3() = 0;
};
```

**Your answer:** func2()  
**Correct answer:** func3()

**Explanation:** Only pure virtual functions (declared with `= 0`) must be overridden by a derived class for it to be instantiable. `func3()` is the only pure virtual function. `func1()` is a regular non-virtual function (inherited as-is). `func2()` is virtual with a default implementation, so overriding it is optional.

---

## Question 14 (0/2 pts)

**Consider the following program:**

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v;

    for (int i = 0; i < 5; i++) {
        v[i] = i;
    }

    std::cout << "size=" << v.size() << std::endl;
}
```

**What do you expect to see when this program is run?**

- size=5
- Won't compile so it won't run
- Error at runtime
- size=4
- size=0

**Your answer:** size=5  
**Correct answer:** size=0 (or undefined behavior / error at runtime)

**Explanation:** The vector `v` is default-constructed with size 0 and capacity 0. Using `v[i] = i` does **not** increase the vector's size — `operator[]` does not add elements, it accesses existing ones. Since the vector has no elements, accessing `v[0]` through `v[4]` is undefined behavior (writing to memory the vector hasn't allocated for its tracked elements). Even if it doesn't crash, `v.size()` would still return 0 because no elements were properly added (you'd need `push_back` or to construct the vector with a size). The most technically correct answer is **size=0** (if UB doesn't cause a crash first).

---

## Question 15 (0/2 pts)

**Member functions may be overloaded based on:**

- A) whether the member function is const or non-const
- B) input arguments and return value
- C) whether the member function is static or not static
- D) return value

**Your answer:** A, B  
**Correct answer:** A

**Explanation:** In C++, functions can be overloaded based on their parameter types (input arguments) and const qualification. However, functions **cannot** be overloaded based on return type alone. Option B says "input arguments **and** return value" — return value is not a valid basis for overloading. The correct answer is A only: you can overload a member function based on whether it is const or non-const. (You can also overload based on different input argument types, but that wasn't offered as a standalone option.)

---

## Question 16 (0/2 pts)

**An abstract class:**

- A. Has functions which a derived class must define and implement.
- B. Can not be instantiated.
- C. Both A and B.
- D. None of the above.

**Your answer:** C  
**Correct answer:** C

**Note:** This was marked incorrect on the exam, but C (Both A and B) is indeed the correct answer. An abstract class has at least one pure virtual function that derived classes must implement, and it cannot be instantiated directly. You may want to check if there was a grading error or if the expected answer differed for a subtle reason (e.g., option A says "must" but a derived class can also remain abstract if it doesn't implement the pure virtual function — however, in that case it can't be instantiated either).

---

## Question 18 (0/2 pts)

**Suppose you have the following functions:**

```cpp
void swap(int* a, int* b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

void swap(int& a, int& b)
{
    int temp = a;
    a = b;
    b = temp;
}

void swap(int* a)
{
    int temp = a[0];
    a[0] = a[1];
    a[1] = temp;
}
```

**And suppose we want to use the 3 functions above in a program as:**

```cpp
int arr[2];
arr[0] = 0;
arr[1] = 1;
int a = 1;
int b = 2;
swap(arr);         // use case (a)
swap(&a, &b);      // use case (b)
swap(*a, *b);      // use case (c)
```

**Select the statement that best describes the behavior of the program.**

- A. Program will not build because use case (a) is incorrect
- B. Program will not build because use case (b) is incorrect
- C. Program will not build because use case (c) is incorrect
- D. Program will not build because more than one use case above is incorrect
- E. Program builds and runs (all 3 use cases above are correct)

**Your answer:** (not visible in screenshot, but marked incorrect)  
**Correct answer:** C

**Explanation:** Use case (a): `swap(arr)` — `arr` decays to `int*`, which matches `void swap(int* a)`. Correct. Use case (b): `swap(&a, &b)` — passes addresses of `a` and `b`, matching `void swap(int* a, int* b)`. Correct. Use case (c): `swap(*a, *b)` — `a` and `b` are `int` variables (not pointers), so `*a` and `*b` are invalid dereference operations. This will not compile.

---

## Question 21 (0/2 pts)

**Given the Currency class definition below:**

```cpp
class Currency
{
public:
    Currency(string symbol, double rate);
    Currency(const Currency& other);
    Currency& operator=(const Currency& other);
    ~Currency();
private:
    std::string symbol_;
    double rate_;
};
```

**Which operation/operations does the statement, indicated as Line 2, use?**

```cpp
int main()
{
    Currency c1("USD", 1.0);   // Line 1
    Currency c2 = c1;          // Line 2
}
```

- Copy constructor
- Constructor and Assignment Operator
- Assignment Operator
- Copy Constructor and Assignment Operator

**Your answer:** Copy Constructor and Assignment Operator  
**Correct answer:** Copy constructor

**Explanation:** `Currency c2 = c1;` is **copy initialization**, not assignment. Even though it uses the `=` syntax, this is constructing a new object `c2` from `c1`, so it calls the **copy constructor**. The assignment operator is only used when assigning to an already-constructed object (e.g., `c2 = c1;` after `c2` has already been created).

---

## Question 22 (0/2 pts)

**Which statement(s) is/are true about pointers and references in C++?**

- A. A pointer or a reference must be used to get polymorphic behavior.
- B. A pointer or a reference can be used to access a variable indirectly.
- C. A pointer or a reference can be used to avoid copying of objects.
- D. A pointer or a reference can be used to iterate over arrays with equal efficiency.

**Your answer:** A, B, C, D  
**Correct answer:** A, B, C

**Explanation:** Statements A, B, and C are all true and were discussed extensively in the course. Statement D is false — pointers can be used to iterate over arrays efficiently (pointer arithmetic), but references cannot be used to iterate over arrays in the same way. A reference is bound to a single object and cannot be reassigned to point to different array elements like a pointer can.
