import React, { useState } from 'react';
import '../styles/Objetivos.css';

function Objetivos({ goals, setGoals }) {
  const [formGoals, setFormGoals] = useState(goals);
  const [alert, setAlert] = useState(null);

  const handleSave = () => {
    setGoals(formGoals);
    showAlert('✅ Objetivos guardados correctamente', 'success');
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

      <div className="card">
        <h2>🎯 Mis Objetivos Nutricionales</h2>

        <div className="goals-grid">
          <div className="form-group">
            <label>🔥 Calorías Diarias</label>
            <input
              type="number"
              value={formGoals.calories}
              onChange={(e) => setFormGoals({ ...formGoals, calories: parseInt(e.target.value) })}
            />
            <small>Kcal/día</small>
          </div>

          <div className="form-group">
            <label>💪 Proteína</label>
            <input
              type="number"
              value={formGoals.protein}
              onChange={(e) => setFormGoals({ ...formGoals, protein: parseInt(e.target.value) })}
            />
            <small>gramos/día</small>
          </div>

          <div className="form-group">
            <label>🧈 Grasas</label>
            <input
              type="number"
              value={formGoals.fats}
              onChange={(e) => setFormGoals({ ...formGoals, fats: parseInt(e.target.value) })}
            />
            <small>gramos/día</small>
          </div>

          <div className="form-group">
            <label>🌾 Hidratos</label>
            <input
              type="number"
              value={formGoals.carbs}
              onChange={(e) => setFormGoals({ ...formGoals, carbs: parseInt(e.target.value) })}
            />
            <small>gramos/día</small>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          💾 Guardar Objetivos
        </button>
      </div>

      <div className="card">
        <h2>📋 Cálculo rápido de objetivos</h2>
        
        <div className="info-section">
          <h3>Fórmulas recomendadas según actividad:</h3>
          
          <div className="formula-card">
            <h4>Sedentario (poco ejercicio)</h4>
            <ul>
              <li>Calorías: Peso (kg) × 25-28</li>
              <li>Proteína: Peso (kg) × 1.2-1.6g</li>
              <li>Grasas: 20-30% de calorías totales</li>
              <li>Hidratos: El resto</li>
            </ul>
          </div>

          <div className="formula-card">
            <h4>Moderadamente activo (3-4 días/semana)</h4>
            <ul>
              <li>Calorías: Peso (kg) × 30-35</li>
              <li>Proteína: Peso (kg) × 1.6-2.2g</li>
              <li>Grasas: 25-35% de calorías totales</li>
              <li>Hidratos: El resto</li>
            </ul>
          </div>

          <div className="formula-card">
            <h4>Muy activo (5-6 días/semana)</h4>
            <ul>
              <li>Calorías: Peso (kg) × 35-40</li>
              <li>Proteína: Peso (kg) × 2.2-2.6g</li>
              <li>Grasas: 25-30% de calorías totales</li>
              <li>Hidratos: El resto</li>
            </ul>
          </div>
        </div>

        <div className="disclaimer">
          <p><strong>⚠️ IMPORTANTE:</strong> Estos son valores de referencia generales. Para un plan personalizado, consulta con un nutricionista o dietista profesional.</p>
        </div>
      </div>

      <div className="card">
        <h2>💡 Tips para establecer objetivos</h2>
        <ul className="tips-list">
          <li>✓ Sé realista con tus metas iniciales</li>
          <li>✓ Ajusta según cómo te sientas después de 2 semanas</li>
          <li>✓ La proteína es lo más importante (1.6-2.2g/kg)</li>
          <li>✓ No reduzcas grasas por debajo del 20% de calorías</li>
          <li>✓ Los hidratos son flexibles según tu energía</li>
          <li>✓ Revisa tus objetivos cada mes</li>
        </ul>
      </div>
    </div>
  );
}

export default Objetivos;
