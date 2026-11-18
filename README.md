# 🎯 Target 2026-2027: Master Government Exam Preparation Tracker

A responsive, high-performance web application designed from your master study plan PDF. It tracks your complete syllabus across all **17 subjects**, **571 lecture units**, **1,400+ mock papers**, and your **daily timetable**, complete with **real-time subject-wise percentage progress** and **progress-linked daily tasks**.

---

## 🚀 How to Run & Use the Website

1. Navigate to the project directory:
   ```
   C:\Users\ASUS\.gemini\antigravity\scratch\study-todo-tracker\
   ```
2. Double-click or open **`index.html`** in any web browser (Chrome, Edge, Firefox, Safari).
   - *No installation, no npm, and no server required!* It works 100% offline and stores your progress automatically in your browser's local storage.
3. You can also bookmark the page or add it to your home screen on mobile for a native app-like experience.

---

## 🌟 Key Features

### 1. 🎯 Progress-Linked Daily Tasks Component (New!)
- **Direct Link to Subject & Overall Progress**:
  - Plan daily tasks directly linked to specific syllabus lectures or mock test papers.
  - When you mark a daily task as done, the corresponding lecture milestones (🎥 Watch, 📝 Notes, 🔁 Revision, ✍️ Practice) are **automatically marked in the master syllabus**.
  - **Subject percentage meters and overall completion immediately increase in real time!**
- **3 Task Creation Modes**:
  1. **Link from Syllabus**: Pick any subject, select any lecture (out of 571), target specific milestones to complete today, set priority and study slot.
  2. **Link from Mock Tests**: Schedule specific mock tests (e.g., SSC CGL Tier 1 Paper #15, Attempt 1).
  3. **Custom Goals**: Add custom study goals with linked subject tags and time slots.
- **One-Click "Plan for Today" Button**:
  - In the master To-Do Checklist table, every row has a **`+ 📅 Plan`** button to instantly add that lecture to today's goals.
- **Quick Automation**:
  - `⚡ Auto-Add Next 3 Pending Lectures`: Scans your syllabus and auto-populates today's planner with your next incomplete lectures!
  - `⏰ Add Today's 5.5h Study Routine`: Automatically schedules your 3 study blocks from the timetable (10–1pm Lecture Watch, 2–3pm Revision, 9–10:30pm Question Solving).
- **Daily Progress Metrics**:
  - Circular Daily Target Ring (`0% to 100% Today`).
  - Active Daily Consistency Streak Counter (`🔥 X Days Streak`).
  - Date Picker: Plan for today, tomorrow, or review past days.

### 2. 📊 Subject Progress Hub (Percentage for Each Subject)
- **17 Dedicated Subject Cards** matching your PDF:
  - **Vocabulary** (87 lectures: One Word Substitution [28], Idioms & Phrases [19], Phrasal Verbs [13], Antonyms & Synonyms [27])
  - **English Grammar** (88 lectures)
  - **Reasoning** (103 lectures across 38 chapters)
  - **Arithmetic Mathematics** (183 lectures across 19 chapters)
  - **Advanced Mathematics** (66 lectures across 7 chapters)
  - **Extra Mathematics** (Probability [7h], Permutation & Combination [6h], Statistics [7h])
  - **Physics** (46 lectures)
  - **Chemistry** (37 lectures)
  - **Biology** (44 lectures)
  - **Geography** (60 lectures)
  - **Economics** (49 lectures)
  - **History (Ancient & Medieval)** (60 lectures)
  - **Modern History** (62 lectures)
  - **Polity** (54 lectures)
  - **Static GK** (25 lectures)
  - **Computer** (21 lectures)
  - **Hindi** (100 lectures)
- **Real-Time Percentage Form**:
  - Exact overall percentage badge for each subject (e.g. `58.2%`).
  - Animated progress track.
  - Sub-meters for each milestone: **🎥 Watched %**, **📝 Notes %**, **🔁 Revision %**, **✍️ Practice %**.
  - One-click **"View Tasks"** button to jump straight into that subject's checklist.

### 3. 📋 Interactive To-Do Checklist (Pages 4–16 of PDF)
- **571 Complete Lecture Rows** mapped directly from the PDF.
- 4 status checkboxes per item:
  - `Watched` 🎥
  - `Notes` 📝
  - `Revision` 🔁
  - `Question` ✍️
- Dynamic status badge:
  - `Completed` (All 4 checked)
  - `In Progress` (1–3 checked)
  - `Pending` (0 checked)
- Instant Search by topic or lecture name.
- Filter by Subject and Status (Pending, In Progress, Completed).
- Quick **"Done All"** button per row and bulk **"Complete Visible"** button.
- Pagination controls (50 items/page) for ultra-fast performance.

### 4. 📝 Mock Test & PYQ Tracker (Pages 17–50 of PDF)
- Covers all 15 exam categories:
  - SSC CGL Tier 1 (213 papers)
  - SSC CGL Tier 2 (50 papers)
  - SSC CPO Tier 1 (52 papers)
  - SSC CPO Tier 2 (10 papers)
  - SSC CHSL Tier 1 (189 papers)
  - SSC CHSL Tier 2 (10 papers)
  - Selection Post (91 papers)
  - SSC GD Constable (173 papers)
  - SSC MTS (136 papers)
  - RRB NTPC (100 papers)
  - Railway Group D (100 papers)
  - UP Police SI - UPSI (65 papers)
  - UP Police Constable (50 papers)
  - UPSSSC PET (60 papers)
  - IB Exam (20 papers)
- Triple Attempt columns: **Attempt 1**, **Attempt 2**, **Attempt 3** (Date & Marks scored).

### 5. ⏰ Live Daily Timetable & Interactive Schedule (Page 3 of PDF)
- Exact schedule:
  - `06:00 - 09:30` : Work 🤞 (3.5 hrs)
  - `09:30 - 10:00` : Rest 👻 (0.5 hrs)
  - `10:00 - 13:00` : Study Only Lecture Watch 😉 (3.0 hrs)
  - `13:00 - 14:00` : Work + Lunch 👻 (1.0 hr)
  - `14:00 - 15:00` : Revision 😎 (1.0 hr)
  - `15:00 - 17:00` : Coaching 😶 (2.0 hrs)
  - `17:00 - 21:00` : Work 😉 (4.0 hrs)
  - `21:00 - 22:30` : Question Solve 💯 (1.5 hrs)
- **Live Clock & Active Slot Detector**: Highlights which session you should be doing right now.
- **Today's Daily Checklist**: Check off your daily routine as you go.
- Summary breakdown: Sleep 7h, Work 8.5h, Coaching 2h, Study 5.5h { IMPORTANT }.

### 6. 💾 Auto-Save, Export & Extras
- **Auto-Persistence**: Saves every tick mark, note, and score in your browser (`localStorage`).
- **Backup & Portability**: Export your progress as a `.json` file and import it on any phone or PC.
- **Theme Switcher**: Dark Mode and Light Mode.
- **Motivational Touches**: Includes your quotes (*"# WORK COMPLETE >>>> # FUTURE >>>> # DREAMS>>> #ENJOY>>> #HAPPY LIFE"*, *"#BETTER LIFE LOADING..."*) and celebration popups.

---

> `# WORK COMPLETE >>>> # FUTURE >>>> # DREAMS>>> #ENJOY>>> #HAPPY LIFE >>>>……. 💯👻❤️🤞😉`
>
> `#BETTER LIFE LOADING... 💯`
