import React, { useState, useMemo } from 'react';
import '../styles/Alimentos.css';

function Alimentos({ foods, setFoods }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [newFood, setNewFood] = useState({
    name: '',
    kcal: '',
    protein: '',
    fats: '',
    carbs: '',
    fiber: ''
  });

  const filteredFoods = useMemo(() => {
    return foods.filter(food =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [foods, searchTerm]);

  const handleAddFood = () => {
    if (!newFood.name || !newFood.kcal || !newFood.protein || !newFood.fats || !newFood.carbs) {
      showAlert('Por favor completa todos los campos', 'error');
      return;
    }

    const foodToAdd = {
      name: newFood.name,
      kcal: parseFloat(newFood.kcal),
      protein: parseFloat(newFood.protein),
      fats: parseFloat(newFood.fats),
      carbs: parseFloat(newFood.carbs),
      fiber: parseFloat(newFood.fiber) || 0
    };

    setFoods([...foods, foodToAdd]);
    setNewFood({
      name: '',
      kcal: '',
      protein: '',
      fats: '',
      carbs: '',
      fiber: ''
    });
    setShowModal(false);
    showAlert('✅ Alimento agregado correctamente', 'success');
  };

  const handleDeleteFood = (index) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este alimento?')) {
      setFoods(foods.filter((_, i) => i !== index));
      showAlert('✅ Alimento eliminado', 'success');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <div className="alimentos">
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <h2>🍎 Base de Datos de Alimentos ({foods.length} alimentos)</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Buscar alimento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Agregar Alimento
        </button>

        <div className="table-container">
          <table className="foods-table">
            <thead>
              <tr>
                <th>Alimento</th>
                <th>Kcal/100g</th>
                <th>Proteína</th>
                <th>Grasas</th>
                <th>Hidratos</th>
                <th>Fibra</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredFoods.map((food, idx) => (
                <tr key={idx}>
                  <td>{food.name}</td>
                  <td>{food.kcal}</td>
                  <td>{food.protein}g</td>
                  <td>{food.fats}g</td>
                  <td>{food.carbs}g</td>
                  <td>{food.fiber}g</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteFood(foods.indexOf(food))}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredFoods.length === 0 && (
          <p className="empty-message">No se encontraron alimentos</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Agregar Alimento</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label>Nombre del Alimento</label>
              <input
                type="text"
                placeholder="ej: Pechuga de pollo"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Kcal por 100g</label>
                <input
                  type="number"
                  step="0.1"
                  value={newFood.kcal}
                  onChange={(e) => setNewFood({ ...newFood, kcal: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Proteína (g/100g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newFood.protein}
                  onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Grasas (g/100g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newFood.fats}
                  onChange={(e) => setNewFood({ ...newFood, fats: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Hidratos (g/100g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newFood.carbs}
                  onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Fibra (g/100g)</label>
              <input
                type="number"
                step="0.1"
                value={newFood.fiber}
                onChange={(e) => setNewFood({ ...newFood, fiber: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleAddFood}>
                Guardar
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alimentos;
