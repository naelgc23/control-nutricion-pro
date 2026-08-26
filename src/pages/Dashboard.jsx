import React, { useMemo } from 'react';
import '../styles/Dashboard.css';

function Dashboard({ consumptions, goals }) {
  const today = new Date().toISOString().split('T')[0];
  
  const todayConsumptions = useMemo(() => {
    return consumptions.filter(c => c.date === today);
  }, [consumptions, today]);

  const totals = useMemo(() => {
    return {
      kcal: todayConsumptions.reduce((sum, c) => sum + c.kcal, 0),
      protein: todayConsumptions.reduce((sum, c) => sum + c.protein, 0),
      fats: todayConsumptions.reduce((sum, c) => sum + c.fats, 0),
      carbs: todayConsumptions.reduce((sum, c) => sum + c.carbs, 0),
      fiber: todayConsumptions.reduce((sum, c) => sum + c.fiber, 0)
    };
  }, [todayConsumptions]);

  const getMealTotals = () => {
    const meals = {};
    todayConsumptions.forEach(c => {
      if (!meals[c.meal]) {
        meals[c.meal] = { kcal: 0, protein: 0, fats: 0, carbs: 0 };
      }
      meals[c.meal].kcal += c.kcal;
      meals[c.meal].protein += c.protein;
      meals[c.meal].fats += c.fats;
      meals[c.meal].carbs += c.carbs;
    });
    return meals;
  };

  const getProgressPercent = (consumed, goal) => {
    return Math.round((consumed / goal) * 100);
  };

  const getProgressColor = (consumed, goal) => {
    if (consumed > goal) return '#f56565';
    if (consumed >= goal * 0.9) return '#48bb78';
    return '#667eea';
  };

  const meals = getMealTotals();
  const todayDate = new Date(today).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="dashboard">
      <div className="card">
        <h2>Hoy: {todayDate}</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">🔥 Calorías</div>
          <div className="stat-value">{totals.kcal} / {goals.calories}</div>
          <div className="stat-diff">
            {totals.kcal - goals.calories > 0 ? '+' : ''}{totals.kcal - goals.calories} kcal
          </div>
          <ProgressBar value={totals.kcal} goal={goals.calories} />
        </div>

        <div className="stat-card">
          <div className="stat-label">💪 Proteínas</div>
          <div className="stat-value">{totals.protein.toFixed(1)} / {goals.protein}g</div>
          <div className="stat-diff">
            {totals.protein - goals.protein > 0 ? '+' : ''}{(totals.protein - goals.protein).toFixed(1)}g
          </div>
          <ProgressBar value={totals.protein} goal={goals.protein} />
        </div>

        <div className="stat-card">
          <div className="stat-label">🧈 Grasas</div>
          <div className="stat-value">{totals.fats.toFixed(1)} / {goals.fats}g</div>
          <div className="stat-diff">
            {totals.fats - goals.fats > 0 ? '+' : ''}{(totals.fats - goals.fats).toFixed(1)}g
          </div>
          <ProgressBar value={totals.fats} goal={goals.fats} />
        </div>

        <div className="stat-card">
          <div className="stat-label">🌾 Hidratos</div>
          <div className="stat-value">{totals.carbs.toFixed(1)} / {goals.carbs}g</div>
          <div className="stat-diff">
            {totals.carbs - goals.carbs > 0 ? '+' : ''}{(totals.carbs - goals.carbs).toFixed(1)}g
          </div>
          <ProgressBar value={totals.carbs} goal={goals.carbs} />
        </div>
      </div>

      <div className="card">
        <h3>Consumo por Comida</h3>
        {Object.keys(meals).length > 0 ? (
          <table className="meals-table">
            <thead>
              <tr>
                <th>Comida</th>
                <th>Kcal</th>
                <th>Proteína</th>
                <th>Grasas</th>
                <th>Hidratos</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(meals).map(([meal, totals]) => (
                <tr key={meal}>
                  <td><strong>{meal}</strong></td>
                  <td>{totals.kcal}</td>
                  <td>{totals.protein.toFixed(1)}g</td>
                  <td>{totals.fats.toFixed(1)}g</td>
                  <td>{totals.carbs.toFixed(1)}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">No hay consumos registrados hoy</p>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ value, goal }) {
  const percent = Math.min((value / goal) * 100, 100);
  const color = value > goal ? '#f56565' : value >= goal * 0.9 ? '#48bb78' : '#667eea';

  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${percent}%`, backgroundColor: color }}></div>
      <span className="progress-text">{Math.round(percent)}%</span>
    </div>
  );
}

export default Dashboard;
