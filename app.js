/**
 * Master Study To-Do & Progress Tracker Application
 * Mission 2026-2027: Master Government Exam Preparation Tracker
 * 
 * Features:
 * 1. 18 Subjects with live real-time percentage progress
 * 2. Daily Targets Component (Work Tasks & Random Additions - No pre-defined tasks)
 * 3. Daily Timetable Component (Customizable day-by-day - No pre-defined tasks)
 * 4. Master Syllabus 1,345 Individual Lecture Checklist (4 stages per lecture)
 * 5. Mock Tests & PYQs Tracker (15 exam series - 1,243 test papers)
 * 6. Milestone Trophies & Aspirant Rank
 * 7. State persistence (localStorage), JSON Export / Import, Dark/Light Themes
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'mission2026_gov_tracker_v3';

  // 1,345 Individual Lecture Rows generated from data.js
  const masterLectures = generateLectureRows();

  // Fast Subject Lookup Map
  const subjectMap = {};
  STUDY_DATA.subjects.forEach(sub => {
    subjectMap[sub.id] = sub;
  });

  // Helper date functions
  function getTodayDateStr() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getOffsetDateStr(dateStr, offsetDays) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + offsetDays);
    const ny = date.getFullYear();
    const nm = String(date.getMonth() + 1).padStart(2, '0');
    const nd = String(date.getDate()).padStart(2, '0');
    return `${ny}-${nm}-${nd}`;
  }

  function formatDisplayDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Application State
  const state = {
    theme: 'dark',
    activeTab: 'tab-progress',
    
    // Checklist progress: { [sNo]: { watched: bool, notes: bool, revision: bool, question: bool } }
    lectures: {},

    // Mock test scores: { [paperKey]: { a1_mark, a1_date, a2_mark, a2_date, a3_mark, a3_date } }
    mocks: {},

    // Daily Targets: { [dateStr]: [ ...targets... ] } - NO PRE-DEFINED TASKS
    selectedTargetDate: getTodayDateStr(),
    dailyTargets: {},
    dailyFilter: 'ALL', // 'ALL' | 'WORK' | 'STUDY' | 'RANDOM' | 'PENDING' | 'COMPLETED'
    targetMode: 'workstudy', // 'workstudy' | 'random'

    // Daily Timetable: { [dateStr]: [ ...slots... ] } - NO PRE-DEFINED TASKS
    selectedTimetableDate: getTodayDateStr(),
    dailyTimetables: {},

    // Master Syllabus filters
    todoFilter: 'ALL', // 'ALL' | 'DONE' | 'IN_PROGRESS' | 'UNSTARTED'
    todoSearch: '',
    todoSubject: 'ALL',
    currentPage: 1,
    pageSize: 50,

    // Mock Series filter
    selectedMockSeries: STUDY_DATA.mockSeries[0] ? STUDY_DATA.mockSeries[0].id : 'ssc_cgl_t1',
    mockSearch: '',

    // Gamification & streaks
    streak: 1,
    lastActiveDate: getTodayDateStr()
  };

  // DOM Elements Cache
  const DOM = {
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    exportBtn: document.getElementById('exportBtn'),
    importBtn: document.getElementById('importBtn'),
    importFileInput: document.getElementById('importFileInput'),
    printBtn: document.getElementById('printBtn'),
    resetBtn: document.getElementById('resetBtn'),

    // Navigation
    navTabs: document.querySelectorAll('.nav-tab'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    badgeOverallPct: document.getElementById('badgeOverallPct'),
    badgeDailyTasksCount: document.getElementById('badgeDailyTasksCount'),
    badgeTimetableStudyHrs: document.getElementById('badgeTimetableStudyHrs'),
    badgeLectureCount: document.getElementById('badgeLectureCount'),
    badgeMockCount: document.getElementById('badgeMockCount'),

    // Hero Stats
    statOverallPct: document.getElementById('statOverallPct'),
    statStagesDone: document.getElementById('statStagesDone'),
    statLecturesDone: document.getElementById('statLecturesDone'),
    statNotesDone: document.getElementById('statNotesDone'),
    statRevisionDone: document.getElementById('statRevisionDone'),
    statQuestionsDone: document.getElementById('statQuestionsDone'),
    statMocksAttempted: document.getElementById('statMocksAttempted'),
    statTotalLecturesSub: document.getElementById('statTotalLecturesSub'),
    statTotalNotesSub: document.getElementById('statTotalNotesSub'),
    radialProgressCircle: document.getElementById('radialProgressCircle'),
    radialProgressText: document.getElementById('radialProgressText'),
    aspirantRankBadge: document.getElementById('aspirantRankBadge'),
    targetCountdown: document.getElementById('targetCountdown'),

    // Subject Progress Tab (18 Subjects)
    subjectCategoryFilter: document.getElementById('subjectCategoryFilter'),
    subjectCardsGrid: document.getElementById('subjectCardsGrid'),

    // Daily Targets Tab
    dtPrevDayBtn: document.getElementById('dtPrevDayBtn'),
    dailyTaskDatePicker: document.getElementById('dailyTaskDatePicker'),
    dtNextDayBtn: document.getElementById('dtNextDayBtn'),
    todayDateBtn: document.getElementById('todayDateBtn'),
    targetDayName: document.getElementById('targetDayName'),
    selectedDateLabel: document.getElementById('selectedDateLabel'),
    dailyTasksSummaryText: document.getElementById('dailyTasksSummaryText'),
    dailyTasksList: document.getElementById('dailyTasksList'),
    btnModeWorkStudy: document.getElementById('btnModeWorkStudy'),
    btnModeRandom: document.getElementById('btnModeRandom'),
    workStudyTaskForm: document.getElementById('workStudyTaskForm'),
    randomTaskForm: document.getElementById('randomTaskForm'),
    dtWorkStudyTitle: document.getElementById('dtWorkStudyTitle'),
    dtWorkStudyCategory: document.getElementById('dtWorkStudyCategory'),
    dtWorkStudySubject: document.getElementById('dtWorkStudySubject'),
    dtWorkStudyHours: document.getElementById('dtWorkStudyHours'),
    dtWorkStudyPriority: document.getElementById('dtWorkStudyPriority'),
    subjectLinkPreviewBox: document.getElementById('subjectLinkPreviewBox'),
    prevSubjectName: document.getElementById('prevSubjectName'),
    prevCurrentPct: document.getElementById('prevCurrentPct'),
    prevProjectedPct: document.getElementById('prevProjectedPct'),
    prevGainPct: document.getElementById('prevGainPct'),
    dtRandomTitle: document.getElementById('dtRandomTitle'),
    dtRandomCategory: document.getElementById('dtRandomCategory'),
    dtRandomPriority: document.getElementById('dtRandomPriority'),
    dailyFilterChips: document.querySelectorAll('[data-daily-filter]'),
    clearCompletedDailyTasksBtn: document.getElementById('clearCompletedDailyTasksBtn'),
    copyYesterdayPendingBtn: document.getElementById('copyYesterdayPendingBtn'),
    clearAllDateTargetsBtn: document.getElementById('clearAllDateTargetsBtn'),
    dailyStreakCount: document.getElementById('dailyStreakCount'),
    dailyProgressRingCircle: document.getElementById('dailyProgressRingCircle'),
    dailyProgressRingText: document.getElementById('dailyProgressRingText'),
    dailyCompletionStatusMsg: document.getElementById('dailyCompletionStatusMsg'),
    todaySubjectGainsList: document.getElementById('todaySubjectGainsList'),

    // Daily Timetable Tab
    ttPrevDayBtn: document.getElementById('ttPrevDayBtn'),
    ttDatePicker: document.getElementById('ttDatePicker'),
    ttNextDayBtn: document.getElementById('ttNextDayBtn'),
    ttTodayBtn: document.getElementById('ttTodayBtn'),
    ttDayTitle: document.getElementById('ttDayTitle'),
    openAddSlotModalBtn: document.getElementById('openAddSlotModalBtn'),
    copyYesterdayTimetableBtn: document.getElementById('copyYesterdayTimetableBtn'),
    clearDateTimetableBtn: document.getElementById('clearDateTimetableBtn'),
    timetableSlotCount: document.getElementById('timetableSlotCount'),
    timelineList: document.getElementById('timelineList'),
    liveTimeClock: document.getElementById('liveTimeClock'),
    statTimetableStudyHrs: document.getElementById('statTimetableStudyHrs'),
    statTimetableWorkHrs: document.getElementById('statTimetableWorkHrs'),
    statTimetableCoachingHrs: document.getElementById('statTimetableCoachingHrs'),
    statTimetableRestHrs: document.getElementById('statTimetableRestHrs'),
    fillTimetableStudy: document.getElementById('fillTimetableStudy'),
    fillTimetableWork: document.getElementById('fillTimetableWork'),
    fillTimetableCoaching: document.getElementById('fillTimetableCoaching'),
    fillTimetableRest: document.getElementById('fillTimetableRest'),

    // Slot Modal
    slotEditorModal: document.getElementById('slotEditorModal'),
    slotModalTitle: document.getElementById('slotModalTitle'),
    slotEditorForm: document.getElementById('slotEditorForm'),
    editSlotId: document.getElementById('editSlotId'),
    slotStartTime: document.getElementById('slotStartTime'),
    slotEndTime: document.getElementById('slotEndTime'),
    slotLabel: document.getElementById('slotLabel'),
    slotCategory: document.getElementById('slotCategory'),
    slotIcon: document.getElementById('slotIcon'),
    slotAssignedSubject: document.getElementById('slotAssignedSubject'),
    slotDesc: document.getElementById('slotDesc'),
    closeSlotModalBtn: document.getElementById('closeSlotModalBtn'),
    cancelSlotModalBtn: document.getElementById('cancelSlotModalBtn'),

    // Master Syllabus Tab
    todoSearchInput: document.getElementById('todoSearchInput'),
    todoSubjectFilter: document.getElementById('todoSubjectFilter'),
    filterChips: document.querySelectorAll('.filter-chips .filter-chip'),
    todoTableBody: document.getElementById('todoTableBody'),
    visibleRowCount: document.getElementById('visibleRowCount'),
    totalMasterLecturesCount: document.getElementById('totalMasterLecturesCount'),
    visiblePct: document.getElementById('visiblePct'),
    markAllVisibleDoneBtn: document.getElementById('markAllVisibleDoneBtn'),
    resetAllVisibleBtn: document.getElementById('resetAllVisibleBtn'),
    currentPageNum: document.getElementById('currentPageNum'),
    totalPagesNum: document.getElementById('totalPagesNum'),
    prevPageBtn: document.getElementById('prevPageBtn'),
    nextPageBtn: document.getElementById('nextPageBtn'),

    // Mock Tests Tab
    mockSeriesTabs: document.getElementById('mockSeriesTabs'),
    mockSearchInput: document.getElementById('mockSearchInput'),
    mockSeriesInfo: document.getElementById('mockSeriesInfo'),
    mockPapersGrid: document.getElementById('mockPapersGrid'),

    // Motivation Tab
    trophiesGrid: document.getElementById('trophiesGrid'),

    // Modals & Toast
    celebrationModal: document.getElementById('celebrationModal'),
    celebrationTitle: document.getElementById('celebrationTitle'),
    celebrationMsg: document.getElementById('celebrationMsg'),
    closeCelebrationBtn: document.getElementById('closeCelebrationBtn'),
    resetConfirmModal: document.getElementById('resetConfirmModal'),
    cancelResetBtn: document.getElementById('cancelResetBtn'),
    confirmResetBtn: document.getElementById('confirmResetBtn'),
    toastNotification: document.getElementById('toastNotification')
  };

  // ==========================================================================
  // INITIALIZATION & STATE PERSISTENCE
  // ==========================================================================

  function init() {
    loadState();
    applyTheme(state.theme);

    // Sync dates
    if (!state.selectedTargetDate) state.selectedTargetDate = getTodayDateStr();
    if (!state.selectedTimetableDate) state.selectedTimetableDate = getTodayDateStr();

    if (DOM.dailyTaskDatePicker) DOM.dailyTaskDatePicker.value = state.selectedTargetDate;
    if (DOM.ttDatePicker) DOM.ttDatePicker.value = state.selectedTimetableDate;

    // Populate all subject dropdowns
    populateSubjectDropdowns();

    // Render all initial components
    updateAllHeroMetrics();
    renderSubjectCards();
    renderDailyTargets();
    renderDailyTimetable();
    renderMasterSyllabusTable();
    renderMockSeriesTabs();
    renderMockTable();
    renderMotivationTrophies();

    // Live Timers
    startLiveClock();
    updateCountdown();
    setInterval(updateCountdown, 60000);

    // Attach Event Listeners
    setupEventListeners();
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.theme) state.theme = parsed.theme;
        if (parsed.lectures) state.lectures = parsed.lectures;
        if (parsed.mocks) state.mocks = parsed.mocks;
        if (parsed.dailyTargets) state.dailyTargets = parsed.dailyTargets;
        if (parsed.dailyTimetables) state.dailyTimetables = parsed.dailyTimetables;
        if (parsed.streak) state.streak = parsed.streak;
        if (parsed.lastActiveDate) state.lastActiveDate = parsed.lastActiveDate;

        // Migrate legacy daily tasks if needed
        if (parsed.dailyTasks && !parsed.dailyTargets) {
          state.dailyTargets = {};
          const today = getTodayDateStr();
          state.dailyTargets[today] = [];
          Object.keys(parsed.dailyTasks).forEach(k => {
            const t = parsed.dailyTasks[k];
            state.dailyTargets[today].push({
              id: t.id || 'target_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              type: t.subjectId ? 'study' : 'work',
              title: t.title,
              category: t.subjectId ? 'study' : 'work',
              subjectId: t.subjectId || '',
              hours: t.hours || '1.0 hr',
              priority: t.priority || 'normal',
              completed: !!t.completed,
              date: today
            });
          });
        }
      }
    } catch (e) {
      console.error('Error loading stored state:', e);
    }

    // Check streak
    const today = getTodayDateStr();
    if (state.lastActiveDate !== today) {
      const yesterday = getOffsetDateStr(today, -1);
      if (state.lastActiveDate === yesterday) {
        state.streak = (state.streak || 0) + 1;
      } else if (state.lastActiveDate < yesterday) {
        state.streak = 1;
      }
      state.lastActiveDate = today;
      saveState();
    }
  }

  function saveState() {
    try {
      const dataToSave = {
        theme: state.theme,
        lectures: state.lectures,
        mocks: state.mocks,
        dailyTargets: state.dailyTargets,
        dailyTimetables: state.dailyTimetables,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }

  function applyTheme(themeName) {
    state.theme = themeName;
    if (themeName === 'light') {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      if (DOM.themeIcon) DOM.themeIcon.textContent = '🌙';
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
      if (DOM.themeIcon) DOM.themeIcon.textContent = '☀️';
    }
    saveState();
  }

  // ==========================================================================
  // PROGRESS COMPUTATION (18 SUBJECTS, 1,345 LECTURES, 5,380 MILESTONES)
  // ==========================================================================

  function getSubjectProgress(subjectId) {
    const subject = subjectMap[subjectId];
    if (!subject) return { percent: 0, completedMilestones: 0, totalMilestones: 0, watched: 0, notes: 0, revision: 0, question: 0, totalLectures: 0 };

    const subjectRows = masterLectures.filter(r => r.subjectId === subjectId);
    let watched = 0;
    let notes = 0;
    let revision = 0;
    let question = 0;

    subjectRows.forEach(row => {
      const p = state.lectures[row.sNo];
      if (p) {
        if (p.watched) watched++;
        if (p.notes) notes++;
        if (p.revision) revision++;
        if (p.question) question++;
      }
    });

    const totalLectures = subject.totalLectures;
    const totalMilestones = totalLectures * 4;
    const completedMilestones = watched + notes + revision + question;
    const percent = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

    return {
      percent: percent,
      completedMilestones: completedMilestones,
      totalMilestones: totalMilestones,
      watched: watched,
      notes: notes,
      revision: revision,
      question: question,
      totalLectures: totalLectures
    };
  }

  function updateAllHeroMetrics() {
    let totalCompletedMilestones = 0;
    let totalWatched = 0;
    let totalNotes = 0;
    let totalRevision = 0;
    let totalQuestions = 0;
    let totalFullyDoneLectures = 0;

    const totalMilestones = masterLectures.length * 4; // 1,345 * 4 = 5,380

    masterLectures.forEach(row => {
      const p = state.lectures[row.sNo];
      if (p) {
        if (p.watched) totalWatched++;
        if (p.notes) totalNotes++;
        if (p.revision) totalRevision++;
        if (p.question) totalQuestions++;

        if (p.watched && p.notes && p.revision && p.question) {
          totalFullyDoneLectures++;
        }
      }
    });

    totalCompletedMilestones = totalWatched + totalNotes + totalRevision + totalQuestions;
    const overallPct = totalMilestones > 0 ? (totalCompletedMilestones / totalMilestones) * 100 : 0;

    // Count attempted mocks
    let mocksCount = 0;
    Object.keys(state.mocks).forEach(key => {
      const m = state.mocks[key];
      if ((m.a1_mark !== '' && m.a1_mark != null) || (m.a2_mark !== '' && m.a2_mark != null) || (m.a3_mark !== '' && m.a3_mark != null)) {
        mocksCount++;
      }
    });

    // Update Hero Stats
    if (DOM.statOverallPct) DOM.statOverallPct.textContent = `${overallPct.toFixed(1)}%`;
    if (DOM.statStagesDone) DOM.statStagesDone.textContent = `${totalCompletedMilestones.toLocaleString()} / ${totalMilestones.toLocaleString()} stages`;
    if (DOM.statLecturesDone) DOM.statLecturesDone.textContent = totalWatched;
    if (DOM.statNotesDone) DOM.statNotesDone.textContent = totalNotes;
    if (DOM.statRevisionDone) DOM.statRevisionDone.textContent = totalRevision;
    if (DOM.statQuestionsDone) DOM.statQuestionsDone.textContent = totalQuestions;
    if (DOM.statMocksAttempted) DOM.statMocksAttempted.textContent = mocksCount;

    if (DOM.statTotalLecturesSub) DOM.statTotalLecturesSub.textContent = `of ${masterLectures.length.toLocaleString()} individual lectures`;
    if (DOM.statTotalNotesSub) DOM.statTotalNotesSub.textContent = `of ${masterLectures.length.toLocaleString()} completed`;

    // Nav Badges
    if (DOM.badgeOverallPct) DOM.badgeOverallPct.textContent = `${Math.round(overallPct)}%`;
    if (DOM.badgeLectureCount) DOM.badgeLectureCount.textContent = `${totalFullyDoneLectures}/${masterLectures.length}`;
    if (DOM.badgeMockCount) DOM.badgeMockCount.textContent = `${mocksCount}/1,243`;

    // Radial Gauge
    if (DOM.radialProgressCircle) {
      const circumference = 465;
      const offset = circumference - (overallPct / 100) * circumference;
      DOM.radialProgressCircle.style.strokeDashoffset = offset;
    }
    if (DOM.radialProgressText) DOM.radialProgressText.textContent = `${Math.round(overallPct)}%`;

    // Aspirant Rank Badge
    let rankText = "🌱 Step 1: Aspirant Kickoff";
    if (overallPct >= 95) rankText = "🏆 Step 6: Selected Officer!";
    else if (overallPct >= 75) rankText = "⚔️ Step 5: Master Rank Aspirant";
    else if (overallPct >= 50) rankText = "🎯 Step 4: Revision Specialist";
    else if (overallPct >= 25) rankText = "⚡ Step 3: Consistent Grinder";
    else if (overallPct >= 10) rankText = "🔥 Step 2: Foundation Builder";
    if (DOM.aspirantRankBadge) DOM.aspirantRankBadge.textContent = rankText;
  }

  // ==========================================================================
  // TAB 1: SUBJECT PROGRESS (18 SUBJECTS)
  // ==========================================================================

  function renderSubjectCards() {
    if (!DOM.subjectCardsGrid) return;

    const selectedCategory = DOM.subjectCategoryFilter ? DOM.subjectCategoryFilter.value : 'ALL';
    let filteredSubjects = STUDY_DATA.subjects;
    if (selectedCategory !== 'ALL') {
      filteredSubjects = STUDY_DATA.subjects.filter(s => s.category === selectedCategory);
    }

    let html = '';
    filteredSubjects.forEach(sub => {
      const stats = getSubjectProgress(sub.id);
      const isComplete = stats.percent >= 100;

      html += `
        <div class="subject-card ${isComplete ? 'completed-subject' : ''}" style="--subject-color: ${sub.color};">
          <div class="subject-card-header">
            <div class="subject-title-area">
              <span class="subject-icon">${sub.icon}</span>
              <div>
                <h3 class="subject-name">${sub.name}</h3>
                <span class="subject-category">${sub.category} • ${sub.totalLectures} Individual Lectures</span>
              </div>
            </div>
            <div class="subject-percentage-pill">${stats.percent.toFixed(1)}%</div>
          </div>

          <div class="progress-track" style="margin: 0.85rem 0 1rem 0;">
            <div class="progress-fill" style="width: ${stats.percent}%; background: ${sub.color};"></div>
          </div>

          <div class="milestones-mini-grid">
            <div class="mini-stat">
              <span class="label">🎥 Watched</span>
              <span class="value">${stats.watched} / ${sub.totalLectures}</span>
            </div>
            <div class="mini-stat">
              <span class="label">📝 Notes</span>
              <span class="value">${stats.notes} / ${sub.totalLectures}</span>
            </div>
            <div class="mini-stat">
              <span class="label">🔁 Revision</span>
              <span class="value">${stats.revision} / ${sub.totalLectures}</span>
            </div>
            <div class="mini-stat">
              <span class="label">✍️ Questions</span>
              <span class="value">${stats.question} / ${sub.totalLectures}</span>
            </div>
          </div>

          <div class="subject-card-footer">
            <button class="btn btn-secondary btn-sm btn-explore-subject" data-subject-id="${sub.id}">
              <span>📋</span> View Lectures
            </button>
            <button class="btn btn-primary btn-sm btn-target-subject" data-subject-id="${sub.id}">
              <span>🎯</span> + Set Target
            </button>
          </div>
        </div>
      `;
    });

    DOM.subjectCardsGrid.innerHTML = html;

    // Attach card buttons
    DOM.subjectCardsGrid.querySelectorAll('.btn-explore-subject').forEach(btn => {
      btn.addEventListener('click', () => {
        const subId = btn.getAttribute('data-subject-id');
        switchToTab('tab-todo');
        if (DOM.todoSubjectFilter) {
          DOM.todoSubjectFilter.value = subId;
          state.todoSubject = subId;
          state.currentPage = 1;
          renderMasterSyllabusTable();
        }
      });
    });

    DOM.subjectCardsGrid.querySelectorAll('.btn-target-subject').forEach(btn => {
      btn.addEventListener('click', () => {
        const subId = btn.getAttribute('data-subject-id');
        switchToTab('tab-daily');
        setTargetMode('workstudy');
        if (DOM.dtWorkStudyCategory) DOM.dtWorkStudyCategory.value = 'study';
        if (DOM.dtWorkStudySubject) {
          DOM.dtWorkStudySubject.value = subId;
          updateSubjectLinkPreview();
        }
      });
    });
  }

  // ==========================================================================
  // TAB 2: DAILY TARGETS (WORK TASKS & RANDOM ADDITIONS - NO PRE-DEFINED TASKS)
  // ==========================================================================

  function populateSubjectDropdowns() {
    // Fill subject selects across the app
    let subjectOptions = '<option value="">None / General Work</option>';
    STUDY_DATA.subjects.forEach(sub => {
      subjectOptions += `<option value="${sub.id}">${sub.icon} ${sub.name} (${sub.totalLectures} Lec)</option>`;
    });

    if (DOM.dtWorkStudySubject) {
      DOM.dtWorkStudySubject.innerHTML = subjectOptions;
    }

    if (DOM.slotAssignedSubject) {
      DOM.slotAssignedSubject.innerHTML = '<option value="">None / General</option>' + 
        STUDY_DATA.subjects.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('');
    }

    if (DOM.todoSubjectFilter) {
      let masterOptions = `<option value="ALL">All Subjects (${masterLectures.length} Lectures)</option>`;
      STUDY_DATA.subjects.forEach(sub => {
        masterOptions += `<option value="${sub.id}">${sub.icon} ${sub.name} (${sub.totalLectures})</option>`;
      });
      DOM.todoSubjectFilter.innerHTML = masterOptions;
    }
  }

  function setTargetMode(mode) {
    state.targetMode = mode;
    if (mode === 'workstudy') {
      if (DOM.btnModeWorkStudy) DOM.btnModeWorkStudy.classList.add('active');
      if (DOM.btnModeRandom) DOM.btnModeRandom.classList.remove('active');
      if (DOM.workStudyTaskForm) DOM.workStudyTaskForm.style.display = 'block';
      if (DOM.randomTaskForm) DOM.randomTaskForm.style.display = 'none';
    } else {
      if (DOM.btnModeWorkStudy) DOM.btnModeWorkStudy.classList.remove('active');
      if (DOM.btnModeRandom) DOM.btnModeRandom.classList.add('active');
      if (DOM.workStudyTaskForm) DOM.workStudyTaskForm.style.display = 'none';
      if (DOM.randomTaskForm) DOM.randomTaskForm.style.display = 'block';
    }
  }

  function updateSubjectLinkPreview() {
    if (!DOM.subjectLinkPreviewBox || !DOM.dtWorkStudySubject) return;
    const subId = DOM.dtWorkStudySubject.value;
    if (!subId) {
      DOM.subjectLinkPreviewBox.style.display = 'none';
      return;
    }

    const sub = subjectMap[subId];
    if (!sub) {
      DOM.subjectLinkPreviewBox.style.display = 'none';
      return;
    }

    DOM.subjectLinkPreviewBox.style.display = 'flex';
    const stats = getSubjectProgress(subId);
    const gainPerMilestone = 100 / (sub.totalLectures * 4);

    DOM.prevSubjectName.textContent = `${sub.icon} ${sub.name}`;
    DOM.prevCurrentPct.textContent = `${stats.percent.toFixed(1)}%`;
    DOM.prevProjectedPct.textContent = `${Math.min(100, stats.percent + gainPerMilestone).toFixed(1)}%`;
    DOM.prevGainPct.textContent = `+${gainPerMilestone.toFixed(2)}%`;
  }

  function renderDailyTargets() {
    if (!DOM.dailyTasksList) return;

    const curDate = state.selectedTargetDate;
    const targets = state.dailyTargets[curDate] || [];

    // Header labels
    const isToday = curDate === getTodayDateStr();
    if (DOM.targetDayName) DOM.targetDayName.textContent = isToday ? 'Today' : formatDisplayDate(curDate);
    if (DOM.selectedDateLabel) DOM.selectedDateLabel.textContent = isToday ? "Today's Targets" : `${formatDisplayDate(curDate)} Targets`;

    // Filter targets
    let filtered = targets;
    if (state.dailyFilter === 'WORK') filtered = targets.filter(t => t.category === 'work');
    else if (state.dailyFilter === 'STUDY') filtered = targets.filter(t => t.category === 'study' || t.type === 'study');
    else if (state.dailyFilter === 'RANDOM') filtered = targets.filter(t => t.type === 'random' || ['personal', 'health', 'errand', 'finance', 'random'].includes(t.category));
    else if (state.dailyFilter === 'PENDING') filtered = targets.filter(t => !t.completed);
    else if (state.dailyFilter === 'COMPLETED') filtered = targets.filter(t => t.completed);

    // Summary calculation
    const totalCount = targets.length;
    const completedCount = targets.filter(t => t.completed).length;
    const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    if (DOM.dailyTasksSummaryText) {
      DOM.dailyTasksSummaryText.textContent = `${completedCount} of ${totalCount} Completed (${pct}%)`;
    }
    if (DOM.badgeDailyTasksCount) {
      DOM.badgeDailyTasksCount.textContent = `${completedCount}/${totalCount} Done`;
    }

    // Circular gauge in right sidebar
    if (DOM.dailyProgressRingCircle) {
      const circumference = 352;
      const offset = circumference - (pct / 100) * circumference;
      DOM.dailyProgressRingCircle.style.strokeDashoffset = offset;
    }
    if (DOM.dailyProgressRingText) {
      DOM.dailyProgressRingText.textContent = `${pct}%`;
    }
    if (DOM.dailyCompletionStatusMsg) {
      if (totalCount === 0) {
        DOM.dailyCompletionStatusMsg.textContent = 'No targets added for this date yet.';
      } else if (completedCount === totalCount) {
        DOM.dailyCompletionStatusMsg.textContent = '🎉 All daily targets completed! Amazing work!';
      } else {
        DOM.dailyCompletionStatusMsg.textContent = `${totalCount - completedCount} targets remaining for today.`;
      }
    }

    // Render List or Clean Empty State
    if (targets.length === 0) {
      DOM.dailyTasksList.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-icon">🎯</div>
          <h4>No Targets Set for ${isToday ? 'Today' : formatDisplayDate(curDate)}</h4>
          <p>Add your work deliverables, study lectures, or random tasks above to plan your day!</p>
        </div>
      `;
      renderTodayGainsLog([]);
      return;
    }

    if (filtered.length === 0) {
      DOM.dailyTasksList.innerHTML = `
        <div class="empty-state-card" style="padding: 1.5rem;">
          <p>No targets match the active filter (${state.dailyFilter}).</p>
        </div>
      `;
      renderTodayGainsLog(targets);
      return;
    }

    let html = '';
    filtered.forEach(target => {
      const isDone = !!target.completed;
      const sub = target.subjectId ? subjectMap[target.subjectId] : null;

      let categoryBadge = '';
      if (target.type === 'random') {
        categoryBadge = `<span class="task-subject-pill" style="--task-sub-bg: rgba(236, 72, 153, 0.15); --task-sub-color: #f472b6; --task-sub-border: rgba(236, 72, 153, 0.3);">⚡ Random: ${target.category}</span>`;
      } else if (target.category === 'work') {
        categoryBadge = `<span class="task-subject-pill" style="--task-sub-bg: rgba(245, 158, 11, 0.15); --task-sub-color: #fbbf24; --task-sub-border: rgba(245, 158, 11, 0.3);">💼 Work Task</span>`;
      } else {
        categoryBadge = `<span class="task-subject-pill" style="--task-sub-bg: rgba(99, 102, 241, 0.15); --task-sub-color: #a5b4fc; --task-sub-border: rgba(99, 102, 241, 0.3);">📖 Study Target</span>`;
      }

      let subjectTag = '';
      if (sub) {
        const subProg = getSubjectProgress(sub.id);
        subjectTag = `
          <span class="task-subject-pill" style="--task-sub-bg: ${sub.color}22; --task-sub-color: ${sub.color}; --task-sub-border: ${sub.color}55;">
            ${sub.icon} ${sub.name} (${subProg.percent.toFixed(1)}%)
          </span>
        `;
      }

      let priorityClass = 'normal';
      if (target.priority === 'urgent') priorityClass = 'urgent';
      else if (target.priority === 'high') priorityClass = 'high';

      html += `
        <div class="daily-task-card ${isDone ? 'is-completed' : ''}" data-target-id="${target.id}">
          <div class="task-checkbox-area">
            <input type="checkbox" class="custom-checkbox target-check" ${isDone ? 'checked' : ''} data-target-id="${target.id}">
          </div>

          <div class="task-main-info">
            <div class="task-meta-top">
              ${categoryBadge}
              ${subjectTag}
              <span class="task-priority-pill ${priorityClass}">${target.priority || 'Normal'}</span>
              ${target.hours ? `<span class="task-slot-pill">⏱️ ${target.hours}</span>` : ''}
            </div>

            <div class="task-title">${escapeHtml(target.title)}</div>

            ${sub ? `<div class="task-impact-badge">⚡ Linked to ${sub.name} Syllabus Progress</div>` : ''}
          </div>

          <div class="task-actions">
            <button class="btn-task-del btn-del-target" data-target-id="${target.id}" title="Delete Target">✕</button>
          </div>
        </div>
      `;
    });

    DOM.dailyTasksList.innerHTML = html;

    // Attach target checkbox toggles
    DOM.dailyTasksList.querySelectorAll('.target-check').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = chk.getAttribute('data-target-id');
        toggleTargetComplete(id, chk.checked);
      });
    });

    // Attach delete buttons
    DOM.dailyTasksList.querySelectorAll('.btn-del-target').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-target-id');
        deleteTarget(id);
      });
    });

    renderTodayGainsLog(targets);
  }

  function toggleTargetComplete(targetId, isDone) {
    const curDate = state.selectedTargetDate;
    const list = state.dailyTargets[curDate] || [];
    const target = list.find(t => t.id === targetId);
    if (!target) return;

    target.completed = isDone;

    // Direct synchronization with Subject Progress if linked to a subject
    if (target.subjectId) {
      syncTargetToSubjectProgress(target.subjectId, isDone);
    }

    saveState();
    updateAllHeroMetrics();
    renderSubjectCards();
    renderDailyTargets();
    renderMasterSyllabusTable();

    // Check celebration if all targets for today are crushed
    const allDone = list.length > 0 && list.every(t => t.completed);
    if (allDone && isDone) {
      triggerMilestoneCelebration("DAILY TARGETS COMPLETED! 🎯", "All planned tasks for today have been crushed with full discipline.");
    }
  }

  function syncTargetToSubjectProgress(subjectId, isDone) {
    // Find next uncompleted lecture for this subject in masterLectures
    const subjectLectures = masterLectures.filter(r => r.subjectId === subjectId);
    if (isDone) {
      // Find the first lecture that has any uncompleted milestone
      for (let i = 0; i < subjectLectures.length; i++) {
        const row = subjectLectures[i];
        if (!state.lectures[row.sNo]) state.lectures[row.sNo] = { watched: false, notes: false, revision: false, question: false };
        const p = state.lectures[row.sNo];

        if (!p.watched) { p.watched = true; break; }
        else if (!p.notes) { p.notes = true; break; }
        else if (!p.revision) { p.revision = true; break; }
        else if (!p.question) { p.question = true; break; }
      }
    }
  }

  function deleteTarget(targetId) {
    const curDate = state.selectedTargetDate;
    if (!state.dailyTargets[curDate]) return;
    state.dailyTargets[curDate] = state.dailyTargets[curDate].filter(t => t.id !== targetId);
    saveState();
    renderDailyTargets();
    showToast('Target removed');
  }

  function renderTodayGainsLog(targets) {
    if (!DOM.todaySubjectGainsList) return;

    const completedWithSubject = targets.filter(t => t.completed && t.subjectId);
    if (completedWithSubject.length === 0) {
      DOM.todaySubjectGainsList.innerHTML = `<div style="font-size: 0.75rem; color: var(--text-muted);">No linked subject completions logged yet today.</div>`;
      return;
    }

    // Group by subject
    const subjectGains = {};
    completedWithSubject.forEach(t => {
      subjectGains[t.subjectId] = (subjectGains[t.subjectId] || 0) + 1;
    });

    let html = '';
    Object.keys(subjectGains).forEach(subId => {
      const sub = subjectMap[subId];
      if (!sub) return;
      const count = subjectGains[subId];
      const gainPct = (count * 100) / (sub.totalLectures * 4);
      const subProg = getSubjectProgress(subId);

      html += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.35rem 0; font-size: 0.75rem; border-bottom: 1px dashed var(--border-subtle);">
          <span>${sub.icon} <strong>${sub.name}</strong> (${count} milestones)</span>
          <span style="color: #34d399; font-weight: 800;">+${gainPct.toFixed(2)}% ➔ ${subProg.percent.toFixed(1)}%</span>
        </div>
      `;
    });

    DOM.todaySubjectGainsList.innerHTML = html;
  }

  // ==========================================================================
  // TAB 3: DAILY TIMETABLE (CUSTOMIZABLE DAY-BY-DAY - NO PRE-DEFINED TASKS)
  // ==========================================================================

  function parseSlotDurationHours(timeStr) {
    if (!timeStr || !timeStr.includes('-')) return 1.0;
    const parts = timeStr.split('-').map(s => s.trim());
    if (parts.length < 2) return 1.0;
    const [h1, m1] = parts[0].split(':').map(Number);
    const [h2, m2] = parts[1].split(':').map(Number);
    let diff = (h2 + (m2 || 0) / 60) - (h1 + (m1 || 0) / 60);
    if (diff < 0) diff += 24; // overnight
    return Math.round(diff * 10) / 10;
  }

  function renderDailyTimetable() {
    if (!DOM.timelineList) return;

    const curDate = state.selectedTimetableDate;
    const slots = state.dailyTimetables[curDate] || [];

    const isToday = curDate === getTodayDateStr();
    if (DOM.ttDayTitle) {
      DOM.ttDayTitle.textContent = isToday ? 'Schedule for Today' : `Schedule for ${formatDisplayDate(curDate)}`;
    }

    if (DOM.timetableSlotCount) {
      DOM.timetableSlotCount.textContent = slots.length;
    }

    // Time calculations
    let totalHrs = 0;
    let studyHrs = 0;
    let workHrs = 0;
    let coachingHrs = 0;
    let restHrs = 0;

    slots.forEach(slot => {
      const dur = parseSlotDurationHours(slot.time);
      totalHrs += dur;
      if (slot.category === 'study') studyHrs += dur;
      else if (slot.category === 'work') workHrs += dur;
      else if (slot.category === 'coaching') coachingHrs += dur;
      else restHrs += dur;
    });

    // Update Hours Allocation Sidebar
    const sPct = totalHrs > 0 ? (studyHrs / totalHrs) * 100 : 0;
    const wPct = totalHrs > 0 ? (workHrs / totalHrs) * 100 : 0;
    const cPct = totalHrs > 0 ? (coachingHrs / totalHrs) * 100 : 0;
    const rPct = totalHrs > 0 ? (restHrs / totalHrs) * 100 : 0;

    if (DOM.statTimetableStudyHrs) DOM.statTimetableStudyHrs.textContent = `${studyHrs.toFixed(1)} Hours (${sPct.toFixed(1)}%)`;
    if (DOM.statTimetableWorkHrs) DOM.statTimetableWorkHrs.textContent = `${workHrs.toFixed(1)} Hours (${wPct.toFixed(1)}%)`;
    if (DOM.statTimetableCoachingHrs) DOM.statTimetableCoachingHrs.textContent = `${coachingHrs.toFixed(1)} Hours (${cPct.toFixed(1)}%)`;
    if (DOM.statTimetableRestHrs) DOM.statTimetableRestHrs.textContent = `${restHrs.toFixed(1)} Hours (${rPct.toFixed(1)}%)`;

    if (DOM.fillTimetableStudy) DOM.fillTimetableStudy.style.width = `${sPct}%`;
    if (DOM.fillTimetableWork) DOM.fillTimetableWork.style.width = `${wPct}%`;
    if (DOM.fillTimetableCoaching) DOM.fillTimetableCoaching.style.width = `${cPct}%`;
    if (DOM.fillTimetableRest) DOM.fillTimetableRest.style.width = `${rPct}%`;

    if (DOM.badgeTimetableStudyHrs) {
      DOM.badgeTimetableStudyHrs.textContent = `${studyHrs.toFixed(1)}h Study`;
    }

    // Clean Empty State if no slots planned
    if (slots.length === 0) {
      DOM.timelineList.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-icon">⏰</div>
          <h4>No Timetable Created for ${isToday ? 'Today' : formatDisplayDate(curDate)}</h4>
          <p>Design your daily schedule by adding time slots for study, work shifts, coaching, or rest.</p>
          <button id="emptyAddSlotBtn" class="btn btn-primary btn-sm" style="margin-top: 0.5rem;">
            <span>➕</span> Add First Time Slot
          </button>
        </div>
      `;

      const emptyBtn = document.getElementById('emptyAddSlotBtn');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => openSlotEditorModal());
      }
      return;
    }

    // Wall-clock active slot detector
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let html = '';
    slots.forEach((slot, index) => {
      let isActiveNow = false;
      if (isToday && slot.time.includes('-')) {
        const parts = slot.time.split('-').map(s => s.trim());
        const [startH, startM] = parts[0].split(':').map(Number);
        const [endH, endM] = parts[1].split(':').map(Number);
        const startMin = startH * 60 + (startM || 0);
        let endMin = endH * 60 + (endM || 0);
        if (endMin < startMin) endMin += 1440; // overnight
        if (currentMinutes >= startMin && currentMinutes < endMin) {
          isActiveNow = true;
        }
      }

      const durHrs = parseSlotDurationHours(slot.time);
      const isSlotDone = !!slot.completed;
      const assignedSub = slot.assignedSubject ? subjectMap[slot.assignedSubject] : null;

      html += `
        <div class="timeline-item ${isActiveNow ? 'active-slot' : ''} ${isSlotDone ? 'is-completed' : ''}" data-slot-id="${slot.id}">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <input type="checkbox" class="custom-checkbox slot-check" ${isSlotDone ? 'checked' : ''} data-slot-id="${slot.id}" title="Mark slot completed">
            <div class="time-slot">
              <div>${slot.time}</div>
              <div style="font-size: 0.7rem; color: var(--text-muted);">${durHrs} hrs</div>
            </div>
          </div>

          <div class="time-activity">
            <div class="time-title" style="${isSlotDone ? 'text-decoration: line-through; opacity: 0.7;' : ''}">
              <span>${slot.icon || '⚡'}</span> ${escapeHtml(slot.label)}
            </div>
            ${slot.desc ? `<div class="time-desc">${escapeHtml(slot.desc)}</div>` : ''}
            ${assignedSub ? `
              <div class="slot-subject-badge" style="background: ${assignedSub.color}22; color: ${assignedSub.color}; border: 1px solid ${assignedSub.color}44;">
                ${assignedSub.icon} Focus: ${assignedSub.name}
              </div>
            ` : ''}
          </div>

          <span class="time-tag ${slot.category}">${slot.category.toUpperCase()}</span>

          <div style="display: flex; gap: 0.25rem;">
            <button class="btn btn-secondary btn-icon-only btn-sm btn-edit-slot" data-slot-id="${slot.id}" title="Edit Slot">✏️</button>
            <button class="btn btn-secondary btn-icon-only btn-sm btn-del-slot" data-slot-id="${slot.id}" style="color: #ef4444;" title="Delete Slot">🗑️</button>
          </div>
        </div>
      `;
    });

    DOM.timelineList.innerHTML = html;

    // Attach slot toggles
    DOM.timelineList.querySelectorAll('.slot-check').forEach(chk => {
      chk.addEventListener('change', () => {
        const id = chk.getAttribute('data-slot-id');
        toggleSlotCompleted(id, chk.checked);
      });
    });

    // Attach edit buttons
    DOM.timelineList.querySelectorAll('.btn-edit-slot').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-slot-id');
        openSlotEditorModal(id);
      });
    });

    // Attach delete buttons
    DOM.timelineList.querySelectorAll('.btn-del-slot').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-slot-id');
        deleteSlot(id);
      });
    });
  }

  function toggleSlotCompleted(slotId, isDone) {
    const curDate = state.selectedTimetableDate;
    const slots = state.dailyTimetables[curDate] || [];
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    slot.completed = isDone;
    saveState();
    renderDailyTimetable();
  }

  function deleteSlot(slotId) {
    const curDate = state.selectedTimetableDate;
    if (!state.dailyTimetables[curDate]) return;
    state.dailyTimetables[curDate] = state.dailyTimetables[curDate].filter(s => s.id !== slotId);
    saveState();
    renderDailyTimetable();
    showToast('Time slot deleted');
  }

  function openSlotEditorModal(slotId) {
    const curDate = state.selectedTimetableDate;
    const slots = state.dailyTimetables[curDate] || [];

    if (slotId) {
      const slot = slots.find(s => s.id === slotId);
      if (!slot) return;
      DOM.slotModalTitle.textContent = 'Edit Timetable Slot';
      DOM.editSlotId.value = slot.id;
      const parts = slot.time.split('-').map(s => s.trim());
      DOM.slotStartTime.value = parts[0] || '06:00';
      DOM.slotEndTime.value = parts[1] || '08:00';
      DOM.slotLabel.value = slot.label || '';
      DOM.slotCategory.value = slot.category || 'study';
      DOM.slotIcon.value = slot.icon || '⚡';
      DOM.slotAssignedSubject.value = slot.assignedSubject || '';
      DOM.slotDesc.value = slot.desc || '';
    } else {
      DOM.slotModalTitle.textContent = `Add Timetable Slot for ${formatDisplayDate(curDate)}`;
      DOM.editSlotId.value = '';
      DOM.slotStartTime.value = '09:00';
      DOM.slotEndTime.value = '11:00';
      DOM.slotLabel.value = '';
      DOM.slotCategory.value = 'study';
      DOM.slotIcon.value = '📖';
      DOM.slotAssignedSubject.value = '';
      DOM.slotDesc.value = '';
    }

    DOM.slotEditorModal.classList.add('active');
  }

  function closeSlotEditorModal() {
    DOM.slotEditorModal.classList.remove('active');
  }

  function saveSlotFromModal(e) {
    e.preventDefault();
    const curDate = state.selectedTimetableDate;
    if (!state.dailyTimetables[curDate]) {
      state.dailyTimetables[curDate] = [];
    }

    const start = DOM.slotStartTime.value.trim();
    const end = DOM.slotEndTime.value.trim();
    const label = DOM.slotLabel.value.trim();
    const category = DOM.slotCategory.value;
    const icon = DOM.slotIcon.value.trim() || '⚡';
    const assignedSubject = DOM.slotAssignedSubject.value;
    const desc = DOM.slotDesc.value.trim();
    const editId = DOM.editSlotId.value;

    const timeStr = `${start} - ${end}`;

    if (editId) {
      const slot = state.dailyTimetables[curDate].find(s => s.id === editId);
      if (slot) {
        slot.time = timeStr;
        slot.label = label;
        slot.category = category;
        slot.icon = icon;
        slot.assignedSubject = assignedSubject;
        slot.desc = desc;
      }
    } else {
      const newSlot = {
        id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        time: timeStr,
        label: label,
        category: category,
        icon: icon,
        assignedSubject: assignedSubject,
        desc: desc,
        completed: false
      };
      state.dailyTimetables[curDate].push(newSlot);
    }

    saveState();
    closeSlotEditorModal();
    renderDailyTimetable();
    showToast('Timetable slot saved successfully');
  }

  // ==========================================================================
  // TAB 4: MASTER SYLLABUS (1,345 INDIVIDUAL NUMBERED LECTURES)
  // ==========================================================================

  function getFilteredMasterLectures() {
    return masterLectures.filter(row => {
      // Subject filter
      if (state.todoSubject !== 'ALL' && row.subjectId !== state.todoSubject) {
        return false;
      }

      // Keyword search
      if (state.todoSearch) {
        const query = state.todoSearch.toLowerCase();
        const text = `${row.sNo} ${row.title} ${row.subtopic}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      // Milestone status filter
      if (state.todoFilter !== 'ALL') {
        const p = state.lectures[row.sNo] || {};
        const isDone = p.watched && p.notes && p.revision && p.question;
        const hasStarted = p.watched || p.notes || p.revision || p.question;

        if (state.todoFilter === 'DONE' && !isDone) return false;
        if (state.todoFilter === 'IN_PROGRESS' && (!hasStarted || isDone)) return false;
        if (state.todoFilter === 'UNSTARTED' && hasStarted) return false;
      }

      return true;
    });
  }

  function renderMasterSyllabusTable() {
    if (!DOM.todoTableBody) return;

    const filtered = getFilteredMasterLectures();
    const totalCount = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / state.pageSize));

    if (state.currentPage > totalPages) state.currentPage = totalPages;
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const pageRows = filtered.slice(startIndex, startIndex + state.pageSize);

    // Summary counts
    let fullyCompletedCount = 0;
    filtered.forEach(r => {
      const p = state.lectures[r.sNo] || {};
      if (p.watched && p.notes && p.revision && p.question) fullyCompletedCount++;
    });

    const completionPct = totalCount > 0 ? ((fullyCompletedCount / totalCount) * 100).toFixed(1) : 0;

    if (DOM.visibleRowCount) DOM.visibleRowCount.textContent = totalCount.toLocaleString();
    if (DOM.totalMasterLecturesCount) DOM.totalMasterLecturesCount.textContent = masterLectures.length.toLocaleString();
    if (DOM.visiblePct) DOM.visiblePct.textContent = `${completionPct}%`;
    if (DOM.currentPageNum) DOM.currentPageNum.textContent = state.currentPage;
    if (DOM.totalPagesNum) DOM.totalPagesNum.textContent = totalPages;

    if (DOM.prevPageBtn) DOM.prevPageBtn.disabled = state.currentPage <= 1;
    if (DOM.nextPageBtn) DOM.nextPageBtn.disabled = state.currentPage >= totalPages;

    let html = '';
    pageRows.forEach(row => {
      const p = state.lectures[row.sNo] || {};
      const sub = subjectMap[row.subjectId] || {};
      const isFullyDone = p.watched && p.notes && p.revision && p.question;
      const isStarted = p.watched || p.notes || p.revision || p.question;

      let statusBadge = `<span class="status-badge pending">Pending</span>`;
      if (isFullyDone) {
        statusBadge = `<span class="status-badge completed">Done 4/4</span>`;
      } else if (isStarted) {
        statusBadge = `<span class="status-badge in-progress">Active</span>`;
      }

      html += `
        <tr class="${isFullyDone ? 'lecture-fully-done' : ''}" data-sno="${row.sNo}">
          <td data-label="S.No" style="font-family: var(--font-mono); font-weight: 700; color: var(--text-muted);">
            #${row.sNo}
          </td>

          <td data-label="Lecture & Topic" class="lecture-title-cell">
            <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.2rem;">
              ${escapeHtml(row.title)}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${sub.color || '#38bdf8'};"></span>
              <span>${sub.name || row.subjectId}</span>
            </div>
          </td>

          <td data-label="Watched" class="stage-check-cell">
            <input type="checkbox" class="custom-checkbox lec-chk" data-sno="${row.sNo}" data-stage="watched" ${p.watched ? 'checked' : ''}>
          </td>

          <td data-label="Notes" class="stage-check-cell">
            <input type="checkbox" class="custom-checkbox lec-chk" data-sno="${row.sNo}" data-stage="notes" ${p.notes ? 'checked' : ''}>
          </td>

          <td data-label="Revision" class="stage-check-cell">
            <input type="checkbox" class="custom-checkbox lec-chk" data-sno="${row.sNo}" data-stage="revision" ${p.revision ? 'checked' : ''}>
          </td>

          <td data-label="Question" class="stage-check-cell">
            <input type="checkbox" class="custom-checkbox lec-chk" data-sno="${row.sNo}" data-stage="question" ${p.question ? 'checked' : ''}>
          </td>

          <td data-label="Status" style="text-align: center;">
            ${statusBadge}
          </td>

          <td data-label="Action" style="text-align: right;">
            <button class="btn-quick-done btn-target-lecture" data-sno="${row.sNo}" title="Add to Today's Targets">
              + Target
            </button>
          </td>
        </tr>
      `;
    });

    DOM.todoTableBody.innerHTML = html;

    // Attach individual checkbox listeners
    DOM.todoTableBody.querySelectorAll('.lec-chk').forEach(chk => {
      chk.addEventListener('change', () => {
        const sNo = parseInt(chk.getAttribute('data-sno'), 10);
        const stage = chk.getAttribute('data-stage');
        setLectureMilestone(sNo, stage, chk.checked);
      });
    });

    // Attach "+ Target" button listeners
    DOM.todoTableBody.querySelectorAll('.btn-target-lecture').forEach(btn => {
      btn.addEventListener('click', () => {
        const sNo = parseInt(btn.getAttribute('data-sno'), 10);
        addLectureToDailyTargets(sNo);
      });
    });
  }

  function setLectureMilestone(sNo, stage, value) {
    if (!state.lectures[sNo]) {
      state.lectures[sNo] = { watched: false, notes: false, revision: false, question: false };
    }
    state.lectures[sNo][stage] = value;
    saveState();
    updateAllHeroMetrics();
    renderSubjectCards();
    renderMasterSyllabusTable();
  }

  function addLectureToDailyTargets(sNo) {
    const lectureRow = masterLectures.find(r => r.sNo === sNo);
    if (!lectureRow) return;

    const sub = subjectMap[lectureRow.subjectId];
    const curDate = state.selectedTargetDate;
    if (!state.dailyTargets[curDate]) state.dailyTargets[curDate] = [];

    const newTarget = {
      id: 'target_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      type: 'study',
      title: `${lectureRow.title}`,
      category: 'study',
      subjectId: lectureRow.subjectId,
      hours: '1.5 hrs',
      priority: 'high',
      completed: false,
      date: curDate
    };

    state.dailyTargets[curDate].push(newTarget);
    saveState();
    renderDailyTargets();
    switchToTab('tab-daily');
    showToast(`Added to ${formatDisplayDate(curDate)} Targets! 🎯`);
  }

  // ==========================================================================
  // TAB 5: MOCK TESTS & PYQS TRACKER (15 EXAM STREAMS - 1,243 PAPERS)
  // ==========================================================================

  function renderMockSeriesTabs() {
    if (!DOM.mockSeriesTabs) return;

    let html = '';
    STUDY_DATA.mockSeries.forEach(series => {
      const isActive = series.id === state.selectedMockSeries;
      html += `
        <button class="mock-tab-btn ${isActive ? 'active' : ''}" data-series-id="${series.id}">
          ${series.name} (${series.count})
        </button>
      `;
    });

    DOM.mockSeriesTabs.innerHTML = html;

    DOM.mockSeriesTabs.querySelectorAll('.mock-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedMockSeries = btn.getAttribute('data-series-id');
        renderMockSeriesTabs();
        renderMockTable();
      });
    });
  }

  function renderMockTable() {
    if (!DOM.mockPapersGrid) return;

    const series = STUDY_DATA.mockSeries.find(s => s.id === state.selectedMockSeries) || STUDY_DATA.mockSeries[0];
    if (DOM.mockSeriesInfo) {
      DOM.mockSeriesInfo.textContent = `${series.name} • Total ${series.count} Papers • S.No Range: ${series.sNoRange}`;
    }

    const query = (DOM.mockSearchInput ? DOM.mockSearchInput.value : '').toLowerCase();

    let html = '';
    for (let pNum = 1; pNum <= series.count; pNum++) {
      const paperKey = `${series.id}_p${pNum}`;
      const paperName = `${series.name} - Paper #${String(pNum).padStart(2, '0')}`;

      if (query && !paperName.toLowerCase().includes(query)) {
        continue;
      }

      const data = state.mocks[paperKey] || {};

      html += `
        <div class="mock-paper-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-primary);">${paperName}</div>
            <span style="font-size: 0.7rem; font-family: var(--font-mono); color: #38bdf8; background: rgba(56, 189, 248, 0.12); padding: 0.15rem 0.5rem; border-radius: var(--radius-full);">3 Attempts</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;">
            <div style="background: var(--bg-input); padding: 0.5rem; border-radius: var(--radius-sm); text-align: center;">
              <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700;">ATTEMPT 1</div>
              <input type="text" class="mock-input mock-mark-input" data-paper="${paperKey}" data-field="a1_mark" placeholder="Score" value="${data.a1_mark || ''}">
              <input type="text" class="mock-input mock-date-input" data-paper="${paperKey}" data-field="a1_date" placeholder="Date" value="${data.a1_date || ''}">
            </div>

            <div style="background: var(--bg-input); padding: 0.5rem; border-radius: var(--radius-sm); text-align: center;">
              <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700;">ATTEMPT 2</div>
              <input type="text" class="mock-input mock-mark-input" data-paper="${paperKey}" data-field="a2_mark" placeholder="Score" value="${data.a2_mark || ''}">
              <input type="text" class="mock-input mock-date-input" data-paper="${paperKey}" data-field="a2_date" placeholder="Date" value="${data.a2_date || ''}">
            </div>

            <div style="background: var(--bg-input); padding: 0.5rem; border-radius: var(--radius-sm); text-align: center;">
              <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700;">ATTEMPT 3</div>
              <input type="text" class="mock-input mock-mark-input" data-paper="${paperKey}" data-field="a3_mark" placeholder="Score" value="${data.a3_mark || ''}">
              <input type="text" class="mock-input mock-date-input" data-paper="${paperKey}" data-field="a3_date" placeholder="Date" value="${data.a3_date || ''}">
            </div>
          </div>
        </div>
      `;
    }

    DOM.mockPapersGrid.innerHTML = html;

    // Attach mock input listeners
    DOM.mockPapersGrid.querySelectorAll('.mock-input').forEach(input => {
      input.addEventListener('change', () => {
        const paper = input.getAttribute('data-paper');
        const field = input.getAttribute('data-field');
        const val = input.value.trim();

        if (!state.mocks[paper]) state.mocks[paper] = {};
        state.mocks[paper][field] = val;
        saveState();
        updateAllHeroMetrics();
      });
    });
  }

  // ==========================================================================
  // TAB 6: MOTIVATION & ASPIRANT RANKS
  // ==========================================================================

  function renderMotivationTrophies() {
    if (!DOM.trophiesGrid) return;

    let totalCompleted = 0;
    masterLectures.forEach(row => {
      const p = state.lectures[row.sNo];
      if (p) {
        if (p.watched) totalCompleted++;
        if (p.notes) totalCompleted++;
        if (p.revision) totalCompleted++;
        if (p.question) totalCompleted++;
      }
    });

    const totalMilestones = masterLectures.length * 4;
    const overallPct = totalMilestones > 0 ? (totalCompleted / totalMilestones) * 100 : 0;

    const milestones = [
      { pct: 0, title: "Aspirant Kickoff", desc: "Embarking on Mission 2026-2027", icon: "🌱" },
      { pct: 10, title: "Foundation Builder", desc: "Over 500 milestones completed", icon: "🔥" },
      { pct: 25, title: "Consistent Grinder", desc: "Quarter of syllabus mastered", icon: "⚡" },
      { pct: 50, title: "Revision Specialist", desc: "Halfway mark accomplished", icon: "🎯" },
      { pct: 75, title: "Master Rank Aspirant", desc: "Top percentile discipline", icon: "⚔️" },
      { pct: 100, title: "Selected Officer", desc: "All 1,345 lectures & papers conquered", icon: "👑" }
    ];

    let html = '';
    milestones.forEach(m => {
      const isUnlocked = overallPct >= m.pct;
      html += `
        <div class="stat-item" style="border: 1px solid ${isUnlocked ? 'var(--accent-emerald)' : 'var(--border-color)'}; background: ${isUnlocked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)'};">
          <div style="font-size: 2rem; margin-bottom: 0.35rem;">${m.icon}</div>
          <span class="stat-label">${m.title}</span>
          <span class="stat-value" style="font-size: 1.1rem; color: ${isUnlocked ? '#34d399' : 'var(--text-muted)'};">
            ${isUnlocked ? 'UNLOCKED ✅' : `Requires ${m.pct}%`}
          </span>
          <span class="stat-sub">${m.desc}</span>
        </div>
      `;
    });

    DOM.trophiesGrid.innerHTML = html;
  }

  // ==========================================================================
  // GENERAL CONTROLS & TIMERS
  // ==========================================================================

  function switchToTab(tabId) {
    state.activeTab = tabId;
    DOM.navTabs.forEach(t => {
      if (t.getAttribute('data-tab') === tabId) t.classList.add('active');
      else t.classList.remove('active');
    });

    DOM.tabPanes.forEach(pane => {
      if (pane.id === tabId) pane.classList.add('active');
      else pane.classList.remove('active');
    });

    // Refresh tab content
    if (tabId === 'tab-daily') renderDailyTargets();
    else if (tabId === 'tab-timetable') renderDailyTimetable();
    else if (tabId === 'tab-progress') renderSubjectCards();
    else if (tabId === 'tab-todo') renderMasterSyllabusTable();
    else if (tabId === 'tab-mocks') renderMockTable();
    else if (tabId === 'tab-motivation') renderMotivationTrophies();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startLiveClock() {
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      if (DOM.liveTimeClock) {
        DOM.liveTimeClock.innerHTML = `<span>🟢</span> Live Clock: ${h}:${m}:${s}`;
      }
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  function updateCountdown() {
    if (!DOM.targetCountdown) return;
    const targetDate = new Date('2027-06-30T23:59:59');
    const now = new Date();
    const diffMs = targetDate - now;

    if (diffMs <= 0) {
      DOM.targetCountdown.innerHTML = '<span>🏆</span> Target Phase Reached!';
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    DOM.targetCountdown.innerHTML = `<span>⏳</span> <strong>${days} Days, ${hours} Hours</strong> Remaining`;
  }

  function triggerMilestoneCelebration(title, message) {
    if (DOM.celebrationTitle) DOM.celebrationTitle.textContent = title;
    if (DOM.celebrationMsg) DOM.celebrationMsg.textContent = message;
    if (DOM.celebrationModal) DOM.celebrationModal.classList.add('active');
  }

  function showToast(msg) {
    if (!DOM.toastNotification) return;
    DOM.toastNotification.textContent = msg;
    DOM.toastNotification.style.display = 'block';
    setTimeout(() => {
      DOM.toastNotification.style.display = 'none';
    }, 2500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // ==========================================================================
  // EVENT LISTENERS BINDING
  // ==========================================================================

  function setupEventListeners() {
    // Theme toggle
    if (DOM.themeToggleBtn) {
      DOM.themeToggleBtn.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    // Navigation Tabs
    DOM.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        switchToTab(tabId);
      });
    });

    // Subject Filter in Tab 1
    if (DOM.subjectCategoryFilter) {
      DOM.subjectCategoryFilter.addEventListener('change', () => {
        renderSubjectCards();
      });
    }

    // Daily Targets Date Navigation
    if (DOM.dailyTaskDatePicker) {
      DOM.dailyTaskDatePicker.addEventListener('change', () => {
        state.selectedTargetDate = DOM.dailyTaskDatePicker.value || getTodayDateStr();
        renderDailyTargets();
      });
    }

    if (DOM.todayDateBtn) {
      DOM.todayDateBtn.addEventListener('click', () => {
        const today = getTodayDateStr();
        state.selectedTargetDate = today;
        DOM.dailyTaskDatePicker.value = today;
        renderDailyTargets();
      });
    }

    if (DOM.dtPrevDayBtn) {
      DOM.dtPrevDayBtn.addEventListener('click', () => {
        state.selectedTargetDate = getOffsetDateStr(state.selectedTargetDate, -1);
        DOM.dailyTaskDatePicker.value = state.selectedTargetDate;
        renderDailyTargets();
      });
    }

    if (DOM.dtNextDayBtn) {
      DOM.dtNextDayBtn.addEventListener('click', () => {
        state.selectedTargetDate = getOffsetDateStr(state.selectedTargetDate, 1);
        DOM.dailyTaskDatePicker.value = state.selectedTargetDate;
        renderDailyTargets();
      });
    }

    // Daily Targets Mode Toggle (Work/Study vs Random)
    if (DOM.btnModeWorkStudy) {
      DOM.btnModeWorkStudy.addEventListener('click', () => setTargetMode('workstudy'));
    }
    if (DOM.btnModeRandom) {
      DOM.btnModeRandom.addEventListener('click', () => setTargetMode('random'));
    }

    // Live preview for subject link in daily targets
    if (DOM.dtWorkStudySubject) {
      DOM.dtWorkStudySubject.addEventListener('change', () => {
        updateSubjectLinkPreview();
      });
    }

    // Form: Add Work / Study Task
    if (DOM.workStudyTaskForm) {
      DOM.workStudyTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = DOM.dtWorkStudyTitle.value.trim();
        const category = DOM.dtWorkStudyCategory.value;
        const subjectId = DOM.dtWorkStudySubject.value;
        const hours = DOM.dtWorkStudyHours.value.trim() || '1.0 hr';
        const priority = DOM.dtWorkStudyPriority.value;

        if (!title) return;

        const curDate = state.selectedTargetDate;
        if (!state.dailyTargets[curDate]) state.dailyTargets[curDate] = [];

        const newTask = {
          id: 'target_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          type: subjectId ? 'study' : 'work',
          title: title,
          category: category,
          subjectId: subjectId,
          hours: hours,
          priority: priority,
          completed: false,
          date: curDate
        };

        state.dailyTargets[curDate].push(newTask);
        saveState();
        renderDailyTargets();
        DOM.dtWorkStudyTitle.value = '';
        showToast('Work / Study target added');
      });
    }

    // Form: Add Random Addition Task
    if (DOM.randomTaskForm) {
      DOM.randomTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = DOM.dtRandomTitle.value.trim();
        const category = DOM.dtRandomCategory.value;
        const priority = DOM.dtRandomPriority.value;

        if (!title) return;

        const curDate = state.selectedTargetDate;
        if (!state.dailyTargets[curDate]) state.dailyTargets[curDate] = [];

        const newTask = {
          id: 'target_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          type: 'random',
          title: title,
          category: category,
          subjectId: '',
          hours: '',
          priority: priority,
          completed: false,
          date: curDate
        };

        state.dailyTargets[curDate].push(newTask);
        saveState();
        renderDailyTargets();
        DOM.dtRandomTitle.value = '';
        showToast('Random task added');
      });
    }

    // Filter Chips for Daily Targets
    DOM.dailyFilterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        DOM.dailyFilterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.dailyFilter = chip.getAttribute('data-daily-filter');
        renderDailyTargets();
      });
    });

    // Clear Completed Targets
    if (DOM.clearCompletedDailyTasksBtn) {
      DOM.clearCompletedDailyTasksBtn.addEventListener('click', () => {
        const curDate = state.selectedTargetDate;
        if (!state.dailyTargets[curDate]) return;
        state.dailyTargets[curDate] = state.dailyTargets[curDate].filter(t => !t.completed);
        saveState();
        renderDailyTargets();
        showToast('Completed targets cleared');
      });
    }

    // Copy Yesterday Pending Tasks
    if (DOM.copyYesterdayPendingBtn) {
      DOM.copyYesterdayPendingBtn.addEventListener('click', () => {
        const curDate = state.selectedTargetDate;
        const yesterday = getOffsetDateStr(curDate, -1);
        const yTargets = state.dailyTargets[yesterday] || [];
        const pending = yTargets.filter(t => !t.completed);

        if (pending.length === 0) {
          showToast('No pending targets from yesterday found');
          return;
        }

        if (!state.dailyTargets[curDate]) state.dailyTargets[curDate] = [];
        pending.forEach(t => {
          state.dailyTargets[curDate].push({
            ...t,
            id: 'target_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            completed: false,
            date: curDate
          });
        });

        saveState();
        renderDailyTargets();
        showToast(`Copied ${pending.length} pending targets from yesterday!`);
      });
    }

    // Clear All Date Targets
    if (DOM.clearAllDateTargetsBtn) {
      DOM.clearAllDateTargetsBtn.addEventListener('click', () => {
        const curDate = state.selectedTargetDate;
        if (confirm(`Clear all targets for ${formatDisplayDate(curDate)}?`)) {
          state.dailyTargets[curDate] = [];
          saveState();
          renderDailyTargets();
          showToast('All targets cleared for this date');
        }
      });
    }

    // Timetable Date Navigation
    if (DOM.ttDatePicker) {
      DOM.ttDatePicker.addEventListener('change', () => {
        state.selectedTimetableDate = DOM.ttDatePicker.value || getTodayDateStr();
        renderDailyTimetable();
      });
    }

    if (DOM.ttTodayBtn) {
      DOM.ttTodayBtn.addEventListener('click', () => {
        const today = getTodayDateStr();
        state.selectedTimetableDate = today;
        DOM.ttDatePicker.value = today;
        renderDailyTimetable();
      });
    }

    if (DOM.ttPrevDayBtn) {
      DOM.ttPrevDayBtn.addEventListener('click', () => {
        state.selectedTimetableDate = getOffsetDateStr(state.selectedTimetableDate, -1);
        DOM.ttDatePicker.value = state.selectedTimetableDate;
        renderDailyTimetable();
      });
    }

    if (DOM.ttNextDayBtn) {
      DOM.ttNextDayBtn.addEventListener('click', () => {
        state.selectedTimetableDate = getOffsetDateStr(state.selectedTimetableDate, 1);
        DOM.ttDatePicker.value = state.selectedTimetableDate;
        renderDailyTimetable();
      });
    }

    // Timetable Toolbar Buttons
    if (DOM.openAddSlotModalBtn) {
      DOM.openAddSlotModalBtn.addEventListener('click', () => openSlotEditorModal());
    }

    if (DOM.copyYesterdayTimetableBtn) {
      DOM.copyYesterdayTimetableBtn.addEventListener('click', () => {
        const curDate = state.selectedTimetableDate;
        const yesterday = getOffsetDateStr(curDate, -1);
        const ySlots = state.dailyTimetables[yesterday] || [];

        if (ySlots.length === 0) {
          showToast('No timetable found on previous day to copy');
          return;
        }

        state.dailyTimetables[curDate] = ySlots.map(s => ({
          ...s,
          id: 'slot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          completed: false
        }));

        saveState();
        renderDailyTimetable();
        showToast(`Copied ${ySlots.length} schedule slots from yesterday!`);
      });
    }

    if (DOM.clearDateTimetableBtn) {
      DOM.clearDateTimetableBtn.addEventListener('click', () => {
        const curDate = state.selectedTimetableDate;
        if (confirm(`Clear schedule for ${formatDisplayDate(curDate)}?`)) {
          state.dailyTimetables[curDate] = [];
          saveState();
          renderDailyTimetable();
          showToast('Schedule cleared for this date');
        }
      });
    }

    // Timetable Slot Modal Close & Submit
    if (DOM.closeSlotModalBtn) DOM.closeSlotModalBtn.addEventListener('click', closeSlotEditorModal);
    if (DOM.cancelSlotModalBtn) DOM.cancelSlotModalBtn.addEventListener('click', closeSlotEditorModal);
    if (DOM.slotEditorForm) DOM.slotEditorForm.addEventListener('submit', saveSlotFromModal);

    // Master Syllabus Search & Filter
    if (DOM.todoSearchInput) {
      DOM.todoSearchInput.addEventListener('input', (e) => {
        state.todoSearch = e.target.value.trim();
        state.currentPage = 1;
        renderMasterSyllabusTable();
      });
    }

    if (DOM.todoSubjectFilter) {
      DOM.todoSubjectFilter.addEventListener('change', (e) => {
        state.todoSubject = e.target.value;
        state.currentPage = 1;
        renderMasterSyllabusTable();
      });
    }

    DOM.filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        DOM.filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.todoFilter = chip.getAttribute('data-filter');
        state.currentPage = 1;
        renderMasterSyllabusTable();
      });
    });

    if (DOM.prevPageBtn) {
      DOM.prevPageBtn.addEventListener('click', () => {
        if (state.currentPage > 1) {
          state.currentPage--;
          renderMasterSyllabusTable();
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }
      });
    }

    if (DOM.nextPageBtn) {
      DOM.nextPageBtn.addEventListener('click', () => {
        const total = Math.ceil(getFilteredMasterLectures().length / state.pageSize);
        if (state.currentPage < total) {
          state.currentPage++;
          renderMasterSyllabusTable();
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }
      });
    }

    // Batch Actions on Visible Lectures
    if (DOM.markAllVisibleDoneBtn) {
      DOM.markAllVisibleDoneBtn.addEventListener('click', () => {
        const visible = getFilteredMasterLectures();
        visible.forEach(row => {
          state.lectures[row.sNo] = { watched: true, notes: true, revision: true, question: true };
        });
        saveState();
        updateAllHeroMetrics();
        renderSubjectCards();
        renderMasterSyllabusTable();
        showToast(`Marked ${visible.length} lectures as done!`);
      });
    }

    if (DOM.resetAllVisibleBtn) {
      DOM.resetAllVisibleBtn.addEventListener('click', () => {
        const visible = getFilteredMasterLectures();
        visible.forEach(row => {
          delete state.lectures[row.sNo];
        });
        saveState();
        updateAllHeroMetrics();
        renderSubjectCards();
        renderMasterSyllabusTable();
        showToast(`Reset marks for ${visible.length} lectures.`);
      });
    }

    // Mock Search
    if (DOM.mockSearchInput) {
      DOM.mockSearchInput.addEventListener('input', () => {
        renderMockTable();
      });
    }

    // Export & Import
    if (DOM.exportBtn) {
      DOM.exportBtn.addEventListener('click', () => {
        const exportData = {
          exportDate: new Date().toISOString(),
          version: '3.0',
          lectures: state.lectures,
          mocks: state.mocks,
          dailyTargets: state.dailyTargets,
          dailyTimetables: state.dailyTimetables,
          streak: state.streak
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Mission2026_StudyTracker_Backup_${getTodayDateStr()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Backup JSON exported successfully');
      });
    }

    if (DOM.importBtn && DOM.importFileInput) {
      DOM.importBtn.addEventListener('click', () => DOM.importFileInput.click());
      DOM.importFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target.result);
            if (imported.lectures) state.lectures = imported.lectures;
            if (imported.mocks) state.mocks = imported.mocks;
            if (imported.dailyTargets) state.dailyTargets = imported.dailyTargets;
            if (imported.dailyTimetables) state.dailyTimetables = imported.dailyTimetables;
            if (imported.streak) state.streak = imported.streak;
            saveState();
            init();
            showToast('Progress imported successfully');
          } catch (err) {
            alert('Invalid JSON backup file.');
          }
        };
        reader.readAsText(file);
      });
    }

    if (DOM.printBtn) {
      DOM.printBtn.addEventListener('click', () => window.print());
    }

    // Reset Confirmation
    if (DOM.resetBtn) {
      DOM.resetBtn.addEventListener('click', () => {
        DOM.resetConfirmModal.classList.add('active');
      });
    }

    if (DOM.cancelResetBtn) {
      DOM.cancelResetBtn.addEventListener('click', () => {
        DOM.resetConfirmModal.classList.remove('active');
      });
    }

    if (DOM.confirmResetBtn) {
      DOM.confirmResetBtn.addEventListener('click', () => {
        state.lectures = {};
        state.mocks = {};
        state.dailyTargets = {};
        state.dailyTimetables = {};
        saveState();
        DOM.resetConfirmModal.classList.remove('active');
        init();
        showToast('All progress has been reset cleanly');
      });
    }

    if (DOM.closeCelebrationBtn) {
      DOM.closeCelebrationBtn.addEventListener('click', () => {
        DOM.celebrationModal.classList.remove('active');
      });
    }
  }

  // Start Application on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
