import React, { useState, useMemo } from 'react';
import '../styles/Historial.css';

const MANUAL_ENTRY_LABEL = 'Extra';
const MONTH_OPTIONS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function Historial({ consumptions, setConsumptions, dailyRecords, setDailyRecords }) {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().split('T')[0].slice(0, 7)
  );
  const [manualEntryDate, setManualEntryDate] = useState(null);
  const [manualMacros, setManualMacros] = useState({
    kcal: '',
    protein: '',
    fats: '',
    carbs: '',
    fiber: ''
  });
  const manualMacroFields = [
    { key: 'kcal', label: 'Kcal', step: '1' },
    { key: 'protein', label: 'Proteína (g)', step: '0.1' },
    { key: 'fats', label: 'Grasas (g)', step: '0.1' },
    { key: 'carbs', label: 'Hidratos (g)', step: '0.1' },
    { key: 'fiber', label: 'Fibra (g)', step: '0.1' }
  ];
  const isManualConsumption = consumption => (
    consumption.isManual === true ||
    (consumption.meal === 'Añadido manualmente' && consumption.grams == null)
  );

  const groupedByDate = useMemo(() => {
    const filtered = consumptions.filter(c => c.date.startsWith(selectedMonth));
    const grouped = {};

    filtered.forEach(c => {
      if (!grouped[c.date]) {
        grouped[c.date] = {
          kcal: 0,
          protein: 0,
          fats: 0,
          carbs: 0,
          fiber: 0,
          meals: []
        };
      }
      grouped[c.date].kcal += c.kcal;
      grouped[c.date].protein += c.protein;
      grouped[c.date].fats += c.fats;
      grouped[c.date].carbs += c.carbs;
      grouped[c.date].fiber += c.fiber || 0;
      grouped[c.date].meals.push(c);
    });

    return grouped;
  }, [consumptions, selectedMonth]);

  const stats = useMemo(() => {
    const dates = Object.keys(groupedByDate);
    if (dates.length === 0) return null;
    const monthRecords = Object.entries(dailyRecords || {}).filter(([date]) => (
      date.startsWith(selectedMonth)
    ));
    const recordedBurnedCalories = monthRecords
      .map(([, record]) => record?.burnedCalories)
      .filter(value => (
        value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value))
      ))
      .map(Number);

    const totals = {
      kcal: 0,
      protein: 0,
      fats: 0,
      carbs: 0,
      fiber: 0,
      days: dates.length
    };

    dates.forEach(date => {
      totals.kcal += groupedByDate[date].kcal;
      totals.protein += groupedByDate[date].protein;
      totals.fats += groupedByDate[date].fats;
      totals.carbs += groupedByDate[date].carbs;
      totals.fiber += groupedByDate[date].fiber;
    });

    return {
      ...totals,
      avgKcal: Math.round(totals.kcal / totals.days),
      avgProtein: (totals.protein / totals.days).toFixed(1),
      avgFats: (totals.fats / totals.days).toFixed(1),
      avgCarbs: (totals.carbs / totals.days).toFixed(1),
      avgFiber: (totals.fiber / totals.days).toFixed(1),
      creatineDays: monthRecords.filter(([, record]) => record?.creatineTaken).length,
      avgBurnedCalories: recordedBurnedCalories.length
        ? Math.round(recordedBurnedCalories.reduce((sum, value) => sum + value, 0) / recordedBurnedCalories.length)
        : null
    };
  }, [groupedByDate, dailyRecords, selectedMonth]);

  const sortedDates = Object.keys(groupedByDate).sort().reverse();
  const [selectedYear, selectedMonthNumber] = selectedMonth.split('-');
  const availableYears = [...new Set([
    new Date().getFullYear(),
    ...consumptions.map(consumption => Number(consumption.date.slice(0, 4)))
  ])].sort((firstYear, secondYear) => secondYear - firstYear);

  const handleDeleteManualConsumption = (consumptionId) => {
    const target = consumptions.find(consumption => (
      consumption.id === consumptionId && isManualConsumption(consumption)
    ));

    if (!target || !window.confirm('¿Eliminar este extra?')) return;

    setConsumptions(previous => previous.filter(consumption => (
      consumption.id !== consumptionId || !isManualConsumption(consumption)
    )));
  };

  const handleAddManualConsumption = (date) => {
    const hasInvalidValues = manualMacroFields.some(({ key }) => {
      const value = manualMacros[key];
      return value === '' || !Number.isFinite(Number(value)) || Number(value) < 0;
    });

    if (hasInvalidValues) return;

    const newConsumption = {
      id: Date.now(),
      date,
      meal: MANUAL_ENTRY_LABEL,
      foodName: MANUAL_ENTRY_LABEL,
      isManual: true,
      grams: null,
      ...Object.fromEntries(manualMacroFields.map(({ key }) => [key, Number(manualMacros[key])]))
    };

    setConsumptions(previous => [...previous, newConsumption]);
    setManualEntryDate(null);
    setManualMacros({ kcal: '', protein: '', fats: '', carbs: '', fiber: '' });
  };

  const updateDailyRecord = (date, field, value) => {
    setDailyRecords(previous => ({
      ...previous,
      [date]: {
        ...(previous[date] || {}),
        [field]: value
      }
    }));
  };

  return (
    <div className="historial">
      <div className="card history-filter-card">
        <h2>📅 Historial de Registro</h2>

        <div className="filter-container">
          <label htmlFor="history-month-select">Filtrar por mes:</label>
          <div className="month-picker">
            <select
              id="history-month-select"
              value={selectedMonthNumber}
              onChange={(event) => setSelectedMonth(`${selectedYear}-${event.target.value}`)}
            >
              {MONTH_OPTIONS.map((month, index) => (
                <option key={month} value={String(index + 1).padStart(2, '0')}>
                  {month}
                </option>
              ))}
            </select>
            <select
              aria-label="Año"
              value={selectedYear}
              onChange={(event) => setSelectedMonth(`${event.target.value}-${selectedMonthNumber}`)}
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {stats && (
        <div className="stats-container">
          <div className="stat-box">
            <div className="stat-label">📊 Días registrados</div>
            <div className="stat-value">{stats.days}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">🔥 Promedio Kcal</div>
            <div className="stat-value">{stats.avgKcal}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">💪 Promedio Proteína</div>
            <div className="stat-value">{stats.avgProtein}g</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">🧈 Promedio Grasas</div>
            <div className="stat-value">{stats.avgFats}g</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">🌾 Promedio Hidratos</div>
            <div className="stat-value">{stats.avgCarbs}g</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">🌿 Promedio Fibra</div>
            <div className="stat-value">{stats.avgFiber}g</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">💊 Días con creatina</div>
            <div className="stat-value">{stats.creatineDays}</div>
          </div>
          <div className="stat-box">
            <div className="stat-label">🔥 Promedio kcal quemadas</div>
            <div className="stat-value">
              {stats.avgBurnedCalories === null ? '—' : `${stats.avgBurnedCalories} kcal`}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Registros del mes</h2>

        {sortedDates.length > 0 ? (
          <div className="history-list">
            {sortedDates.map(date => {
              const data = groupedByDate[date];
              const groupedMeals = data.meals
                .filter(meal => !isManualConsumption(meal))
                .reduce((acc, meal) => {
                  if (!acc[meal.meal]) {
                    acc[meal.meal] = { kcal: 0, protein: 0, fats: 0, carbs: 0, fiber: 0 };
                  }

                  acc[meal.meal].kcal += meal.kcal;
                  acc[meal.meal].protein += meal.protein;
                  acc[meal.meal].fats += meal.fats;
                  acc[meal.meal].carbs += meal.carbs;
                  acc[meal.meal].fiber += meal.fiber || 0;
                  return acc;
                }, {});
              const detailRows = [
                ...Object.entries(groupedMeals).map(([mealName, totals]) => ({
                  id: `meal-${mealName}`,
                  mealName,
                  totals,
                  isManual: false
                })),
                ...data.meals
                  .filter(isManualConsumption)
                  .map(consumption => ({
                    id: `manual-${consumption.id}`,
                    mealName: MANUAL_ENTRY_LABEL,
                    totals: consumption,
                    consumptionId: consumption.id,
                    isManual: true
                  }))
              ];
              const dateObj = new Date(date);
              const dateStr = dateObj.toLocaleDateString('es-ES', {
                weekday: 'short',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <div key={date} className="day-card">
                  <div className="day-header">
                    <h3>{dateStr}</h3>
                  </div>

                  <div className="day-tracking">
                    <label className="stat tracking-stat">
                      <span className="label">Creatina tomada</span>
                      <input
                        type="checkbox"
                        aria-label="Creatina tomada"
                        checked={dailyRecords[date]?.creatineTaken ?? false}
                        onChange={(event) => updateDailyRecord(date, 'creatineTaken', event.target.checked)}
                      />
                    </label>
                    <label className="stat tracking-stat">
                      <span className="label">Kcal quemadas</span>
                      <input
                        className="value burned-calories-input"
                        type="number"
                        min="0"
                        step="1"
                        value={dailyRecords[date]?.burnedCalories ?? ''}
                        onChange={(event) => updateDailyRecord(
                          date,
                          'burnedCalories',
                          event.target.value === '' ? null : Number(event.target.value)
                        )}
                        placeholder="—"
                        aria-label="Kcal quemadas"
                        onWheel={(event) => event.currentTarget.blur()}
                      />
                    </label>
                  </div>

                  <div className="day-stats">
                    <div className="stat">
                      <span className="label">Kcal</span>
                      <span className="value">{data.kcal}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Proteína</span>
                      <span className="value">{data.protein.toFixed(1)}g</span>
                    </div>
                    <div className="stat">
                      <span className="label">Grasas</span>
                      <span className="value">{data.fats.toFixed(1)}g</span>
                    </div>
                    <div className="stat">
                      <span className="label">Hidratos</span>
                      <span className="value">{data.carbs.toFixed(1)}g</span>
                    </div>
                    <div className="stat">
                      <span className="label">Fibra</span>
                      <span className="value">{(data.fiber || 0).toFixed(1)}g</span>
                    </div>
                  </div>

                  <details className="meals-detail">
                    <summary>Ver detalles</summary>
                    <table className="meals-table compact-table">
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
                        {detailRows.map(({ id, mealName, totals, consumptionId, isManual }) => (
                          <tr key={id}>
                            <td className={isManual ? 'manual-meal-cell' : undefined}>
                              {isManual ? (
                                <div className="manual-entry-row-label">
                                  <span>{mealName}</span>
                                  <button
                                    type="button"
                                    className="manual-entry-delete"
                                    aria-label="Eliminar extra"
                                    title="Eliminar extra"
                                    onClick={() => handleDeleteManualConsumption(consumptionId)}
                                  >
                                    🗑️
                                  </button>
                                </div>
                              ) : mealName}
                            </td>
                            <td>{totals.kcal}</td>
                            <td>{totals.protein.toFixed(1)}g</td>
                            <td>{totals.fats.toFixed(1)}g</td>
                            <td>{totals.carbs.toFixed(1)}g</td>
                            <td>{(totals.fiber || 0).toFixed(1)}g</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      type="button"
                      className="manual-entry-toggle"
                      aria-expanded={manualEntryDate === date}
                      onClick={() => {
                        setManualEntryDate(currentDate => currentDate === date ? null : date);
                        setManualMacros({ kcal: '', protein: '', fats: '', carbs: '', fiber: '' });
                      }}
                    >
                      {manualEntryDate === date ? 'Cancelar' : 'Añadir consumo manual'}
                    </button>
                    {manualEntryDate === date && (
                      <form
                        className="manual-entry-form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleAddManualConsumption(date);
                        }}
                      >
                        <div className="manual-entry-grid">
                          {manualMacroFields.map(({ key, label, step }) => (
                            <label className="manual-entry-field" key={key}>
                              <span>{label}</span>
                              <input
                                type="number"
                                value={manualMacros[key]}
                                onChange={(event) => setManualMacros(previous => ({
                                  ...previous,
                                  [key]: event.target.value
                                }))}
                                min="0"
                                step={step}
                                required
                                onWheel={(event) => event.currentTarget.blur()}
                              />
                            </label>
                          ))}
                        </div>
                        <div className="manual-entry-actions">
                          <button type="submit">Guardar en este día</button>
                        </div>
                      </form>
                    )}
                  </details>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="empty-message">No hay registros para este período</p>
        )}
      </div>

      <div className="card info-card">
        <h2>📈 Análisis</h2>
        <p>Mantén un registro consistente para ver tus progresos a lo largo del tiempo.</p>
        <ul>
          <li>✓ Los primeros 2-3 meses son para ajustar objetivos</li>
          <li>✓ Después puedes empezar a ver cambios reales</li>
          <li>✓ La consistencia es más importante que la perfección</li>
          <li>✓ Revisa tus datos cada mes para optimizar</li>
        </ul>
      </div>
    </div>
  );
}

export default Historial;
