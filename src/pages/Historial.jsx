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
          meals: []
        };
      }
      grouped[c.date].kcal += c.kcal;
      grouped[c.date].protein += c.protein;
      grouped[c.date].fats += c.fats;
      grouped[c.date].carbs += c.carbs;
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
      days: dates.length
    };

    dates.forEach(date => {
      totals.kcal += groupedByDate[date].kcal;
      totals.protein += groupedByDate[date].protein;
      totals.fats += groupedByDate[date].fats;
      totals.carbs += groupedByDate[date].carbs;
    });

    return {
      ...totals,
      avgKcal: Math.round(totals.kcal / totals.days),
      avgProtein: (totals.protein / totals.days).toFixed(1),
      avgFats: (totals.fats / totals.days).toFixed(1),
      avgCarbs: (totals.carbs / totals.days).toFixed(1)
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
                  </div>

                  <details className="meals-detail">
                    <summary>Ver detalles</summary>
                    <table className="meals-table">
                      <thead>
                        <tr>
                          <th>Comida</th>
                          <th>Alimento</th>
                          <th>Grs</th>
                          <th>Kcal</th>
                          <th>P</th>
                          <th>G</th>
                          <th>HC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.meals.map((meal, idx) => (
                          <tr key={idx}>
                            <td>{meal.meal}</td>
                            <td>{meal.foodName}</td>
                            <td>{meal.grams}</td>
                            <td>{meal.kcal}</td>
                            <td>{meal.protein.toFixed(1)}</td>
                            <td>{meal.fats.toFixed(1)}</td>
                            <td>{meal.carbs.toFixed(1)}</td>
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
