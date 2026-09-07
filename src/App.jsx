import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import WaterGlass from './components/WaterGlass';
import StreakBadge from './components/StreakBadge';
import { useLocalStorage, getTodayKey } from './useStorage';
import { playDrinkSound, playGoalSound } from './sounds';

const PRESETS = [1500, 2000, 2500, 3000];
const QUICK_AMOUNTS = [150, 250, 350, 500];

function formatTime(d) {
  return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function App() {
  const [goal, setGoal] = useLocalStorage('aqua_goal', 2000);
  const [goalInput, setGoalInput] = useState(String(goal));
  const [logAmount, setLogAmount] = useState(250);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('aqua_sound', true);
  const [history, setHistory] = useLocalStorage('aqua_history', {});
  const [streak, setStreak] = useLocalStorage('aqua_streak', { count: 0, lastDate: null });
  const [celebrated, setCelebrated] = useState(false);
  const prevDone = useRef(false);

  const today = getTodayKey();
  const todayEntries = history[today] || [];
  const total = todayEntries.reduce((s, e) => s + e.amount, 0);
  const pct = goal > 0 ? Math.min(total / goal, 1) : 0;
  const remaining = Math.max(goal - total, 0);
  const done = total >= goal && goal > 0;

  useEffect(() => {
    if (done && streak.lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yKey = yesterday.toISOString().slice(0, 10);
      const newCount = streak.lastDate === yKey ? streak.count + 1 : 1;
      setStreak({ count: newCount, lastDate: today });
    }
  }, [done, today]);

  useEffect(() => {
    if (done && !prevDone.current) {
      setCelebrated(true);
      if (soundEnabled) playGoalSound();
    }
    if (!done) setCelebrated(false);
    prevDone.current = done;
  }, [done, soundEnabled]);

  function handleGoalBlur() {
    const v = parseInt(goalInput, 10);
    if (!isNaN(v) && v >= 100) { setGoal(v); }
    else setGoalInput(String(goal));
  }

  function handleGoalChange(e) {
    setGoalInput(e.target.value);
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v) && v >= 100) setGoal(v);
  }

  function addEntry() {
    if (logAmount <= 0) return;
    const entry = { amount: logAmount, time: Date.now(), id: Date.now() };
    setHistory(prev => ({
      ...prev,
      [today]: [entry, ...(prev[today] || [])],
    }));
    if (soundEnabled) playDrinkSound();
  }

  function removeEntry(id) {
    setHistory(prev => ({
      ...prev,
      [today]: (prev[today] || []).filter(e => e.id !== id),
    }));
  }

  function clearToday() {
    setHistory(prev => ({ ...prev, [today]: [] }));
    setCelebrated(false);
    prevDone.current = false;
  }

  const pastDays = Object.entries(history)
    .filter(([k]) => k !== today)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 14);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="header">
          <div>
            <div className="app-title">Aqua</div>
            <div className="app-subtitle">Daily hydration tracker</div>
          </div>
          <button
            className={`sound-btn${soundEnabled ? ' active' : ''}`}
            onClick={() => setSoundEnabled(s => !s)}
            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled ? '🔔' : '🔕'}
          </button>
        </div>

        {streak.count > 0 && (
          <div className="streak-wrap">
            <StreakBadge streak={streak.count} />
          </div>
        )}

        <div className="tracker-section">
          <div className="glass-wrap">
            <WaterGlass pct={pct} />
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${Math.round(pct * 100)}%` }} />
          </div>
          <div className="progress-label">
            {Math.round(pct * 100)}% of {goal} ml goal
          </div>
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-value">{total}</div>
              <div className="stat-label">ml consumed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{remaining}</div>
              <div className="stat-label">ml remaining</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{todayEntries.length}</div>
              <div className="stat-label">entries</div>
            </div>
          </div>
        </div>

        <div className="goal-section">
          <div className="section-label">Daily goal</div>
          <div className="goal-row">
            <div className="goal-input-wrap">
              <input
                className="goal-input"
                type="number"
                value={goalInput}
                onChange={handleGoalChange}
                onBlur={handleGoalBlur}
                min="100"
                max="9999"
              />
              <span className="goal-unit">ml</span>
            </div>
          </div>
          <div className="preset-btns">
            {PRESETS.map(p => (
              <button
                key={p}
                className={`preset-btn${goal === p ? ' active' : ''}`}
                onClick={() => { setGoal(p); setGoalInput(String(p)); }}
              >{p} ml</button>
            ))}
          </div>
        </div>
      </aside>

      <main className="main-content">
        {celebrated && (
          <div className="celebration-banner">
            <div className="celebration-emoji">🎉</div>
            <div className="celebration-text">Goal reached! Amazing work!</div>
            <div className="celebration-sub">You've drunk {total} ml today — keep it up!</div>
          </div>
        )}

        <div className="log-section">
          <div className="section-label">Log water</div>
          <div className="log-amount-row">
            <button className="amount-btn" onClick={() => setLogAmount(a => Math.max(50, a - 50))}>−</button>
            <div className="amount-display">
              {logAmount} <span className="amount-sub">ml</span>
            </div>
            <button className="amount-btn" onClick={() => setLogAmount(a => a + 50)}>+</button>
            <div className="quick-amounts">
              {QUICK_AMOUNTS.map(a => (
                <button key={a} className={`quick-btn${logAmount === a ? ' active' : ''}`} onClick={() => setLogAmount(a)}>{a} ml</button>
              ))}
            </div>
            <button className="log-btn" onClick={addEntry}>
              💧 Log {logAmount} ml
            </button>
          </div>
        </div>

        <div className="panels">
          <div className="history-section panel">
            <div className="history-header">
              <div className="section-label" style={{ marginBottom: 0 }}>Today's log</div>
              {todayEntries.length > 0 && (
                <button className="clear-btn" onClick={clearToday}>Clear today</button>
              )}
            </div>
            <div className="history-list">
              {todayEntries.length === 0 && (
                <div className="empty-history">No entries yet — start drinking! 💧</div>
              )}
              {todayEntries.map(e => (
                <div key={e.id} className="history-item">
                  <span className="history-icon">💧</span>
                  <span className="history-amount">{e.amount} ml</span>
                  <span className="history-time">{formatTime(e.time)}</span>
                  <button className="history-del" onClick={() => removeEntry(e.id)}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="past-section panel">
            <div className="section-label">Past 14 days</div>
            <div className="past-list">
              {pastDays.length === 0 && (
                <div className="empty-history" style={{ padding: '2rem 0' }}>
                  No history yet. Start tracking today!
                </div>
              )}
              {pastDays.map(([date, entries]) => {
                const dayTotal = entries.reduce((s, e) => s + e.amount, 0);
                const dayPct = Math.min(dayTotal / goal, 1);
                const dayDone = dayTotal >= goal;
                return (
                  <div key={date} className={`past-day-card${dayDone ? ' done' : ''}`}>
                    <div className="past-day-header">
                      <div>
                        <div className="past-day-date">{formatDate(date)}</div>
                        <div className="past-day-count">{entries.length} entries</div>
                      </div>
                      <div className="past-day-right">
                        <div className="past-day-total">{dayTotal} ml</div>
                        {dayDone && <span className="past-done-badge">✓ Goal met</span>}
                      </div>
                    </div>
                    <div className="progress-bar-wrap" style={{ marginTop: 8 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.round(dayPct * 100)}%`,
                          background: dayDone ? '#3db87a' : '#3b9edd',
                        }}
                      />
                    </div>
                    <div className="progress-label">{Math.round(dayPct * 100)}% of {goal} ml</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
