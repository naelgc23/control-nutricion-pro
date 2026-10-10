import React, { useMemo, useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import '../styles/Dashboard.css';

const MACROS = [
  { key: 'protein', label: 'Proteínas', color: '#ff375f', rgb: '255, 55, 95' },
  { key: 'fats', label: 'Grasas', color: '#ffd60a', rgb: '255, 214, 10' },
  { key: 'carbs', label: 'Carbohidratos', color: '#64d2ff', rgb: '100, 210, 255' },
  { key: 'fiber', label: 'Fibra', color: '#30d158', rgb: '48, 209, 88' }
];

const EXTRA_FIELDS = [
  { key: 'kcal', label: 'Kcal', step: '1' },
  { key: 'protein', label: 'Proteína (g)', step: '0.1' },
  { key: 'fats', label: 'Grasas (g)', step: '0.1' },
  { key: 'carbs', label: 'Hidratos (g)', step: '0.1' },
  { key: 'fiber', label: 'Fibra (g)', step: '0.1' }
];

const EMPTY_TOTALS = { kcal: 0, protein: 0, fats: 0, carbs: 0, fiber: 0 };
const WEEKDAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

function toDateKey(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-');
}

function parseDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatMonthYear(date) {
  const month = date.toLocaleDateString('es-ES', { month: 'long' });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
}

function formatAmount(value) {
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(value);
}

function remainingText(current, target, unit) {
  const difference = target - current;
  if (difference > 0) return `-${formatAmount(difference)} ${unit} restantes`;
  if (difference < 0) return `+${formatAmount(Math.abs(difference))} ${unit} sobre el objetivo`;
  return 'Objetivo alcanzado';
}

function isExtra(consumption) {
  return consumption.isManual === true || (
    consumption.meal === 'Añadido manualmente' && consumption.grams == null
  );
}

function MacroRings({ totals, goals, className = '' }) {
  const radii = [14, 10.5, 7, 3.5];

  return (
    <svg className={`macro-rings ${className}`} viewBox="0 0 32 32" aria-hidden="true">
      {MACROS.map((macro, index) => {
        const radius = radii[index];
        const circumference = 2 * Math.PI * radius;
        const goal = Number(goals[macro.key]) || 0;
        const progress = goal > 0 ? Math.min(Math.max((totals[macro.key] || 0) / goal, 0), 1) : 0;

        return (
          <g key={macro.key}>
            <circle className="ring-track" cx="16" cy="16" r={radius} />
            <circle
              className="ring-progress"
              cx="16"
              cy="16"
              r={radius}
              stroke={macro.color}
              strokeDasharray={`${circumference * progress} ${circumference}`}
              transform="rotate(-90 16 16)"
            />
          </g>
        );
      })}
    </svg>
  );
}

function Dashboard({
  consumptions,
  setConsumptions,
  goals,
  dailyRecords,
  setDailyRecords,
  navigateToTab
}) {
  const today = toDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(today.slice(0, 7));
  const [mealsExpanded, setMealsExpanded] = useState(false);
  const [extraFormOpen, setExtraFormOpen] = useState(false);
  const [extraMacros, setExtraMacros] = useState({
    kcal: '',
    protein: '',
    fats: '',
    carbs: '',
    fiber: ''
  });

  const totalsByDate = useMemo(() => {
    return consumptions.reduce((totals, consumption) => {
      const dateTotals = totals[consumption.date] || { ...EMPTY_TOTALS };
      dateTotals.kcal += Number(consumption.kcal) || 0;
      dateTotals.protein += Number(consumption.protein) || 0;
      dateTotals.fats += Number(consumption.fats) || 0;
      dateTotals.carbs += Number(consumption.carbs) || 0;
      dateTotals.fiber += Number(consumption.fiber) || 0;
      totals[consumption.date] = dateTotals;
      return totals;
    }, {});
  }, [consumptions]);

  const selectedTotals = totalsByDate[selectedDate] || EMPTY_TOTALS;
  const selectedMeals = consumptions.filter(consumption => consumption.date === selectedDate);
  const extraConsumptions = selectedMeals.filter(isExtra);
  const mealTotals = selectedMeals.filter(consumption => !isExtra(consumption)).reduce((totals, consumption) => {
    const mealName = consumption.meal;
    const mealTotalsForType = totals[mealName] || { ...EMPTY_TOTALS };
    Object.keys(EMPTY_TOTALS).forEach(key => {
      mealTotalsForType[key] += Number(consumption[key]) || 0;
    });
    totals[mealName] = mealTotalsForType;
    return totals;
  }, {});
  const mealRows = [
    ...Object.entries(mealTotals).map(([mealName, totals]) => ({
      id: `meal-${mealName}`,
      mealName,
      totals,
      isExtra: false
    })),
    ...extraConsumptions.map(extra => ({
      id: `extra-${extra.id}`,
      mealName: 'Extra',
      totals: extra,
      extraId: extra.id,
      isExtra: true
    }))
  ];
  const mealTypeCount = Object.keys(mealTotals).length + (extraConsumptions.length ? 1 : 0);
  const selectedDay = parseDateKey(selectedDate);
  const selectedMonthKey = selectedDate.slice(0, 7);
  const selectedMonthDate = parseDateKey(`${selectedMonthKey}-01`);
  const selectedMonthLabel = formatMonthYear(selectedMonthDate);
  const selectedDateLabel = selectedDay.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  const weekDays = useMemo(() => {
    const firstDay = parseDateKey(selectedDate);
    firstDay.setDate(firstDay.getDate() - ((firstDay.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() + index);
      return date;
    });
  }, [selectedDate]);

  const calendarDays = useMemo(() => {
    const [year, month] = calendarMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const firstWeekday = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month, 0).getDate();
    return [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
    ];
  }, [calendarMonth]);

  const monthlyStats = useMemo(() => {
    const monthDates = Object.keys(totalsByDate).filter(date => date.startsWith(selectedMonthKey));
    const monthRecords = Object.entries(dailyRecords || {}).filter(([date]) => (
      date.startsWith(selectedMonthKey)
    ));
    const burnedCalories = monthRecords
      .map(([, record]) => record?.burnedCalories)
      .filter(value => (
        value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value))
      ))
      .map(Number);
    const totals = monthDates.reduce((sum, date) => {
      Object.keys(EMPTY_TOTALS).forEach(key => {
        sum[key] += totalsByDate[date][key];
      });
      return sum;
    }, { ...EMPTY_TOTALS });
    const days = monthDates.length || 1;

    return {
      loggedDays: monthDates.length,
      averageKcal: Math.round(totals.kcal / days),
      averageProtein: (totals.protein / days).toFixed(1),
      averageFats: (totals.fats / days).toFixed(1),
      averageCarbs: (totals.carbs / days).toFixed(1),
      averageFiber: (totals.fiber / days).toFixed(1),
      creatineDays: monthRecords.filter(([, record]) => record?.creatineTaken).length,
      averageBurned: burnedCalories.length
        ? Math.round(burnedCalories.reduce((sum, value) => sum + value, 0) / burnedCalories.length)
        : null
    };
  }, [dailyRecords, selectedMonthKey, totalsByDate]);

  const monthGridLabel = formatMonthYear(parseDateKey(`${calendarMonth}-01`));

  const changeCalendarMonth = (offset) => {
    const [year, month] = calendarMonth.split('-').map(Number);
    const nextMonth = new Date(year, month - 1 + offset, 1);
    setCalendarMonth(toDateKey(nextMonth).slice(0, 7));
  };

  const updateDailyRecord = (field, value) => {
    setDailyRecords(previous => ({
      ...previous,
      [selectedDate]: {
        ...(previous[selectedDate] || {}),
        [field]: value
      }
    }));
  };

  const addExtra = (event) => {
    event.preventDefault();
    const invalid = EXTRA_FIELDS.some(({ key }) => (
      extraMacros[key] === '' || !Number.isFinite(Number(extraMacros[key])) || Number(extraMacros[key]) < 0
    ));
    if (invalid) return;

    setConsumptions(previous => [...previous, {
      id: Date.now(),
      date: selectedDate,
      meal: 'Extra',
      foodName: 'Extra',
      isManual: true,
      grams: null,
      ...Object.fromEntries(EXTRA_FIELDS.map(({ key }) => [key, Number(extraMacros[key])]))
    }]);
    setExtraFormOpen(false);
    setExtraMacros({ kcal: '', protein: '', fats: '', carbs: '', fiber: '' });
  };

  const deleteExtra = (id) => {
    if (!window.confirm('¿Eliminar este extra?')) return;
    setConsumptions(previous => previous.filter(consumption => (
      consumption.id !== id || !isExtra(consumption)
    )));
  };

  const openCalendar = () => {
    setCalendarMonth(selectedMonthKey);
    setCalendarOpen(true);
  };

  const caloriesPercentage = goals.calories > 0
    ? (selectedTotals.kcal / goals.calories) * 100
    : 0;
  const caloriesProgress = Math.max(0, Math.min(caloriesPercentage, 100));

  return (
    <div className="dashboard">
      <section className="summary-topline">
        <div>
          <p className="eyebrow">RESUMEN DIARIO</p>
          <h2>{selectedDate === today ? 'Hoy' : selectedDateLabel}</h2>
        </div>
        <button className="icon-button calendar-open-button" type="button" onClick={openCalendar} aria-label="Abrir calendario">
          <Calendar size={20} />
        </button>
      </section>

      <section className="week-strip" aria-label="Seleccionar día de la semana">
        {weekDays.map(date => {
          const dateKey = toDateKey(date);
          const dayTotals = totalsByDate[dateKey] || EMPTY_TOTALS;
          return (
            <button
              type="button"
              key={dateKey}
              className={`week-day ${dateKey === selectedDate ? 'is-selected' : ''} ${dateKey === today ? 'is-today' : ''}`}
              onClick={() => setSelectedDate(dateKey)}
              aria-label={date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              aria-pressed={dateKey === selectedDate}
            >
              <span className="week-day-name">{WEEKDAY_LABELS[date.getDay()]}</span>
              <span className="week-day-ring">
                <MacroRings totals={dayTotals} goals={goals} />
              </span>
            </button>
          );
        })}
      </section>

      <section className={`calories-card ${caloriesPercentage > 100 ? 'is-over-target' : ''}`}>
        <div className="calories-heading">
          <div>
            <span>Calorías consumidas</span>
            <strong>{Math.round(selectedTotals.kcal)} <small>/ {goals.calories} kcal</small></strong>
            <span className="calories-remaining">
              {remainingText(selectedTotals.kcal, Number(goals.calories) || 0, 'kcal')}
            </span>
          </div>
        </div>
        <div className="calories-progress">
          <div className="calories-track">
            <span style={{ width: `${caloriesProgress}%` }} />
          </div>
          <span className="calories-percent">{Math.round(caloriesPercentage)}%</span>
        </div>
      </section>

      <section className="daily-macros-section">
        <div className="macro-grid">
          {MACROS.map(macro => {
            const target = Number(goals[macro.key]) || 0;
            const current = selectedTotals[macro.key];
            const progressPercentage = target > 0 ? (current / target) * 100 : 0;
            const progress = Math.max(0, Math.min(progressPercentage, 100));
            return (
              <article
                className={`macro-card ${progressPercentage > 100 ? 'is-over-target' : ''}`}
                key={macro.key}
                style={{ '--macro-color': macro.color, '--macro-rgb': macro.rgb }}
              >
                <div className="macro-card-copy">
                  <span className="macro-card-label">{macro.label}</span>
                  <strong>{formatAmount(current)}<small> / {formatAmount(target)} g</small></strong>
                  <span className="macro-card-remaining">{remainingText(current, target, 'g')}</span>
                </div>
                <div className="macro-card-progress">
                  <div className="macro-progress-track">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                  <span className="macro-card-percent">{Math.round(progressPercentage)}%</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <button className="add-meal-fab" type="button" onClick={() => navigateToTab('registro')}>
        <Plus size={20} />
        <span>Agregar comida</span>
      </button>

      <section className="daily-habits-grid">
        <label className="habit-tile creatine-tile">
          <span>Creatina</span>
          <input
            type="checkbox"
            checked={dailyRecords[selectedDate]?.creatineTaken ?? false}
            onChange={event => updateDailyRecord('creatineTaken', event.target.checked)}
          />
        </label>
        <label className="habit-tile burned-tile">
          <span className="burned-tile-label">Calorías quemadas</span>
          <span className="burned-input-row">
            <input
              type="number"
              min="0"
              step="1"
              value={dailyRecords[selectedDate]?.burnedCalories ?? ''}
              onChange={event => updateDailyRecord(
                'burnedCalories',
                event.target.value === '' ? null : Number(event.target.value)
              )}
              placeholder="Añadir"
              onWheel={event => event.currentTarget.blur()}
            />
            <span className="burned-input-unit">Kcal</span>
          </span>
        </label>
      </section>

      <section className="meals-section">
        <button
          type="button"
          className="meals-section-toggle"
          onClick={() => setMealsExpanded(expanded => !expanded)}
          aria-expanded={mealsExpanded}
        >
          <span>
            <strong>Comidas registradas</strong>
            <small>{mealTypeCount} {mealTypeCount === 1 ? 'tipo de comida' : 'tipos de comida'}</small>
          </span>
          <ChevronRight size={18} className={mealsExpanded ? 'is-expanded' : ''} />
        </button>
        {mealsExpanded && (
          <div className="meals-content">
            {mealRows.length ? (
              <div className="summary-meals-wrap">
                <table className="summary-meals-table">
                  <thead>
                    <tr>
                      <th>Comida</th>
                      <th>Kcal</th>
                      <th>Pro</th>
                      <th>Gra</th>
                      <th>Hid</th>
                      <th>Fib</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mealRows.map(({ id, mealName, totals, extraId, isExtra: extraRow }) => (
                      <tr key={id}>
                        <td>
                          {extraRow ? (
                            <div className="extra-meal-cell">
                              <span>{mealName}</span>
                              <button
                                type="button"
                                className="delete-extra-button"
                                onClick={() => deleteExtra(extraId)}
                                aria-label="Eliminar extra"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ) : mealName}
                        </td>
                        <td>{Math.round(totals.kcal)}</td>
                        <td>{formatAmount(totals.protein)}g</td>
                        <td>{formatAmount(totals.fats)}g</td>
                        <td>{formatAmount(totals.carbs)}g</td>
                        <td>{formatAmount(totals.fiber)}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-day-message">Aún no hay comidas para este día.</p>
            )}

            <button
              type="button"
              className="add-extra-toggle"
              onClick={() => setExtraFormOpen(open => !open)}
            >
              <Plus size={16} /> Añadir extra manual
            </button>
            {extraFormOpen && (
              <form className="extra-form" onSubmit={addExtra}>
                <div className="extra-form-grid">
                  {EXTRA_FIELDS.map(field => (
                    <label key={field.key}>
                      <span>{field.label}</span>
                      <input
                        type="number"
                        min="0"
                        step={field.step}
                        required
                        value={extraMacros[field.key]}
                        onChange={event => setExtraMacros(previous => ({
                          ...previous,
                          [field.key]: event.target.value
                        }))}
                      />
                    </label>
                  ))}
                </div>
                <button type="submit" className="save-extra-button">Guardar extra</button>
              </form>
            )}
          </div>
        )}
      </section>

      <details className="monthly-summary">
        <summary>Resumen de {selectedMonthLabel}</summary>
        <div className="monthly-summary-grid">
          <MonthlyStat label="Días registrados" value={monthlyStats.loggedDays} />
          <MonthlyStat label="Promedio kcal" value={monthlyStats.averageKcal} />
          <MonthlyStat label="Promedio proteína" value={`${monthlyStats.averageProtein} g`} />
          <MonthlyStat label="Promedio grasas" value={`${monthlyStats.averageFats} g`} />
          <MonthlyStat label="Promedio hidratos" value={`${monthlyStats.averageCarbs} g`} />
          <MonthlyStat label="Promedio fibra" value={`${monthlyStats.averageFiber} g`} />
          <MonthlyStat label="Días con creatina" value={monthlyStats.creatineDays} />
          <MonthlyStat label="Promedio kcal quemadas" value={monthlyStats.averageBurned === null ? '—' : `${monthlyStats.averageBurned} kcal`} />
        </div>
      </details>

      {calendarOpen && (
        <div className="calendar-overlay" onMouseDown={event => {
          if (event.target === event.currentTarget) setCalendarOpen(false);
        }}>
          <section className="calendar-modal" role="dialog" aria-modal="true" aria-labelledby="calendar-title">
            <header className="calendar-modal-header">
              <div>
                <p className="eyebrow">SELECCIONAR FECHA</p>
                <h2 id="calendar-title">{monthGridLabel}</h2>
              </div>
              <button className="icon-button" type="button" onClick={() => setCalendarOpen(false)} aria-label="Cerrar calendario">
                <X size={20} />
              </button>
            </header>
            <div className="calendar-month-controls">
              <button className="icon-button" type="button" onClick={() => changeCalendarMonth(-1)} aria-label="Mes anterior">
                <ChevronLeft size={20} />
              </button>
              <span>{monthGridLabel}</span>
              <button className="icon-button" type="button" onClick={() => changeCalendarMonth(1)} aria-label="Mes siguiente">
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="calendar-grid">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                <span className="calendar-weekday" key={`${day}-${index}`}>{day}</span>
              ))}
              {calendarDays.map((day, index) => {
                if (!day) return <span className="calendar-empty" key={`empty-${index}`} />;
                const [year, month] = calendarMonth.split('-').map(Number);
                const date = toDateKey(new Date(year, month - 1, day));
                const dayTotals = totalsByDate[date] || EMPTY_TOTALS;
                return (
                  <button
                    type="button"
                    className={`calendar-day ${date === selectedDate ? 'is-selected' : ''} ${date === today ? 'is-today' : ''}`}
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }}
                    aria-label={parseDateKey(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    aria-pressed={date === selectedDate}
                  >
                    <span className="calendar-day-number">{day}</span>
                    <MacroRings className="calendar-day-rings" totals={dayTotals} goals={goals} />
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function MonthlyStat({ label, value }) {
  return (
    <div className="monthly-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default Dashboard;
