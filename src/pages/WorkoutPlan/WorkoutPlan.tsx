import { useState } from "react";
import { INITIAL_WORKOUT_PLAN, DAYS, TODAY_DAY } from "../../data/mockData";

import Modal from "../../components/Modal";
import "./WorkoutPlan.css";

/**
 * WorkoutPlan page
 * Props:
 *   navigate         – fn(screenId)
 *   setTimerMinutes  – fn(number): sets the timer value before navigating to StartWorkout
 */
interface WorkoutPlanProps {
  navigate: (path: string) => void;
  setTimerMinutes: (minutes: number) => void;
}
export default function WorkoutPlan({ navigate, setTimerMinutes }: WorkoutPlanProps) {
  const [plan,       setPlan]       = useState<Record<string, any>>(INITIAL_WORKOUT_PLAN);
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [modal,      setModal]      = useState<string | null>(null); // null | "start" | "add" | "edit"
  const [editTarget, setEditTarget] = useState<any>(null);
  const [startDay,   setStartDay]   = useState<string | null>(null);
  const [timerInput, setTimerInput] = useState(20);
  const [form,       setForm]       = useState({ name: "", sets: 3, reps: 10, type: "Strength" });

  const dayData = plan[selectedDay] || { type: "Rest", exerciseDetails: [] };

  /* ── Modal openers ── */
  const openStart = (day: string, e?: any) => {
    e?.stopPropagation();
    setStartDay(day);
    setTimerInput(20);
    setModal("start");
  };

  const openAdd = () => {
    setForm({ name: "", sets: 3, reps: 10, type: dayData.type || "Strength" });
    setModal("add");
  };

  const openEdit = (ex: any) => {
    setEditTarget(ex);
    setForm({ name: ex.name, sets: ex.sets, reps: ex.reps, type: dayData.type });
    setModal("edit");
  };

  /* ── Confirm actions ── */
  const confirmStart = () => {
    setTimerMinutes(timerInput);
    navigate("start-workout");
    setModal(null);
  };

  const confirmAdd = () => {
    if (!form.name.trim()) return;
    const newEx = { id: Date.now(), name: form.name, sets: +form.sets, reps: +form.reps, image: null };
    setPlan(p => ({
      ...p,
      [selectedDay]: {
        type: form.type,
        exerciseDetails: [...(p[selectedDay]?.exerciseDetails || []), newEx],
      },
    }));
    setModal(null);
  };

  const confirmEdit = () => {
    if (!form.name.trim() || !editTarget) return;
    setPlan(p => ({
      ...p,
      [selectedDay]: {
        ...p[selectedDay],
        exerciseDetails: p[selectedDay].exerciseDetails.map((ex: any) =>
          ex.id === editTarget.id
            ? { ...ex, name: form.name, sets: +form.sets, reps: +form.reps }
            : ex
        ),
      },
    }));
    setModal(null);
  };

  const deleteExercise = (id: number) =>
    setPlan(p => ({
      ...p,
      [selectedDay]: {
        ...p[selectedDay],
        exerciseDetails: p[selectedDay].exerciseDetails.filter((ex: any) => ex.id !== id),
      },
    }));

  return (
    <div className="wp-page screen-enter">

      {/* ── Page header ── */}
      <div className="wp-header">
        <h1 className="page-title" style={{ marginBottom: 0 }}>Workout Plan</h1>
        <div className="wp-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setModal("calendar")}>📅 Calendar</button>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>✏ Edit Plan</button>
        </div>
      </div>

      {/* ── Weekly grid ── */}
      <p className="week-label">This Week</p>
      <div className="week-grid">
        {DAYS.map(day => {
          const dp     = plan[day] || { type: "Rest", exerciseDetails: [] };
          const isRest  = dp.type === "Rest";
          const isToday = day === TODAY_DAY;
          return (
            <div
              key={day}
              className={`week-day-card ${isToday ? "today" : ""} ${isRest ? "rest" : ""} ${selectedDay === day ? "selected" : ""}`}
              onClick={() => setSelectedDay(day)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && setSelectedDay(day)}
            >
              <div className="wdc-day-name">{day}{isToday ? " · Today" : ""}</div>
              <span className={`type-tag ${dp.type}`}>{dp.type}</span>

              {!isRest && dp.exerciseDetails.length > 0 && (
                <p className="wdc-exercises">{dp.exerciseDetails.map((e: any) => e.name).join(", ")}</p>
              )}
              {isRest && <p className="wdc-exercises" style={{ fontStyle: "italic" }}>Rest Day</p>}

              {!isRest && (
                <button className="wdc-start-btn" onClick={e => openStart(day, e)}>▶ Start</button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Day detail tabs ── */}
      <div className="day-tabs" role="tablist">
        {DAYS.map(day => (
          <button
            key={day}
            role="tab"
            aria-selected={selectedDay === day}
            className={`day-tab ${selectedDay === day ? "active" : ""}`}
            onClick={() => setSelectedDay(day)}
          >
            {day === TODAY_DAY ? `${day}` : day}
          </button>
        ))}
      </div>

      {/* ── Day exercises ── */}
      {dayData.exerciseDetails?.length > 0 ? (
        <>
          <p className="day-meta">
            {dayData.exerciseDetails.length * 15} min &nbsp;·&nbsp;
            {dayData.exerciseDetails.length} exercise{dayData.exerciseDetails.length !== 1 ? "s" : ""}
          </p>

          <div className="plan-exercises-grid">
            {dayData.exerciseDetails.map((ex: any) => (
              <div key={ex.id} className="plan-exercise-card">
                <div className="plan-ex-img-wrap">
                  {ex.image
                    ? <img src={ex.image} alt={ex.name} className="plan-ex-img"
                        onError={e => { 
                          (e.target as HTMLImageElement).style.display = "none"; 
                          if ((e.target as HTMLImageElement).parentNode) {
                            ((e.target as HTMLImageElement).parentNode as HTMLElement).querySelector(".plan-ex-img-ph")!.setAttribute("style", "display: flex"); 
                          }
                        }} />
                    : null}
                  <div className="plan-ex-img-ph" style={{ display: ex.image ? "none" : "flex" }}>🏋️</div>
                </div>
                <div className="plan-ex-body">
                  <h4 className="plan-ex-name">{ex.name}</h4>
                  <p  className="plan-ex-meta">{ex.sets} sets × {ex.reps} reps</p>
                  <div className="plan-ex-actions">
                    <button className="btn-icon" onClick={() => openEdit(ex)} aria-label="Edit">✏</button>
                    <button className="btn-icon danger" onClick={() => deleteExercise(ex.id)} aria-label="Delete">🗑</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <button className="btn btn-secondary btn-sm" onClick={openAdd}>＋ Add Exercise</button>
          </div>
        </>
      ) : (
        <div className="empty-day">
          <div className="empty-day-icon">{dayData.type === "Rest" ? "😴" : "➕"}</div>
          <p>{dayData.type === "Rest" ? "Rest day — recovery matters!" : "No exercises yet for this day."}</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={openAdd}>
            ＋ Add Exercise
          </button>
        </div>
      )}

      {/* ─────────────── MODALS ─────────────── */}

      {/* Start modal */}
      {modal === "start" && (
        <Modal
          title={`Start Workout — ${startDay}`}
          sub="How many minutes do you want to exercise?"
          onClose={() => setModal(null)}
          onConfirm={confirmStart}
          confirmLabel="▶ Start Timer"
        >
          <div className="form-field">
            <label>Duration (minutes)</label>
            <input
              type="number"
              min={1}
              max={180}
              value={timerInput}
              onChange={e => setTimerInput(+e.target.value)}
            />
          </div>
        </Modal>
      )}

      {/* Add exercise modal */}
      {modal === "add" && (
        <Modal
          title={`Add Exercise — ${selectedDay}`}
          sub="Add a new exercise to your workout plan."
          onClose={() => setModal(null)}
          onConfirm={confirmAdd}
          confirmLabel="＋ Add Exercise"
        >
          <div className="form-field">
            <label>Exercise Name</label>
            <input
              placeholder="e.g. Push-Ups"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="form-field">
            <label>Workout Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {["Strength", "Cardio", "HIIT", "Yoga", "Rest"].map(t => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label>Sets</label>
              <input type="number" min={1} value={form.sets}
                onChange={e => setForm(f => ({ ...f, sets: Number(e.target.value) }))} />
            </div>
            <div className="form-field">
              <label>Reps</label>
              <input type="number" min={1} value={form.reps}
                onChange={e => setForm(f => ({ ...f, reps: Number(e.target.value) }))} />
            </div>
          </div>
        </Modal>
      )}

      {/* Edit exercise modal */}
      {modal === "edit" && (
        <Modal
          title="Edit Exercise"
          sub="Update the exercise details below."
          onClose={() => setModal(null)}
          onConfirm={confirmEdit}
          confirmLabel="✓ Save Changes"
        >
          <div className="form-field">
            <label>Exercise Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="form-row-2">
            <div className="form-field">
              <label>Sets</label>
              <input type="number" min={1} value={form.sets}
                onChange={e => setForm(f => ({ ...f, sets: Number(e.target.value) }))} />
            </div>
            <div className="form-field">
              <label>Reps</label>
              <input type="number" min={1} value={form.reps}
                onChange={e => setForm(f => ({ ...f, reps: Number(e.target.value) }))} />
            </div>
          </div>
        </Modal>
      )}

      {/* Calendar modal */}
      {modal === "calendar" && (
        <Modal
          title="Workout Schedule"
          sub="View and assign planned workout dates."
          onClose={() => setModal(null)}
          onConfirm={() => setModal(null)}
          confirmLabel="✓ Done"
        >
          <div className="calendar-schedule" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            {DAYS.map(day => (
              <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <span style={{ fontWeight: 600 }}>{day}</span>
                <select 
                  value={plan[day]?.type || "Rest"} 
                  onChange={e => {
                    const newType = e.target.value;
                    setPlan(p => ({
                      ...p,
                      [day]: { ...p[day], type: newType, exerciseDetails: p[day]?.exerciseDetails || [] }
                    }));
                  }}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)' }}
                >
                  {["Strength", "Cardio", "HIIT", "Yoga", "Rest"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
