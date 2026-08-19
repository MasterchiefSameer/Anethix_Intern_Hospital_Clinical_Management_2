# Mongoose Update Patterns: `findById + save()` vs `findByIdAndUpdate + $set`

> **Question Rephrased (English)**:  
> *"What is the technical and architectural difference between updating a user document using `findById()` followed by `.save()` versus using `findByIdAndUpdate()` with `$set` and ES6 Rest Destructuring? How does each pattern work under the hood, and how should a software engineer choose between them?"*

---

## 1. Code Comparison (Side-by-Side)

### Approach 1: The Old Code (`findById` + Property Mutation + `user.save()`)

```javascript
// Old Controller Implementation
const updateUserProfile = async (req, res, next) => {
    try {
        // Step 1: Query MongoDB to find the user
        const user = await User.findById(req.user._id);

        if (user) {
            // Step 2: Manually mutate each property one by one
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.phone !== undefined) user.phone = req.body.phone;
            if (req.body.gender !== undefined) user.gender = req.body.gender;
            if (req.body.dob !== undefined) user.dob = req.body.dob;
            if (req.body.bloodGroup !== undefined) user.bloodGroup = req.body.bloodGroup;
            if (req.body.address !== undefined) user.address = req.body.address;
            if (req.body.city !== undefined) user.city = req.body.city;
            if (req.body.state !== undefined) user.state = req.body.state;
            if (req.body.pincode !== undefined) user.pincode = req.body.pincode;
            if (req.body.languages !== undefined) user.languages = req.body.languages;
            if (req.body.emergencyContact !== undefined) user.emergencyContact = req.body.emergencyContact;

            // Password update (triggers pre('save') hook in Schema)
            if (req.body.password) {
                user.password = req.body.password;
            }

            // Step 3: Save back to MongoDB
            const updatedUser = await user.save();

            // Step 4: Manually construct response object to hide password
            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                gender: updatedUser.gender,
                dob: updatedUser.dob,
                bloodGroup: updatedUser.bloodGroup,
                address: updatedUser.address,
                city: updatedUser.city,
                state: updatedUser.state,
                pincode: updatedUser.pincode,
                languages: updatedUser.languages,
                emergencyContact: updatedUser.emergencyContact,
                createdAt: updatedUser.createdAt,
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};
```

---

### Approach 2: The New Code (`findByIdAndUpdate` + `$set` + ES6 Destructuring)

```javascript
// New Modern Controller Implementation
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const updateUserProfile = async (req, res, next) => {
    try {
        const updateData = {};

        // Step 1: Whitelist allowed fields (Mass Assignment Protection)
        const allowedFields = [
            'name', 'email', 'phone', 'gender', 'dob',
            'bloodGroup', 'address', 'city', 'state',
            'pincode', 'languages', 'emergencyContact',
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] = req.body[field];
            }
        });

        // Step 2: Explicitly hash password if provided
        if (req.body.password) {
            updateData.password = bcrypt.hashSync(req.body.password, 10);
        }

        // Step 3: Single Atomic MongoDB Update Query
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: updateData,
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            res.status(404);
            throw new Error('User not found');
        }

        // Step 4: ES6 Rest Destructuring to strip sensitive password
        const { password, ...rest } = updatedUser._doc;

        // Step 5: Send clean payload
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};
```

---

## 2. In-Depth Engineering Concepts (Explained Simply)

### Concept 1: Database Round-Trips (Performance)
- **Approach 1 (`findById` + `save()`)**:
  - Trip 1: Node.js asks MongoDB: *"Find user with id 123"* $\rightarrow$ MongoDB returns user object.
  - Trip 2: Node.js modifies the object in memory and asks MongoDB: *"Save this modified user document back"*.
  - *Result*: **2 Database round-trips**.
- **Approach 2 (`findByIdAndUpdate`)**:
  - Trip 1: Node.js tells MongoDB: *"Find user 123, apply these field updates (`$set`), and return the updated version immediately"*.
  - *Result*: **1 Single Atomic Database Operation**. This is faster and reduces database lock contention.

---

### Concept 2: Security & Mass Assignment Protection
What if a malicious user inspects your API and sends a request like this:
```json
{
  "name": "Ramesh",
  "role": "Super Admin"   <-- MALICIOUS FIELD INJECTION!
}
```
If you blindly do `User.findByIdAndUpdate(id, req.body)`, the attacker would become a Super Admin!

#### The Fix in New Code:
```javascript
const allowedFields = ['name', 'email', 'phone', 'gender', 'dob', 'bloodGroup', 'address', 'city', 'state', 'pincode', 'languages', 'emergencyContact'];

allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
    }
});
```
By looping through only `allowedFields`, any injected keys like `role`, `_id`, `createdAt`, or `isVerified` are **completely ignored**.

---

### Concept 3: Why do we need `bcrypt.hashSync` here?
In your Mongoose schema, you likely have a pre-save hook:
```javascript
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
});
```
- **Important Gotcha**: `pre('save')` hooks **ONLY run when `.save()` is called**.
- `findByIdAndUpdate()` directly executes a MongoDB driver command and **bypasses Mongoose document hooks**.
- Therefore, in Approach 2, we must manually hash the password before sending it to `$set`:
```javascript
if (req.body.password) {
    updateData.password = bcrypt.hashSync(req.body.password, 10);
}
```

---

### Concept 4: The Query Options (`{ new: true, runValidators: true }`)
```javascript
await User.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
```
1. **`new: true`**:
   - Default behavior in MongoDB: Returns the document *before* the update took place.
   - With `{ new: true }`: Returns the freshly updated document.
2. **`runValidators: true`**:
   - Default behavior: Schema validation rules (e.g. `enum: ['A+', 'B+', ...]`) are only checked on creation, not updates.
   - With `{ runValidators: true }`: MongoDB validates the updated values against your Mongoose Schema rules.

---

### Concept 5: ES6 Rest Destructuring (`updatedUser._doc`)
Instead of manually typing out 15 lines of properties to return:
```javascript
// Old Way: 15+ manual lines
res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    // ... repetitive lines ...
});
```
We use JavaScript ES6 object destructuring:
```javascript
// New Way: Clean and Automatic
const { password, ...rest } = updatedUser._doc;
res.status(200).json(rest);
```

#### How it works:
1. `updatedUser._doc` is the raw JavaScript object containing all MongoDB fields: `{ _id, name, email, password: 'hashed_password', bloodGroup, ... }`.
2. `password` extracts the hashed password into its own variable.
3. `...rest` (spread/rest operator) collects **every other property** into a new object called `rest`.
4. We send `rest` to the frontend, guaranteeing the password hash is never exposed over the network.

---

## 4. Advanced: Route Parameter (`req.params.id`) vs Middleware Token (`req.user._id`)

When you define a parameterized route like:
```javascript
// routes/userRoutes.js
router.route('/profile/:id')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
```

### Why we add the ID verification check:
```javascript
// controllers/UserController.js
export const updateUserProfile = async (req, res, next) => {
    try {
        const targetId = req.params.id || req.user._id;

        // Security Check (Ownership Validation)
        if (req.params.id && req.user._id.toString() !== req.params.id && req.user.role !== 'Super Admin') {
            res.status(401);
            throw new Error('You can only update your own profile');
        }

        // ... update logic ...
    }
}
```

#### Why is this necessary? (Broken Object Level Authorization - BOLA / IDOR Protection)
1. `req.user._id` comes from the **secure verified JWT token** (the person who is currently logged in).
2. `req.params.id` comes from the **URL parameter** (e.g. `/api/user/profile/64f89b...`).
3. If User A (ID: `111`) tries to send a PUT request to `/api/user/profile/222` (User B's ID), the check `req.user._id.toString() !== req.params.id` prevents User A from maliciously modifying User B's profile!

---

## 5. Software Engineer Takeaway Summary (Quick Notes)

1. **`findByIdAndUpdate` is atomic**: It runs directly in the MongoDB engine in a single round-trip.
2. **`pre('save')` hooks don't run on `findByIdAndUpdate`**: That's why you hash passwords explicitly with `bcrypt.hashSync()`.
3. **Whitelist fields**: Never pass `req.body` directly to MongoDB update; only extract `allowedFields`.
4. **`_doc` Destructuring**: `const { password, ...rest } = updatedUser._doc` is the cleanest, most modern way in JavaScript to omit sensitive keys before sending the response to the frontend.

---
*Document created and finalized for MedTrust Healthcare Management System reference.*

