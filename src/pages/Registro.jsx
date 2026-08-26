import React, { useState, useMemo } from 'react';
import '../styles/Registro.css';

function Registro({ foods, consumptions, setConsumptions }) {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [comida, setComida] = useState('');
  const [foodIdx, setFoodIdx] = useState('');
  const [gramos, setGramos] = useState(100);
  const [alert, setAlert] = useState(null);

  const selectedFood = foodIdx !== '' ? foods[foodIdx] : null;

  const nutrientInfo = useMemo(() => {
    if (!selectedFood) return null;
    const mult = gramos / 100;
    return {
      kcal: Math.round(selectedFood.kcal * mult),
      protein: (selectedFood.protein * mult).toFixed(1),
      fats: (selectedFood.fats * mult).toFixed(1),
      carbs: (selectedFood.carbs * mult).toFixed(1),
      fiber: (selectedFood.fiber * mult).toFixed(1)
    };
  }, [selectedFood, gramos]);

  const todayConsumptions = useMemo(() => {
    return consumptions.filter(c => c.date === fecha);
  }, [consumptions, fecha]);

  const handleAddConsumption = () => {
    if (!fecha || !comida || foodIdx === '') {
      showAlert('Por favor completa todos los campos', 'error');
      return;
    }

    const food = foods[foodIdx];
    const mult = gramos / 100;

    const newConsumption = {
      id: Date.now(),
      date: fecha,
      meal: comida,
      foodName: food.name,
      grams: gramos,
      kcal: Math.round(food.kcal * mult),
      protein: parseFloat((food.protein * mult).toFixed(1)),
      fats: parseFloat((food.fats * mult).toFixed(1)),
      carbs: parseFloat((food.carbs * mult).toFixed(1)),
      fiber: parseFloat((food.fiber * mult).toFixed(1))
    };

    setConsumptions([...consumptions, newConsumption]);
    setFoodIdx('');
    setGramos(100);
    setComida('');
    showAlert('✅ Consumo registrado correctamente', 'success');
  };

  const handleDeleteConsumption = (id) => {
    setConsumptions(consumptions.filter(c => c.id !== id));
    showAlert('✅ Registro eliminado', 'success');
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="registro">
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <h2>📝 Registrar Consumo</h2>

        <div className="form-group">
          <label>📅 Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>🍽️ Tipo de Comida</label>
          <select value={comida} onChange={(e) => setComida(e.target.value)}>
            <option value="">Seleccionar...</option>
            <option value="Desayuno">Desayuno</option>
            <option value="Media mañana">Media mañana</option>
            <option value="Comida">Comida</option>
            <option value="Merienda">Merienda</option>
            <option value="Cena">Cena</option>
            <option value="Snack">Snack</option>
          </select>
        </div>

        <div className="form-group">
          <label>🍎 Alimento</label>
          <select value={foodIdx} onChange={(e) => setFoodIdx(e.target.value)}>
            <option value="">Seleccionar...</option>
            {foods.map((food, idx) => (
              <option key={idx} value={idx}>
                {food.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>⚖️ Gramos</label>
          <input
            type="number"
            value={gramos}
            onChange={(e) => setGramos(parseInt(e.target.value) || 100)}
            min="1"
          />
        </div>

        {nutrientInfo && (
          <div className="nutrient-info">
            <p><strong>Macros para esta ración:</strong></p>
            <div className="nutrient-grid">
              <div>🔥 Kcal: <strong>{nutrientInfo.kcal}</strong></div>
              <div>💪 Proteína: <strong>{nutrientInfo.protein}g</strong></div>
              <div>🧈 Grasas: <strong>{nutrientInfo.fats}g</strong></div>
              <div>🌾 Hidratos: <strong>{nutrientInfo.carbs}g</strong></div>
            </div>
          </div>
        )}

        <button className="btn btn-primary" onClick={handleAddConsumption}>
          ➕ Registrar Consumo
        </button>
      </div>

      <div className="card">
        <h2>Registros de {new Date(fecha).toLocaleDateString('es-ES')}</h2>
        {todayConsumptions.length > 0 ? (
          <table className="consumptions-table">
            <thead>
              <tr>
                <th>Comida</th>
                <th>Alimento</th>
                <th>Grs</th>
                <th>Kcal</th>
                <th>Prot</th>
                <th>Grs</th>
                <th>HC</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {todayConsumptions.map((c) => (
                <tr key={c.id}>
                  <td>{c.meal}</td>
                  <td>{c.foodName}</td>
                  <td>{c.grams}</td>
                  <td>{c.kcal}</td>
                  <td>{c.protein.toFixed(1)}</td>
                  <td>{c.fats.toFixed(1)}</td>
                  <td>{c.carbs.toFixed(1)}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteConsumption(c.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-message">No hay registros para esta fecha</p>
        )}
      </div>
    </div>
  );
}

export default Registro;
