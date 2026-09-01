# Mongoose Custom Instance Methods: `matchPassword` Explained

> **Question Rephrased (English)**:  
> *"Is `matchPassword` an in-built function in Mongoose/JavaScript or is it a custom developer-defined method? How does it work internally with `bcryptjs`, and what software engineering principles does it follow?"*

---

## 1. Quick Answer

**`matchPassword` is 100% CUSTOM (Developer-Defined).**

It is **NOT** an in-built JavaScript or Mongoose function. It is a **Mongoose Document Instance Method** created using `schema.methods.<customMethodName>`.

---

## 2. Anatomy of the Code

Let's break down the exact lines from [`backend/models/User.js`](file:///f:/Web_D/Projects/Hospital_and%20clinical_management1/backend/models/User.js#L70):

```javascript
// backend/models/User.js

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
```

### Breakdown of each piece:

| Code Part | Technical Classification | Role & Explanation |
| :--- | :--- | :--- |
| `userSchema.methods` | **Mongoose API** | The object where developers attach custom helper functions to every instantiated User document. |
| `.matchPassword` | 🟡 **Custom Identifier** | The name chosen by the developer. You could name it `.verifyPass()`, `.checkPassword()`, or anything you like. |
| `enteredPassword` | **Function Parameter** | The plain-text password sent by the user in the login form (e.g., `"password123"`). |
| `this.password` | **Mongoose Document Context** | `this` refers to the specific user document fetched from MongoDB, and `this.password` is the encrypted bcrypt hash stored in the DB (e.g., `"$2a$10$e8wF9aK9gY3z8N71u..."`). |
| `bcrypt.compare()` | 🔵 **Library Function (`bcryptjs`)** | The actual cryptographic function that re-hashes `enteredPassword` and checks if it matches `this.password`. Returns `true` or `false`. |

---

## 3. Why is it needed? (The Cryptographic Problem)

1. **Passwords are One-Way Hashed**:
   - When a user registers, their password is encrypted using a cryptographic salt:
     $$\text{"password123"} \xrightarrow{\text{bcrypt hash}} \text{"\$2a\$10\$e8wF9aK9gY3z8N71u..."}$$
   - Bcrypt is **one-way**. You **cannot decrypt** the hash back into `"password123"`.

2. **Login Verification**:
   - When the user logs in, they send `"password123"`.
   - `bcrypt.compare("password123", "$2a$10$e8wF9aK9...")` extracts the salt from the stored hash, hashes `"password123"` using the exact same salt, and checks if the two hashes match.
   - If they match $\rightarrow$ `true` (Access Granted).
   - If they differ $\rightarrow$ `false` (Invalid Credentials).

---

## 4. How it is used in the Auth Controller

In [`backend/controllers/authController.js`](file:///f:/Web_D/Projects/Hospital_and%20clinical_management1/backend/controllers/authController.js#L15):

```javascript
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Step 1: Find user document in MongoDB
        const validUser = await User.findOne({ email });

        // Step 2: Call custom instance method on the document
        if (validUser && (await validUser.matchPassword(password))) {
            // Password is correct! Generate token and login
            const token = generateToken(res, validUser._id);
            res.status(200).json({
                _id: validUser._id,
                name: validUser.name,
                email: validUser.email,
                role: validUser.role,
                token: token,
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};
```

---

## 5. Software Engineering Concepts & Best Practices

### 1. Encapsulation (Object-Oriented Programming)
- **Without custom method**: Every controller that deals with passwords would have to import `bcryptjs` and manually write `bcrypt.compare(password, user.password)`.
- **With custom method**: Password validation logic lives strictly inside the `User` model, keeping controllers clean and adhering to the **Single Responsibility Principle (SRP)**.

### 2. Difference: `methods` vs `statics` in Mongoose

| Type | Syntax | Where it is called | Example Use Case |
| :--- | :--- | :--- | :--- |
| **Instance Method** | `schema.methods.fn` | On an individual **document instance** (`user.matchPassword()`). Has access to `this` (document data). | Password check, generating user-specific badges, calculating user age. |
| **Static Method** | `schema.statics.fn` | On the **Model directly** (`User.findByEmail()`). Has access to the whole collection. | Custom multi-document searches, bulk data aggregations. |

---

## 6. Takeaway Summary

```
┌────────────────────────────────────────────────────────┐
│ User Types: "mypassword123"                            │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ Controller: validUser.matchPassword("mypassword123")  │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼ (Custom Instance Method)
┌────────────────────────────────────────────────────────┐
│ bcrypt.compare("mypassword123", validUser.password)    │
└────────────────────────┬───────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
   [ Returns TRUE ]               [ Returns FALSE ]
   Login Success                  Invalid Credentials
```

## 7. What Exactly Does `matchPassword` Return in the End?

At the end of execution, `matchPassword` returns a single **Boolean value**: either **`true`** or **`false`**.

```javascript
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Returns: true (match) OR false (mismatch)
    return await bcrypt.compare(enteredPassword, this.password);
};
```

### The Two Possible Runtime Outcomes:

1. **Scenario A: User entered the CORRECT password** (e.g. `"password123"`):
   - `bcrypt.compare("password123", "$2a$10$e8wF9aK9gY3z8N71u...")` evaluates to **`true`**.
   - `await validUser.matchPassword("password123")` evaluates to **`true`**.
   - The controller's `if (...)` block executes $\rightarrow$ Generates JWT and logs the user in!

2. **Scenario B: User entered the WRONG password** (e.g. `"wrongpass"`):
   - `bcrypt.compare("wrongpass", "$2a$10$e8wF9aK9gY3z8N71u...")` evaluates to **`false`**.
   - `await validUser.matchPassword("wrongpass")` evaluates to **`false`**.
   - The controller's `else` block executes $\rightarrow$ Throws `401 Unauthorized: Invalid email or password`!

---
*Document created for MedTrust Healthcare Management System reference.*

