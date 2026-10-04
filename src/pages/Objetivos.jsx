import React, { useState } from 'react';
import '../styles/Objetivos.css';

const MACRO_GOALS = [
  { key: 'protein', label: 'Proteína', color: '#ff375f' },
  { key: 'fats', label: 'Grasas', color: '#ffd60a' },
  { key: 'carbs', label: 'Hidratos', color: '#64d2ff' },
  { key: 'fiber', label: 'Fibra', color: '#30d158' }
];

function Objetivos({ goals, setGoals }) {
  const [formGoals, setFormGoals] = useState(goals);
  const [alert, setAlert] = useState(null);

  const handleSave = () => {
    setGoals(formGoals);
    showAlert('Objetivos guardados correctamente', 'success');
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="objetivos">
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <section className="goals-editor">
        <header className="goals-heading">
          <p className="goals-eyebrow">OBJETIVOS DIARIOS</p>
          <h2>Mis objetivos</h2>
        </header>

        <label className="goal-tile calorie-goal-tile" htmlFor="goal-calories">
          <span className="goal-label">Calorías</span>
          <span className="goal-input-row">
            <input
              id="goal-calories"
              type="number"
              min="0"
              step="1"
              value={formGoals.calories}
              onChange={(e) => setFormGoals({ ...formGoals, calories: parseInt(e.target.value) })}
            />
            <span className="goal-unit">Kcal/día</span>
          </span>
        </label>

        <div className="goals-grid">
          {MACRO_GOALS.map(({ key, label, color }) => (
            <label
              className="goal-tile macro-goal-tile"
              key={key}
              style={{ '--goal-color': color }}
              htmlFor={`goal-${key}`}
            >
              <span className="goal-label">{label}</span>
              <span className="goal-input-row">
                <input
                  id={`goal-${key}`}
                  type="number"
                  min="0"
                  step="1"
                  value={formGoals[key] ?? (key === 'fiber' ? 30 : '')}
                  onChange={(e) => setFormGoals({ ...formGoals, [key]: parseInt(e.target.value) })}
                />
                <span className="goal-unit">g/día</span>
              </span>
            </label>
          ))}
        </div>

        <button className="btn btn-primary goals-save-button" onClick={handleSave}>
          Guardar objetivos
        </button>
      </section>

      <section className="goal-guidance">
        <details className="goal-guidance-panel">
          <summary>Cálculo orientativo de objetivos</summary>
          <div className="goal-guidance-content">
            <p className="guidance-intro">Fórmulas recomendadas según actividad:</p>
            <div className="formula-list">
              <div className="formula-row">
                <h4>Sedentario (poco ejercicio)</h4>
                <p>Calorías: Peso (kg) × 25-28</p>
                <p>Proteína: Peso (kg) × 1.2-1.6 g</p>
                <p>Grasas: 20-30% de calorías totales</p>
                <p>Hidratos: el resto</p>
              </div>
              <div className="formula-row">
                <h4>Moderadamente activo (3-4 días/semana)</h4>
                <p>Calorías: Peso (kg) × 30-35</p>
                <p>Proteína: Peso (kg) × 1.6-2.2 g</p>
                <p>Grasas: 25-35% de calorías totales</p>
                <p>Hidratos: el resto</p>
              </div>
              <div className="formula-row">
                <h4>Muy activo (5-6 días/semana)</h4>
                <p>Calorías: Peso (kg) × 35-40</p>
                <p>Proteína: Peso (kg) × 2.2-2.6 g</p>
                <p>Grasas: 25-30% de calorías totales</p>
                <p>Hidratos: el resto</p>
              </div>
            </div>
            <p className="guidance-disclaimer">
              Estos son valores de referencia generales. Para un plan personalizado, consulta con un nutricionista o dietista profesional.
            </p>
          </div>
        </details>

        <details className="goal-guidance-panel">
          <summary>Consejos para establecer objetivos</summary>
          <ul className="tips-list">
            <li>Sé realista con tus metas iniciales</li>
            <li>Ajusta según cómo te sientas después de 2 semanas</li>
            <li>La proteína es lo más importante (1.6-2.2 g/kg)</li>
            <li>No reduzcas grasas por debajo del 20% de calorías</li>
            <li>Los hidratos son flexibles según tu energía</li>
            <li>Revisa tus objetivos cada mes</li>
          </ul>
        </details>
      </section>
    </div>
  );
}

export default Objetivos;
