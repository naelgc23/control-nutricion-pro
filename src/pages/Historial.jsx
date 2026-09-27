import React, { useState, useMemo } from 'react';
import '../styles/Historial.css';

function Historial({ consumptions }) {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().split('T')[0].slice(0, 7)
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
      avgFiber: (totals.fiber / totals.days).toFixed(1)
    };
  }, [groupedByDate]);

  const sortedDates = Object.keys(groupedByDate).sort().reverse();

  return (
    <div className="historial">
      <div className="card">
        <h2>📅 Historial de Registro</h2>

        <div className="filter-container">
          <label>Filtrar por mes:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-input"
          />
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
        </div>
      )}

      <div className="card">
        <h2>Registros del mes</h2>

        {sortedDates.length > 0 ? (
          <div className="history-list">
            {sortedDates.map(date => {
              const data = groupedByDate[date];
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
                    <span className="meals-count">{data.meals.length} consumos</span>
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
                        {Object.entries(
                          data.meals.reduce((acc, meal) => {
                            if (!acc[meal.meal]) {
                              acc[meal.meal] = {
                                kcal: 0,
                                protein: 0,
                                fats: 0,
                                carbs: 0,
                                fiber: 0,
                                count: 0
                              };
                            }

                            acc[meal.meal].kcal += meal.kcal;
                            acc[meal.meal].protein += meal.protein;
                            acc[meal.meal].fats += meal.fats;
                            acc[meal.meal].carbs += meal.carbs;
                            acc[meal.meal].fiber += meal.fiber || 0;
                            acc[meal.meal].count += 1;

                            return acc;
                          }, {})
                        ).map(([mealName, totals]) => (
                          <tr key={mealName}>
                            <td>{mealName}</td>
                            <td>{totals.kcal}</td>
                            <td>{totals.protein.toFixed(1)}g</td>
                            <td>{totals.fats.toFixed(1)}g</td>
                            <td>{totals.carbs.toFixed(1)}g</td>
                            <td>{(totals.fiber || 0).toFixed(1)}g</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
