import React, { useState, useMemo } from 'react';
import '../styles/Alimentos.css';

const sortLabels = {
  name: 'Alimento',
  kcal: 'Kcal/100g',
  protein: 'Proteína',
  fats: 'Grasas',
  carbs: 'Hidratos',
  fiber: 'Fibra'
};

function Alimentos({ foods, setFoods }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [macroFilters, setMacroFilters] = useState({
    kcal: '',
    protein: '',
    fats: '',
    carbs: '',
    fiber: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [editingFoodIndex, setEditingFoodIndex] = useState(null);
  const [alert, setAlert] = useState(null);
  const [newFood, setNewFood] = useState({
    name: '',
    kcal: '',
    protein: '',
    fats: '',
    carbs: '',
    fiber: ''
  });

  const emptyFoodForm = () => ({
    name: '',
    kcal: '',
    protein: '',
    fats: '',
    carbs: '',
    fiber: ''
  });

  const filteredFoods = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const result = foods.filter(food => {
      const matchesSearch =
        normalizedSearch === '' || food.name.toLowerCase().includes(normalizedSearch);

      const matchesKcal = !macroFilters.kcal || Number(food.kcal) <= Number(macroFilters.kcal);
      const matchesProtein = !macroFilters.protein || Number(food.protein) >= Number(macroFilters.protein);
      const matchesFats = !macroFilters.fats || Number(food.fats) <= Number(macroFilters.fats);
      const matchesCarbs = !macroFilters.carbs || Number(food.carbs) >= Number(macroFilters.carbs);
      const matchesFiber = !macroFilters.fiber || Number(food.fiber) >= Number(macroFilters.fiber);

      return matchesSearch && matchesKcal && matchesProtein && matchesFats && matchesCarbs && matchesFiber;
    });

    const sortable = [...result];
    sortable.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortConfig.direction === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      const numericA = Number(valueA) || 0;
      const numericB = Number(valueB) || 0;

      return sortConfig.direction === 'asc' ? numericA - numericB : numericB - numericA;
    });

    return sortable;
  }, [foods, searchTerm, sortConfig, macroFilters]);

  const resetFoodForm = () => {
    setNewFood(emptyFoodForm());
    setEditingFoodIndex(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetFoodForm();
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSaveFood = () => {
    if (!newFood.name || !newFood.kcal || !newFood.protein || !newFood.fats || !newFood.carbs) {
      showAlert('Por favor completa todos los campos', 'error');
      return;
    }

    const normalizedName = newFood.name.trim();
    const foodToSave = {
      name: normalizedName,
      kcal: parseFloat(newFood.kcal),
      protein: parseFloat(newFood.protein),
      fats: parseFloat(newFood.fats),
      carbs: parseFloat(newFood.carbs),
      fiber: parseFloat(newFood.fiber) || 0
    };

    if (Number.isNaN(foodToSave.kcal) || Number.isNaN(foodToSave.protein) || Number.isNaN(foodToSave.fats) || Number.isNaN(foodToSave.carbs)) {
      showAlert('Los valores nutricionales deben ser números válidos', 'error');
      return;
    }

    const isDuplicate = foods.some((food, index) => {
      const sameName = food.name.toLowerCase() === normalizedName.toLowerCase();
      return sameName && index !== editingFoodIndex;
    });

    if (isDuplicate) {
      showAlert('Ya existe un alimento con ese nombre', 'error');
      return;
    }

    if (editingFoodIndex !== null) {
      setFoods(prevFoods => prevFoods.map((food, index) => index === editingFoodIndex ? foodToSave : food));
      showAlert('✅ Alimento actualizado correctamente', 'success');
    } else {
      setFoods(prevFoods => [...prevFoods, foodToSave]);
      showAlert('✅ Alimento agregado correctamente', 'success');
    }

    closeModal();
  };

  const confirmDeleteFood = (index) => {
    const food = foods[index];
    setFoodToDelete({ index, name: food.name });
    setShowDeleteConfirm(true);
  };

  const handleDeleteFood = () => {
    if (foodToDelete) {
      setFoods(prevFoods => prevFoods.filter((_, i) => i !== foodToDelete.index));
      setShowDeleteConfirm(false);
      setFoodToDelete(null);
      showAlert('✅ Alimento eliminado', 'success');
    }
  };

  const openAddModal = () => {
    resetFoodForm();
    setShowModal(true);
  };

  const openEditModal = (index) => {
    const foodToEdit = foods[index];
    setEditingFoodIndex(index);
    setNewFood({
      name: foodToEdit.name,
      kcal: String(foodToEdit.kcal),
      protein: String(foodToEdit.protein),
      fats: String(foodToEdit.fats),
      carbs: String(foodToEdit.carbs),
      fiber: String(foodToEdit.fiber ?? 0)
    });
    setShowModal(true);
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleMacroFilterChange = (field, value) => {
    setMacroFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMacroFilters({ kcal: '', protein: '', fats: '', carbs: '', fiber: '' });
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

        <div className="filters-grid">
          <div className="filter-field">
            <label>Kcal ≤</label>
            <input type="number" value={macroFilters.kcal} onChange={(e) => handleMacroFilterChange('kcal', e.target.value)} placeholder="Ej: 250" />
          </div>
          <div className="filter-field">
            <label>Proteína ≥</label>
            <input type="number" value={macroFilters.protein} onChange={(e) => handleMacroFilterChange('protein', e.target.value)} placeholder="Ej: 15" />
          </div>
          <div className="filter-field">
            <label>Grasas ≤</label>
            <input type="number" value={macroFilters.fats} onChange={(e) => handleMacroFilterChange('fats', e.target.value)} placeholder="Ej: 10" />
          </div>
          <div className="filter-field">
            <label>Hidratos ≥</label>
            <input type="number" value={macroFilters.carbs} onChange={(e) => handleMacroFilterChange('carbs', e.target.value)} placeholder="Ej: 5" />
          </div>
          <div className="filter-field">
            <label>Fibra ≥</label>
            <input type="number" value={macroFilters.fiber} onChange={(e) => handleMacroFilterChange('fiber', e.target.value)} placeholder="Ej: 2" />
          </div>
          <button className="btn btn-secondary reset-filters" onClick={resetFilters}>
            Limpiar filtros
          </button>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          ➕ Agregar Alimento
        </button>

        <div className="table-container">
          <table className="foods-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')} className="sortable-header">
                  Alimento {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('kcal')} className="sortable-header">
                  Kcal/100g {sortConfig.key === 'kcal' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('protein')} className="sortable-header">
                  Proteína {sortConfig.key === 'protein' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('fats')} className="sortable-header">
                  Grasas {sortConfig.key === 'fats' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('carbs')} className="sortable-header">
                  Hidratos {sortConfig.key === 'carbs' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th onClick={() => handleSort('fiber')} className="sortable-header">
                  Fibra {sortConfig.key === 'fiber' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredFoods.map((food) => {
                const originalIndex = foods.findIndex(item => item === food);

                return (
                  <tr key={`${food.name}-${originalIndex}`}>
                    <td>{food.name}</td>
                    <td>{food.kcal}</td>
                    <td>{food.protein}g</td>
                    <td>{food.fats}g</td>
                    <td>{food.carbs}g</td>
                    <td>{food.fiber}g</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => openEditModal(originalIndex)}
                          title="Editar alimento"
                        >
                          ✎
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => confirmDeleteFood(originalIndex)}
                          title="Eliminar alimento"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredFoods.length === 0 && (
          <p className="empty-message">No se encontraron alimentos con ese filtro o búsqueda</p>
        )}
      </div>

      {showDeleteConfirm && foodToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>¿Eliminar alimento?</h3>
            <p>Se eliminará <strong>{foodToDelete.name}</strong> de la base de datos.</p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleDeleteFood}>Confirmar</button>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingFoodIndex !== null ? 'Editar Alimento' : 'Agregar Alimento'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
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
              <button className="btn btn-primary" onClick={handleSaveFood}>
                {editingFoodIndex !== null ? 'Guardar cambios' : 'Guardar'}
              </button>
              <button className="btn btn-secondary" onClick={closeModal}>
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
