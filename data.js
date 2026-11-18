/**
 * Master Study Data - Exact Individual Lecture Curriculum
 * Target Timeline: 20 May 2026 to June 2027
 * All 1,345 individual lectures mapped directly per subject & chapter
 * 15 Mock Test Exam Streams (1,243 total test papers)
 */

const STUDY_DATA = {
  metadata: {
    title: "Mission 2026-2027: Master Government Exam Preparation Tracker",
    startDate: "2026-05-20",
    endDate: "2027-06-30"
  },

  // 18 Subjects Reference with exact individual lecture counts
  subjects: [
    {
      id: "vocab",
      name: "Vocabulary",
      category: "English",
      code: "VOCAB",
      color: "#6366f1",
      icon: "📚",
      totalLectures: 87,
      topics: [
        { name: "One Word Substitution", count: 28 },
        { name: "Idioms and Phrases", count: 19 },
        { name: "Phrasal Verb", count: 13 },
        { name: "Antonyms and Synonyms", count: 27 }
      ]
    },
    {
      id: "grammar",
      name: "English Grammar",
      category: "English",
      code: "ENG_GRAMMAR",
      color: "#4f46e5",
      icon: "✍️",
      totalLectures: 88,
      topics: [
        { name: "English Grammar Core (Parts of Speech, Tenses, Voice, Narration, Syntax)", count: 88 }
      ]
    },
    {
      id: "reasoning",
      name: "Reasoning",
      category: "Reasoning",
      code: "REAS",
      color: "#ec4899",
      icon: "🧩",
      totalLectures: 110,
      topics: [
        { name: "Direction and Distance", count: 8 },
        { name: "Alphabet Test", count: 7 },
        { name: "Blood Relation", count: 5 },
        { name: "Ranking", count: 5 },
        { name: "Clock", count: 7 },
        { name: "Series", count: 5 },
        { name: "Calendar", count: 6 },
        { name: "Dice", count: 4 },
        { name: "Inequality", count: 3 },
        { name: "Sitting Arrangement", count: 5 },
        { name: "Coding Decoding", count: 6 },
        { name: "Venn Diagram", count: 3 },
        { name: "Syllogism", count: 6 },
        { name: "Cube", count: 3 },
        { name: "Top 100 Question", count: 1 },
        { name: "Data Sufficiency", count: 2 },
        { name: "Analogy", count: 3 },
        { name: "Statement and Assumption", count: 3 },
        { name: "Statement and Argument", count: 2 },
        { name: "Statement and Conclusion", count: 1 },
        { name: "Statement and Course of Action", count: 1 },
        { name: "Classification", count: 2 },
        { name: "Mathematical Operation", count: 1 },
        { name: "Missing Number", count: 2 },
        { name: "Decision Making", count: 1 },
        { name: "Cuboid", count: 2 },
        { name: "Puzzle Test", count: 2 },
        { name: "Mathematical Reasoning", count: 1 },
        { name: "Counting of Figures", count: 3 },
        { name: "Series (Part 2)", count: 2 },
        { name: "Analogy (Part 2)", count: 1 },
        { name: "Mirror and Water Image", count: 1 },
        { name: "Paper Cutting", count: 1 },
        { name: "Classification (Part 2)", count: 1 },
        { name: "Embedded Figure", count: 1 },
        { name: "Completion of Figure", count: 1 },
        { name: "Grouping of Figures", count: 1 },
        { name: "Figure Formation", count: 1 }
      ]
    },
    {
      id: "physics",
      name: "Physics",
      category: "Science",
      code: "SCI_PHY",
      color: "#f59e0b",
      icon: "⚡",
      totalLectures: 46,
      topics: [
        { name: "General Physics (Mechanics, Optics, Waves, Electricity, Magnetism, Modern)", count: 46 }
      ]
    },
    {
      id: "chemistry",
      name: "Chemistry",
      category: "Science",
      code: "SCI_CHEM",
      color: "#eab308",
      icon: "🧪",
      totalLectures: 37,
      topics: [
        { name: "General Chemistry (Matter, Atomic Structure, Periodic Table, Chemical Reactions)", count: 37 }
      ]
    },
    {
      id: "biology",
      name: "Biology",
      category: "Science",
      code: "SCI_BIO",
      color: "#10b981",
      icon: "🧬",
      totalLectures: 44,
      topics: [
        { name: "General Biology (Cell Biology, Physiology, Genetics, Botany, Disease)", count: 44 }
      ]
    },
    {
      id: "geography",
      name: "Geography",
      category: "General Studies",
      code: "GS_GEO",
      color: "#14b8a6",
      icon: "🌍",
      totalLectures: 60,
      topics: [
        { name: "Indian & World Geography (Physical, Rivers, Climate, Agriculture, Continents)", count: 60 }
      ]
    },
    {
      id: "economics",
      name: "Economics",
      category: "General Studies",
      code: "GS_ECO",
      color: "#84cc16",
      icon: "📈",
      totalLectures: 49,
      topics: [
        { name: "Indian Economy & Macroeconomics (Banking, Budget, National Income, Inflation)", count: 49 }
      ]
    },
    {
      id: "static_gk",
      name: "Static GK",
      category: "General Studies",
      code: "GS_STATIC",
      color: "#a855f7",
      icon: "🏆",
      totalLectures: 25,
      topics: [
        { name: "Static General Knowledge (Folk Dances, Festivals, Monuments, First in India, Awards)", count: 25 }
      ]
    },
    {
      id: "history",
      name: "History (Ancient & Medieval)",
      category: "General Studies",
      code: "GS_HIST",
      color: "#d97706",
      icon: "🏛️",
      totalLectures: 60,
      topics: [
        { name: "Ancient & Medieval Indian History (Indus, Vedic, Mauryas, Delhi Sultanate, Mughals)", count: 60 }
      ]
    },
    {
      id: "polity",
      name: "Polity",
      category: "General Studies",
      code: "GS_POLITY",
      color: "#8b5cf6",
      icon: "⚖️",
      totalLectures: 54,
      topics: [
        { name: "Indian Polity & Constitution (Preamble, Fundamental Rights, Parliament, Judiciary)", count: 54 }
      ]
    },
    {
      id: "computer",
      name: "Computer",
      category: "General Studies",
      code: "GS_COMP",
      color: "#64748b",
      icon: "💻",
      totalLectures: 21,
      topics: [
        { name: "Computer Knowledge (Hardware, Software, Networking, MS Office, Shortcuts, Cyber)", count: 21 }
      ]
    },
    {
      id: "hindi",
      name: "Hindi",
      category: "Languages",
      code: "LANG_HINDI",
      color: "#f43f5e",
      icon: "📖",
      totalLectures: 100,
      topics: [
        { name: "General Hindi & Grammar (Sandhi, Samas, Ras, Alankar, Muhavare, Vartani, Sahitya)", count: 100 }
      ]
    },
    {
      id: "modern_history",
      name: "Modern History",
      category: "General Studies",
      code: "GS_MOD_HIST",
      color: "#b45309",
      icon: "📜",
      totalLectures: 62,
      topics: [
        { name: "Modern Indian History & Freedom Struggle (1857 Revolt, Congress, Gandhian Era, Acts)", count: 62 }
      ]
    },
    {
      id: "arithmetic",
      name: "Arithmetic Math",
      category: "Mathematics",
      code: "MATH_ARITH",
      color: "#06b6d4",
      icon: "➗",
      totalLectures: 183,
      topics: [
        { name: "Number System", count: 22 },
        { name: "LCM and HCF", count: 13 },
        { name: "Ratio and Proportion", count: 13 },
        { name: "Partnership", count: 7 },
        { name: "Average", count: 12 },
        { name: "Percentage", count: 20 },
        { name: "Profit and Loss", count: 16 },
        { name: "Discount", count: 7 },
        { name: "Simple Interest", count: 8 },
        { name: "Digital Sum", count: 4 },
        { name: "Compound Interest", count: 10 },
        { name: "Installment", count: 4 },
        { name: "Time Speed and Distance", count: 11 },
        { name: "Problems on Train", count: 8 },
        { name: "Boat and Stream", count: 4 },
        { name: "Race", count: 4 },
        { name: "Mixture and Allegation", count: 7 },
        { name: "Time and Work", count: 8 },
        { name: "Pipe and Cistern", count: 5 }
      ]
    },
    {
      id: "advanced_math",
      name: "Advanced Mathematics",
      category: "Mathematics",
      code: "MATH_ADV",
      color: "#0ea5e9",
      icon: "📐",
      totalLectures: 66,
      topics: [
        { name: "Mensuration 2D", count: 15 },
        { name: "Polygon", count: 1 },
        { name: "Mensuration 3D", count: 12 },
        { name: "Geometry", count: 20 },
        { name: "Trigonometry", count: 9 },
        { name: "Height and Distance", count: 3 },
        { name: "Algebra", count: 6 }
      ]
    },
    {
      id: "extra_math",
      name: "Extra Mathematics",
      category: "Mathematics",
      code: "MATH_EXTRA",
      color: "#3b82f6",
      icon: "📊",
      totalLectures: 3,
      topics: [
        { name: "Probability", count: 1, duration: "7 Hrs" },
        { name: "Permutation and Combination", count: 1, duration: "6 Hrs" },
        { name: "Statistics", count: 1, duration: "7 Hrs" }
      ]
    },
    {
      id: "current_affairs",
      name: "Current Affairs",
      category: "General Studies",
      code: "GS_CA",
      color: "#059669",
      icon: "📰",
      totalLectures: 250,
      topics: [
        { name: "Monthly Current Affairs (National & International)", count: 100 },
        { name: "Government Schemes, Policies & Summits", count: 40 },
        { name: "Economy, Banking, Budget & Economic Survey", count: 35 },
        { name: "Science, Technology, Defense & Space Missions", count: 25 },
        { name: "Sports, Awards, Honours & Personalities in News", count: 25 },
        { name: "State Current Affairs & Miscellaneous", count: 25 }
      ]
    }
  ],

  // 15 Mock Tests & Question Practice Exam Streams (Exact match from Reference Image 3)
  mockSeries: [
    { id: "ssc_cgl_t1", name: "SSC CGL TIER 1", count: 213, sNoRange: "1 - 213", color: "#3b82f6" },
    { id: "ssc_cgl_t2", name: "SSC CGL TIER 2", count: 50, sNoRange: "214 - 263", color: "#1d4ed8" },
    { id: "ssc_cpo_t1", name: "SSC CPO TIER 1", count: 52, sNoRange: "264 - 314", color: "#059669" },
    { id: "ssc_cpo_t2", name: "SSC CPO TIER 2", count: 10, sNoRange: "315 - 324", color: "#047857" },
    { id: "ssc_chsl_t1", name: "SSC CHSL TIER 1", count: 189, sNoRange: "325 - 513", color: "#d97706" },
    { id: "ssc_chsl_t2", name: "SSC CHSL TIER 2", count: 10, sNoRange: "514 - 523", color: "#b45309" },
    { id: "selection_post", name: "SELECTION POST", count: 15, sNoRange: "524 - 538", color: "#7c3aed" },
    { id: "ssc_gd", name: "SSC GD CONST", count: 173, sNoRange: "539 - 711", color: "#db2777" },
    { id: "ssc_mts", name: "SSC MTS", count: 136, sNoRange: "712 - 847", color: "#ea580c" },
    { id: "up_constable", name: "UP POLICE CONST", count: 50, sNoRange: "848 - 897", color: "#e11d48" },
    { id: "upsi", name: "UP POLICE SI", count: 65, sNoRange: "898 - 962", color: "#dc2626" },
    { id: "rrb_ntpc", name: "RRB NTPC", count: 100, sNoRange: "963 - 1062", color: "#0284c7" },
    { id: "railway_grp_d", name: "RAILWAY GROUP D", count: 100, sNoRange: "1063 - 1162", color: "#0f766e" },
    { id: "upssc_pet", name: "UPSSC PET", count: 60, sNoRange: "1163 - 1222", color: "#4f46e5" },
    { id: "ib_exam", name: "IB", count: 20, sNoRange: "1223 - 1242", color: "#475569" }
  ]
};

/**
 * Generates the EXACT INDIVIDUAL LECTURES (No batching!)
 * Each single lecture is given its own individual row with 4 milestone stages.
 * Total = 1,345 individual lectures across all 18 subjects!
 */
function generateLectureRows() {
  const rows = [];
  let globalSNo = 1;

  STUDY_DATA.subjects.forEach(subject => {
    subject.topics.forEach(topic => {
      for (let lecIndex = 1; lecIndex <= topic.count; lecIndex++) {
        const paddedLecNum = String(lecIndex).padStart(2, '0');
        const paddedTotal = String(topic.count).padStart(2, '0');
        
        let title = `${topic.name} - Lecture ${paddedLecNum} of ${paddedTotal}`;
        if (topic.duration) {
          title += ` [${topic.duration}]`;
        }

        rows.push({
          sNo: globalSNo,
          title: title,
          rawTitle: `${subject.name} - ${topic.name}`,
          subjectId: subject.id,
          subtopic: topic.name,
          lectureNumber: lecIndex,
          topicTotalLectures: topic.count
        });

        globalSNo++;
      }
    });
  });

  return rows;
}
