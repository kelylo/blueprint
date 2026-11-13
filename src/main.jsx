import { StrictMode, useMemo, useState } from 'react';
import { ChevronRight, MapPin, Pencil, Plus, RotateCcw, Trash2, UserRound, X } from 'lucide-react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
const rows = [
  ['Saturday', '16:00', '17:30', 'Secondary Systems', 'HAMMOUCHE', 'EAD', 'Lecture'],
  ['Sunday', '08:00', '09:30', 'Structural Design', 'BOUDJELLAL', 'A2', 'Lecture'], ['Sunday', '09:30', '11:00', 'Structural Design', 'BOUDJELLAL', 'A2', 'Lecture'], ['Sunday', '11:00', '12:30', 'TD CDS', 'BOUDJELLAL', 'A4', 'TD'], ['Sunday', '13:00', '16:00', 'Measurement & Pricing', 'ALIOUI', 'A2', 'Lecture'], ['Sunday', '14:00', '15:30', 'Measurement & Pricing', 'ALIOUI', 'A2', 'Lecture'],
  ['Monday', '08:00', '09:30', 'Strengthening of Structures', 'MAGHAGHI', 'D1', 'Lecture'], ['Monday', '09:30', '11:00', 'DDS 1', 'Mme. BELGASMIA', 'A5', 'Lecture'], ['Monday', '11:00', '12:30', 'TD RRS', 'MAGHAGHI', 'A2', 'TD'], ['Monday', '12:30', '14:00', 'TD DDS', 'Mme. BELGASMIA', 'A2', 'TD'],
  ['Tuesday', '09:30', '11:00', 'Experimental Design Lab', 'DOUADI', 'S INF', 'TP'], ['Tuesday', '11:00', '12:30', 'Experimental Design', 'DOUADI', 'A2', 'Lecture'], ['Tuesday', '13:00', '16:00', 'Numerical Calculations in Civil Engineering', 'M. BELGASMIA', 'A2', 'TP'],
  ['Wednesday', '08:00', '09:30', 'Mechanics of Continuous Media 1', 'MANSOURI', 'A2', 'Lecture'], ['Wednesday', '09:30', '11:00', 'Mechanics of Continuous Media 1', 'MANSOURI', 'A2', 'Lecture'], ['Wednesday', '11:00', '12:30', 'MMC 1 Tutorial', 'MANSOURI', 'A2', 'TD'], ['Wednesday', '12:30', '14:00', 'Python Lab', 'SAADI', 'Gi / 15 days', 'TP'], ['Wednesday', '14:00', '15:30', 'Python Programming', 'SAADI', 'A8', 'Lecture'],
  ['Thursday', '08:00', '17:00', 'Professional Project', 'Internship', 'N/A', 'Project'],
].map(([day, start, end, subject, teacher, room, type], index) => ({ id: `session-${index}`, day, start, end, subject, teacher, room, type }));
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
];
const shuffle = (items) => { const copy = [...items]; for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; } return copy; };
function createQuestions(schedule) {
  const questions = [];
  schedule.forEach((session) => {
    const subjects = schedule.filter((item) => item.subject !== session.subject).map((item) => item.subject);
    const teachers = schedule.filter((item) => item.teacher !== session.teacher).map((item) => item.teacher);
    const rooms = schedule.filter((item) => item.room !== session.room).map((item) => item.room);
    const starts = schedule.filter((item) => item.start !== session.start).map((item) => item.start);
    questions.push(
      { text: `What subject is scheduled on ${session.day} at ${session.start}?`, answer: session.subject, options: shuffle([session.subject, ...shuffle(subjects).slice(0, 3)]) },
      { text: `Who teaches ${session.subject} on ${session.day}?`, answer: session.teacher, options: shuffle([session.teacher, ...shuffle(teachers).slice(0, 3)]) },
      { text: `Which room hosts ${session.subject} on ${session.day}?`, answer: session.room, options: shuffle([session.room, ...shuffle(rooms).slice(0, 3)]) },
      { text: `When does ${session.subject} start on ${session.day}?`, answer: session.start, options: shuffle([session.start, ...shuffle(starts).slice(0, 3)]) },
    );
  });
  DAYS.forEach((day) => { const count = schedule.filter((session) => session.day === day).length; if (count) questions.push({ text: `How many sessions are scheduled on ${day}?`, answer: String(count), options: shuffle([String(count), String(count + 1), String(Math.max(1, count - 1)), String(count + 2)]) }); });
  civil.forEach(([text, answer, wrong]) => questions.push({ text, answer, options: shuffle([answer, ...wrong]) }));
  const expanded = []; while (expanded.length < 100) expanded.push(...shuffle(questions)); return shuffle(expanded).slice(0, 100);
}
function App() {
  const [schedule, setSchedule] = useState(() => JSON.parse(localStorage.getItem('blueprint-schedule') || 'null') || rows);
  const [unlocked, setUnlocked] = useState(false); const [questions, setQuestions] = useState(() => createQuestions(schedule)); const [index, setIndex] = useState(0); const [selected, setSelected] = useState(null); const [submitted, setSubmitted] = useState(false); const [score, setScore] = useState(0); const [day, setDay] = useState('Saturday'); const [view, setView] = useState('cards'); const [modal, setModal] = useState(null);
  const sessions = useMemo(() => schedule.filter((session) => session.day === day).sort((a, b) => a.start.localeCompare(b.start)), [schedule, day]); const current = questions[index];
  const persist = (next) => { setSchedule(next); localStorage.setItem('blueprint-schedule', JSON.stringify(next)); };
  const restart = () => { setQuestions(createQuestions(schedule)); setIndex(0); setSelected(null); setSubmitted(false); setScore(0); setUnlocked(false); };
  const submit = () => { if (selected === null) return; setSubmitted(true); if (current.options[selected] === current.answer) setScore((value) => value + 1); };
  const next = () => { if (index === 99) setUnlocked(true); else { setIndex((value) => value + 1); setSelected(null); setSubmitted(false); } };
  const removeDay = (target) => { if (!window.confirm(`Delete all sessions on ${target}?`)) return; const nextSchedule = schedule.filter((session) => session.day !== target); persist(nextSchedule); if (day === target) setDay(DAYS.find((item) => nextSchedule.some((session) => session.day === item)) || DAYS[0]); };
  return <main className="app-shell">
    <header className="topbar"><div className="brand"><img src="/logo.png" alt="Blueprint" /><div><strong>BLUEPRINT</strong><span>Civil engineering studio</span></div></div><button className="icon-button" onClick={restart} aria-label="Restart verification"><RotateCcw size={18} /></button></header>
    {!unlocked ? <section><div className="hero"><span className="eyebrow">Knowledge check · 100 questions</span><h1>Know your week<br /><em>before you go.</em></h1><p>Answer a fresh sequence about your timetable and civil engineering before your schedule becomes available.</p></div><div className="quiz-card"><div className="progress-row"><span>Question {index + 1} of 100</span><span>{score} correct</span></div><div className="progress-track"><i style={{ width: `${index}%` }} /></div><span className="question-label">Question {String(index + 1).padStart(2, '0')}</span><h2>{current.text}</h2><div className="answers">{current.options.map((option, optionIndex) => <button key={`${option}-${optionIndex}`} className={`answer ${selected === optionIndex ? 'selected' : ''} ${submitted && option === current.answer ? 'correct' : ''} ${submitted && selected === optionIndex && option !== current.answer ? 'incorrect' : ''}`} onClick={() => !submitted && setSelected(optionIndex)} disabled={submitted}><span className="answer-dot" />{option}</button>)}</div><div className={`feedback ${submitted ? (current.options[selected] === current.answer ? 'success' : 'error') : ''}`}>{submitted ? (current.options[selected] === current.answer ? 'Correct. Well done.' : `Incorrect. The correct answer is ${current.answer}.`) : ''}</div><button className="primary-button" disabled={selected === null} onClick={submitted ? next : submit}>{submitted ? (index === 99 ? 'Finish verification' : 'Next question') : 'Confirm answer'}<ChevronRight size={17} /></button></div></section> : <Schedule schedule={schedule} sessions={sessions} day={day} setDay={setDay} view={view} setView={setView} setModal={setModal} removeDay={removeDay} removeSession={(id) => persist(schedule.filter((session) => session.id !== id))} />}
    {modal && <SessionModal value={modal} day={day} onClose={() => setModal(null)} onSave={(session) => { const nextSchedule = modal.id ? schedule.map((item) => item.id === modal.id ? session : item) : [...schedule, session]; persist(nextSchedule); setDay(session.day); setModal(null); }} />}
  </main>;
}
function Schedule({ schedule, sessions, day, setDay, view, setView, setModal, removeDay, removeSession }) {
  return <section><div className="schedule-heading"><div><span className="eyebrow">Unlocked schedule</span><h1>Your timetable</h1><p>{day} · {sessions.length} session{sessions.length === 1 ? '' : 's'}</p></div><button className="secondary-button" onClick={() => setModal({})}><Plus size={16} /> Add session</button></div><div className="toolbar"><div className="segmented"><button className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')}>Card view</button><button className={view === 'roadmap' ? 'active' : ''} onClick={() => setView('roadmap')}>Roadmap</button></div></div><div className="days">{DAYS.filter((item) => schedule.some((session) => session.day === item) || item === day).map((item) => <button key={item} className={`day-button ${day === item ? 'active' : ''}`} onClick={(event) => event.target.closest('.remove-day') ? removeDay(item) : setDay(item)}>{item}<span className="remove-day">×</span></button>)}</div>{sessions.length === 0 ? <div className="empty-state">No sessions on this day.<br />Use “Add session” to create one.</div> : view === 'cards' ? <div className="session-grid">{sessions.map((session) => <SessionCard key={session.id} session={session} onEdit={() => setModal(session)} onDelete={() => removeSession(session.id)} />)}</div> : <div className="roadmap">{sessions.map((session) => <div className="road-item" key={session.id}><div className="road-time">{session.start}<small>{session.end}</small></div><div className="road-line"><i /></div><div className="road-content"><strong>{session.subject}</strong><span>{session.teacher} · Room {session.room} · {session.type}</span></div></div>)}</div>}</section>;
}
function SessionCard({ session, onEdit, onDelete }) { return <article className="session-card"><div className="session-top"><span>{session.start} – {session.end}</span><b>{session.type}</b></div><h2>{session.subject}</h2><div className="session-meta"><span><UserRound size={14} />{session.teacher}</span><span><MapPin size={14} />Room {session.room}</span></div><div className="card-actions"><button onClick={onEdit} aria-label="Edit session"><Pencil size={14} /></button><button className="delete" onClick={onDelete} aria-label="Delete session"><Trash2 size={14} /></button></div></article>; }
function SessionModal({ value, day, onClose, onSave }) {
  const [form, setForm] = useState(value.id ? value : { id: `session-${Date.now()}`, day, start: '08:00', end: '09:30', subject: '', teacher: '', room: '', type: 'Lecture' }); const update = (key, next) => setForm((current) => ({ ...current, [key]: next }));
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><form className="modal" onSubmit={(event) => { event.preventDefault(); onSave(form); }}><div className="modal-heading"><h2>{value.id ? 'Edit session' : 'Add session'}</h2><button type="button" onClick={onClose}><X size={18} /></button></div><label>Subject<input required value={form.subject} onChange={(event) => update('subject', event.target.value)} placeholder="Structural design" /></label><div className="two-col"><label>Teacher<input required value={form.teacher} onChange={(event) => update('teacher', event.target.value)} /></label><label>Room<input required value={form.room} onChange={(event) => update('room', event.target.value)} /></label><label>Type<select value={form.type} onChange={(event) => update('type', event.target.value)}><option>Lecture</option><option>TD</option><option>TP</option><option>Project</option></select></label><label>Day<select value={form.day} onChange={(event) => update('day', event.target.value)}>{DAYS.map((item) => <option key={item}>{item}</option>)}</select></label><label>Start<input required type="time" value={form.start} onChange={(event) => update('start', event.target.value)} /></label><label>End<input required type="time" value={form.end} onChange={(event) => update('end', event.target.value)} /></label></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button">Save session</button></div></form></div>;
}
createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
