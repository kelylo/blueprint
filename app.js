const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const scheduleSeed = [
  ['Saturday', '16:00', '17:30', 'Secondary Systems', 'HAMMOUCHE', 'EAD', 'Lecture'],
  ['Sunday', '08:00', '09:30', 'Structural Design', 'BOUDJELLAL', 'A2', 'Lecture'], ['Sunday', '09:30', '11:00', 'Structural Design', 'BOUDJELLAL', 'A2', 'Lecture'], ['Sunday', '11:00', '12:30', 'TD CDS', 'BOUDJELLAL', 'A4', 'TD'], ['Sunday', '13:00', '16:00', 'Measurement & Pricing', 'ALIOUI', 'A2', 'Lecture'], ['Sunday', '14:00', '15:30', 'Measurement & Pricing', 'ALIOUI', 'A2', 'Lecture'],
  ['Monday', '08:00', '09:30', 'Strengthening of Structures', 'MAGHAGHI', 'D1', 'Lecture'], ['Monday', '09:30', '11:00', 'DDS 1', 'Mme. BELGASMIA', 'A5', 'Lecture'], ['Monday', '11:00', '12:30', 'TD RRS', 'MAGHAGHI', 'A2', 'TD'], ['Monday', '12:30', '14:00', 'TD DDS', 'Mme. BELGASMIA', 'A2', 'TD'],
  ['Tuesday', '09:30', '11:00', 'Experimental Design Lab', 'DOUADI', 'S INF', 'TP'], ['Tuesday', '11:00', '12:30', 'Experimental Design', 'DOUADI', 'A2', 'Lecture'], ['Tuesday', '13:00', '16:00', 'Numerical Calculations in Civil Engineering', 'M. BELGASMIA', 'A2', 'TP'],
  ['Wednesday', '08:00', '09:30', 'Mechanics of Continuous Media 1', 'MANSOURI', 'A2', 'Lecture'], ['Wednesday', '09:30', '11:00', 'Mechanics of Continuous Media 1', 'MANSOURI', 'A2', 'Lecture'], ['Wednesday', '11:00', '12:30', 'MMC 1 Tutorial', 'MANSOURI', 'A2', 'TD'], ['Wednesday', '12:30', '14:00', 'Python Lab', 'SAADI', 'Gi / 15 days', 'TP'], ['Wednesday', '14:00', '15:30', 'Python Programming', 'SAADI', 'A8', 'Lecture'],
  ['Thursday', '08:00', '17:00', 'Professional Project', 'Internship', 'N/A', 'Project'],
].map((row, id) => ({ id: `session-${id}`, day: row[0], start: row[1], end: row[2], subject: row[3], teacher: row[4], room: row[5], type: row[6] }));
const civil = [
  ['What is the primary purpose of reinforcement in concrete?', 'Tensile strength', ['Waterproofing', 'Insulation', 'Color']],
  ['Which test measures concrete workability?', 'Slump test', ['Compression test', 'Impact test', 'Hardness test']],
  ['What does BIM stand for?', 'Building Information Modeling', ['Basic Infrastructure Management', 'Brick Installation Manual', 'Building Inspection Method']],
  ['What is a dead load?', 'The self-weight of a structure', ['Wind load', 'Live load', 'Seismic load']],
  ['What does a foundation do?', 'Transfers loads to the soil', ['Insulates walls', 'Stores water', 'Supports furniture']],
  ['What is the SI unit of stress?', 'Pascal', ['Newton', 'Joule', 'Watt']],
  ['Which material is a common concrete binder?', 'Cement', ['Sand', 'Gravel', 'Water']],
  ['What does SPT stand for?', 'Standard Penetration Test', ['Soil Profile Test', 'Structural Performance Test', 'Seismic Prospecting Test']],
  ['What does a retaining wall hold back?', 'Soil', ['Roof loads', 'Sound', 'Furniture']],
  ['What is a beam mainly designed to carry?', 'Transverse loads', ['Only heat', 'Water flow', 'Light']],
  ['What is the main purpose of a shear wall?', 'Resist lateral forces', ['Store water', 'Reduce lighting', 'Support furniture']],
  ['Which foundation is commonly used for deep weak soils?', 'Pile foundation', ['Strip footing', 'Raft only', 'Paving slab']],
  ['What does concrete curing primarily control?', 'Moisture and strength development', ['Paint color', 'Steel density', 'Window size']],
  ['What is porosity?', 'The volume of voids in a material', ['The weight of a beam', 'The color of soil', 'The length of a pile']],
  ['What does a slump test measure?', 'Concrete workability', ['Steel hardness', 'Soil color', 'Bridge length']],
  ['Which load changes as people and furniture change?', 'Live load', ['Dead load', 'Self-weight', 'Curing load']],
  ['What is a cantilever beam supported at?', 'One end', ['Both ends', 'No ends', 'Three ends']],
  ['What does a retaining wall resist?', 'Lateral earth pressure', ['Roof heat', 'Traffic noise', 'Concrete color']],
  ['Which material has a high strength-to-weight ratio?', 'Steel', ['Clay', 'Water', 'Glass']],
  ['What is settlement in geotechnical engineering?', 'Downward movement of soil or a foundation', ['A paint finish', 'A type of beam', 'Water evaporation']],
  ['What is the purpose of a lintel?', 'Support above an opening', ['Drain a foundation', 'Measure soil moisture', 'Mix concrete']],
  ['What is a culvert used for?', 'Allow water to pass beneath an obstruction', ['Store cement', 'Test steel', 'Support a crane']],
  ['What does BIM help coordinate?', 'Building information and construction data', ['Only weather reports', 'Personal finances', 'Traffic lights only']],
  ['Which test is used to investigate soil resistance?', 'Standard Penetration Test', ['Slump test', 'Drop test', 'Paint test']],
  ['What does a column primarily carry?', 'Axial loads', ['Water flow', 'Sunlight', 'Sound']],
  ['What is prestressed concrete designed to improve?', 'Performance over longer spans', ['Paint adhesion', 'Room lighting', 'Water color']],
  ['What is erosion?', 'The removal of soil by wind or water', ['Concrete curing', 'Steel welding', 'Floor loading']],
  ['Which drawing communicates dimensions and construction details?', 'Technical drawing', ['Weather chart', 'Invoice only', 'Attendance sheet']],
  ['What is the purpose of a drainage system?', 'Control and convey water', ['Increase paint gloss', 'Reduce steel density', 'Measure room temperature']],
];
const state = { schedule: JSON.parse(localStorage.getItem('blueprint-schedule') || 'null') || scheduleSeed, customDays: JSON.parse(localStorage.getItem('blueprint-days') || '[]'), questions: [], index: 0, selected: null, submitted: false, score: 0, unlocked: false, day: 'Saturday', view: 'cards' };
let installPrompt = null;
const allDays = () => [...DAYS, ...state.customDays];
const shuffle = (items) => { const copy = items.slice(); for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; };
const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text) node.textContent = text; return node; };
const button = (text, className, action) => { const node = el('button', className, text); node.type = 'button'; node.addEventListener('click', action); return node; };
function makeQuestions() {
  const result = [];
  state.schedule.forEach((session) => {
    const answers = (key) => shuffle(state.schedule.filter((item) => item[key] !== session[key]).map((item) => item[key])).slice(0, 3);
    result.push(
      { text: `What subject is scheduled on ${session.day} at ${session.start}?`, answer: session.subject, options: shuffle([session.subject, ...answers('subject')]) },
      { text: `Who teaches ${session.subject} on ${session.day}?`, answer: session.teacher, options: shuffle([session.teacher, ...answers('teacher')]) },
      { text: `Which room hosts ${session.subject} on ${session.day}?`, answer: session.room, options: shuffle([session.room, ...answers('room')]) },
      { text: `When does ${session.subject} start on ${session.day}?`, answer: session.start, options: shuffle([session.start, ...answers('start')]) },
    );
  });
  allDays().forEach((day) => { const count = state.schedule.filter((item) => item.day === day).length; if (count) result.push({ text: `How many sessions are scheduled on ${day}?`, answer: String(count), options: shuffle([String(count), String(count + 1), String(Math.max(1, count - 1)), String(count + 2)]) }); });
  civil.forEach(([text, answer, wrong]) => result.push({ text, answer, options: shuffle([answer, ...wrong]) }));
  return shuffle(result);
}
function save() { localStorage.setItem('blueprint-schedule', JSON.stringify(state.schedule)); }
function saveDays() { localStorage.setItem('blueprint-days', JSON.stringify(state.customDays)); }
function startVerification() { state.questions = [makeQuestions()[0]]; state.index = 0; state.selected = null; state.submitted = false; state.score = 0; state.unlocked = false; render(); }
function render() {
  document.body.innerHTML = '';
  const shell = el('main', 'app-shell'); const header = el('header', 'topbar'); const brand = el('div', 'brand'); const logo = document.createElement('img'); logo.src = '/logo.png'; logo.alt = 'Blueprint'; const brandText = el('div'); brandText.append(el('strong', '', 'BLUEPRINT'), el('span', '', 'Civil engineering studio')); brand.append(logo, brandText); const headerActions = el('div'); if (state.unlocked) headerActions.append(button('Install app', 'secondary-button', installApp)); headerActions.append(button('↻', 'icon-button', startVerification)); header.append(brand, headerActions); shell.append(header);
  if (state.unlocked) renderSchedule(shell); else renderGate(shell); document.body.append(shell);
}
function renderGate(shell) {
  const hero = el('div', 'hero'); hero.append(el('span', 'eyebrow', 'Quick knowledge check')); const title = el('h1'); title.innerHTML = 'Know your week<br><em>before you go.</em>'; hero.append(title, el('p', '', 'Answer one fresh question about your timetable or civil engineering to unlock your schedule.')); shell.append(hero);
  const card = el('div', 'quiz-card'); const q = state.questions[state.index]; const row = el('div', 'progress-row'); row.append(el('span', '', 'One question to unlock'), el('span', '', 'Fresh every time')); card.append(row); const track = el('div', 'progress-track'); const fill = el('i'); fill.style.width = '100%'; track.append(fill); card.append(track); card.append(el('span', 'question-label', 'Question 01'), el('h2', '', q.text));
  const answers = el('div', 'answers'); q.options.forEach((option, index) => { const answer = button('', 'answer', () => { if (!state.submitted) { state.selected = index; render(); } }); answer.append(el('span', 'answer-dot'), el('span', '', option)); if (state.selected === index) answer.classList.add('selected'); if (state.submitted && option === q.answer) answer.classList.add('correct'); if (state.submitted && state.selected === index && option !== q.answer) answer.classList.add('incorrect'); answer.disabled = state.submitted; answers.append(answer); }); card.append(answers);
  const feedback = el('div', `feedback ${state.submitted ? (q.options[state.selected] === q.answer ? 'success' : 'error') : ''}`, state.submitted ? (q.options[state.selected] === q.answer ? 'Correct. Well done.' : `Incorrect. The correct answer is ${q.answer}.`) : ''); card.append(feedback);
  card.append(button(state.submitted ? 'Try another question' : 'Confirm answer', 'primary-button', () => { if (!state.submitted && state.selected !== null) { if (q.options[state.selected] === q.answer) { state.score = 1; state.unlocked = true; } else { state.submitted = true; } render(); } else if (state.submitted) { startVerification(); } })); shell.append(card);
}
function renderSchedule(shell) {
  const sessions = state.schedule.filter((item) => item.day === state.day).sort((a, b) => a.start.localeCompare(b.start)); const heading = el('div', 'schedule-heading'); const info = el('div'); info.append(el('span', 'eyebrow', 'Unlocked schedule'), el('h1', '', 'Your timetable'), el('p', '', `${state.day} · ${sessions.length} session${sessions.length === 1 ? '' : 's'}`)); heading.append(info, button('+ Add session', 'secondary-button', () => openSession())); shell.append(heading);
  const toolbar = el('div', 'toolbar'); const segmented = el('div', 'segmented'); ['cards', 'roadmap'].forEach((view) => segmented.append(button(view === 'cards' ? 'Card view' : 'Roadmap', state.view === view ? 'active' : '', () => { state.view = view; render(); }))); toolbar.append(segmented); shell.append(toolbar);
  const days = el('div', 'days'); allDays().forEach((day) => { const dayButton = button('', `day-button ${state.day === day ? 'active' : ''}`, (event) => { if (event.target.classList.contains('remove-day')) { if (confirm(`Delete all sessions on ${day}?`)) { state.schedule = state.schedule.filter((session) => session.day !== day); if (state.customDays.includes(day)) state.customDays = state.customDays.filter((item) => item !== day); save(); saveDays(); state.day = allDays().find((item) => state.schedule.some((session) => session.day === item)) || DAYS[0]; render(); } } else { state.day = day; render(); } }); dayButton.append(document.createTextNode(day), el('span', 'remove-day', '×')); days.append(dayButton); }); days.append(button('+ Add day', 'day-button', () => { const day = prompt('Name the new day'); if (!day) return; const cleanDay = day.trim(); if (!cleanDay || allDays().includes(cleanDay)) return; state.customDays.push(cleanDay); state.day = cleanDay; saveDays(); render(); })); shell.append(days);
  if (!sessions.length) shell.append(el('div', 'empty-state', 'No sessions on this day. Use “Add session” to create one.')); else if (state.view === 'roadmap') { const roadmap = el('div', 'roadmap'); sessions.forEach((session) => { const item = el('div', 'road-item'); item.innerHTML = `<div class="road-time">${session.start}<small>${session.end}</small></div><div class="road-line"><i></i></div><div class="road-content"><strong>${session.subject}</strong><span>${session.teacher} · Room ${session.room} · ${session.type}</span></div>`; roadmap.append(item); }); shell.append(roadmap); } else { const grid = el('div', 'session-grid'); sessions.forEach((session) => { const card = el('article', 'session-card'); card.innerHTML = `<div class="session-top"><span>${session.start} – ${session.end}</span><b>${session.type}</b></div><h2>${session.subject}</h2><div class="session-meta"><span>${session.teacher}</span><span>Room ${session.room}</span></div>`; const actions = el('div', 'card-actions'); actions.append(button('Edit', '', () => openSession(session)), button('Delete', 'delete', () => { state.schedule = state.schedule.filter((item) => item.id !== session.id); save(); render(); })); card.append(actions); grid.append(card); }); shell.append(grid); }
}
function openSession(session) {
  const modal = el('div', 'modal-backdrop'); const form = el('form', 'modal');   const value = session || { id: `session-${Date.now()}`, day: state.day, start: '08:00', end: '09:30', subject: '', teacher: '', room: '', type: 'Lecture' };
  form.innerHTML = `<div class="modal-heading"><h2>${session ? 'Edit session' : 'Add session'}</h2><button type="button">×</button></div><label>Subject<input name="subject" required value="${value.subject}"></label><div class="two-col"><label>Teacher<input name="teacher" required value="${value.teacher}"></label><label>Room<input name="room" required value="${value.room}"></label><label>Type<select name="type"><option ${value.type === 'Lecture' ? 'selected' : ''}>Lecture</option><option ${value.type === 'TD' ? 'selected' : ''}>TD</option><option ${value.type === 'TP' ? 'selected' : ''}>TP</option><option ${value.type === 'Project' ? 'selected' : ''}>Project</option></select></label><label>Day<select name="day">${allDays().map((day) => `<option ${day === value.day ? 'selected' : ''}>${day}</option>`).join('')}</select></label><label>Start<input name="start" type="time" required value="${value.start}"></label><label>End<input name="end" type="time" required value="${value.end}"></label></div><div class="modal-actions"><button type="button" class="secondary-button">Cancel</button><button class="primary-button">Save session</button></div>`;
  modal.append(form); document.body.append(modal); form.querySelectorAll('button[type="button"]').forEach((close) => close.addEventListener('click', () => modal.remove())); form.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(form)); data.id = value.id; const index = state.schedule.findIndex((item) => item.id === data.id); if (index === -1) state.schedule.push(data); else state.schedule[index] = data; state.day = data.day; save(); modal.remove(); render(); });
}
function installApp() {
  if (!installPrompt) { alert('Use your browser menu and choose “Install app” or “Add to Home Screen”.'); return; }
  installPrompt.prompt();
  installPrompt.userChoice.finally(() => { installPrompt = null; render(); });
}
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); installPrompt = event; if (state.unlocked) render(); });
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
startVerification();
