# OpenSpec (OPSX) Commands & Workflow Guide

This document outlines the standard AI workflow commands (`/opsx` or `/openspec`) used in the project, their specific functions, and the standard lifecycle of a software change.

## 1. Planning & Thinking Commands

*   **`/opsx-explore`**
    *   **Purpose:** The "Thinking Partner" mode.
    *   **Usage:** Used to brainstorm ideas, discuss system architecture, visualize state machines, or solve problems *without* writing any code or modifying core files. It is purely an exploration phase.
*   **`/opsx-propose`**
    *   **Purpose:** The "Planning" mode.
    *   **Usage:** Once an idea is solid, this command scaffolds the entire plan. It automatically generates the required OpenSpec artifacts (`proposal.md`, `specs.md`, `design.md`, `tasks.md`) so that the architectural blueprint is ready before implementation begins.

## 2. Coding & Execution Commands

*   **`/opsx-apply`** (or `/openspec-apply-change`)
    *   **Purpose:** The "Implementation" mode.
    *   **Usage:** Instructs the IDE agent to read the `tasks.md` checklist and begin writing/editing actual application code (React, Node.js, etc.) to build the proposed feature.
*   **`/opsx-update`** (or `/openspec-update-change`)
    *   **Purpose:** The "Plan Revision" mode.
    *   **Usage:** If requirements change mid-way through coding (e.g., deciding to add a new button or rule), this command safely updates the planning markdown files without breaking existing code.

## 3. Finishing & Cleanup Commands

*   **`/opsx-archive`** (or `/openspec-archive-change`)
    *   **Purpose:** The "Completion" mode.
    *   **Usage:** Run this when a feature is 100% coded and tested. It finalizes the change, merges the new specs into the main documentation, and moves the delta files to an archived state to keep the workspace clean.
*   **`/opsx-sync`** (or `/openspec-sync-specs`)
    *   **Purpose:** The "Documentation Sync" mode.
    *   **Usage:** Updates the main project documentation with the current change's rules without fully archiving/closing the active change.

---

## 4. The Standard Development Lifecycle

To build a professional, fail-safe feature, follow this chronology:
1.  **Think:** `/opsx-explore` (Discuss the idea)
2.  **Plan:** `/opsx-propose` (Generate the blueprint)
3.  **Build:** `/opsx-apply` (Write the code)
4.  **Finish:** `/opsx-archive` (Merge and clean up)

---

## 5. FAQ: Modifying an Archived Change

**Q: If I run `/opsx-archive` to complete a feature, but later decide I want to add something new to it, can I just reopen the archived change?**

**A:** No, you should not reopen an archived change. 

In professional software engineering, "Archiving" is equivalent to merging and closing a Jira ticket. It signifies that Version 1 of the feature is stable and safe. 
If you want to add new functionality later, you create a **new change proposal** (e.g., `/opsx-propose "Add email notifications to the receptionist dashboard"`). 

**Why?**
Building *on top* of archived features via new proposals keeps your project history clean. If the new code breaks, your archived (Version 1) code remains completely safe and functional. It prevents regressions and maintains a clear audit trail of what was built and when.

---

## 6. The IDE Agent Chat (Direct Interaction)

Aside from the structured `/opsx` workflow commands, you also have direct access to the **IDE Agent Chat**. 

### When to use standard Agent Chat vs OPSX Commands?

*   **Standard Agent Chat:** Use this for quick, isolated tasks. 
    *   *Example:* "Explain this React map function", "Fix the CSS alignment on this button", or "Replace the hardcoded dummy doctors with a backend fetch API call."
    *   *Behavior:* The agent acts as a direct pair-programmer, immediately editing code or explaining concepts without creating heavy architectural markdown plans.
*   **OPSX Commands (`/opsx-...`):** Use these for **epic-level features** or major structural changes (like building a whole new Receptionist Dashboard). The commands enforce safety, documentation, and a step-by-step methodology to prevent the codebase from becoming chaotic.
