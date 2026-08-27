import React, { useState } from 'react'
import Select from 'react-select'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getDefaultFoods } from '../App'
import '../styles/Registro.css'

export default function Registro() {
  const [foods] = useLocalStorage('foods', getDefaultFoods())
  const [consumptions, setConsumptions] = useLocalStorage('consumptions', [])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedMeal, setSelectedMeal] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [grams, setGrams] = useState('')
  const [message, setMessage] = useState('')

  const mealTypes = ['Desayuno', 'Media mañana', 'Comida', 'Merienda', 'Cena', 'Snack']

  // Convertir alimentos a formato react-select
  const foodOptions = foods.map(food => ({
    value: food.name,
    label: `${food.name} (${food.kcal} kcal/100g)`,
    food: food
  }))

  const handleRegister = () => {
    if (!selectedFood || !grams || grams <= 0) {
      setMessage('Por favor selecciona alimento y cantidad')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const food = selectedFood.food
    const consumedGrams = parseFloat(grams)
    const multiplier = consumedGrams / 100

    const newConsumption = {
      id: Date.now(),
      date: selectedDate,
      meal: selectedMeal,
      foodName: food.name,
      grams: consumedGrams,
      kcal: Math.round(food.kcal * multiplier),
      protein: Math.round(food.protein * multiplier * 10) / 10,
      fats: Math.round(food.fats * multiplier * 10) / 10,
      carbs: Math.round(food.carbs * multiplier * 10) / 10,
      fiber: Math.round(food.fiber * multiplier * 10) / 10
    }

    setConsumptions([...consumptions, newConsumption])
    setMessage('✅ Registrado correctamente')
    setSelectedFood(null)
    setGrams('')
    setTimeout(() => setMessage(''), 3000)
  }

  const todayConsumptions = consumptions.filter(c => c.date === selectedDate)
  const selectedFoodData = selectedFood?.food

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: '#e2e8f0',
      borderWidth: '2px',
      borderRadius: '8px',
      padding: '4px',
      fontSize: '1rem',
      '&:hover': {
        borderColor: '#667eea'
      }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f0f4ff' : 'white',
      color: state.isSelected ? 'white' : '#2d3748',
      cursor: 'pointer',
      padding: '12px'
    })
  }

  return (
    <div className="registro">
      <h2>📝 Registrar Consumo</h2>

      <div className="form-group">
        <label>Fecha</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Tipo de Comida</label>
        <select value={selectedMeal} onChange={(e) => setSelectedMeal(e.target.value)}>
          <option value="">-- Selecciona comida --</option>
          {mealTypes.map(meal => (
            <option key={meal} value={meal}>{meal}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>🔍 Buscar Alimento</label>
        <Select
          options={foodOptions}
          value={selectedFood}
          onChange={setSelectedFood}
          placeholder="Escribe para buscar alimento..."
          isClearable
          isSearchable
          styles={customStyles}
          noOptionsMessage={() => 'Alimento no encontrado'}
        />
      </div>

      <div className="form-group">
        <label>Cantidad (gramos)</label>
        <input
          type="number"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          placeholder="Ej: 150"
          min="1"
          step="0.1"
        />
      </div>

      {selectedFoodData && grams && (
        <div className="nutrient-info">
          <p>📊 Macros para {grams}g de {selectedFood.value}:</p>
          <div className="nutrient-grid">
            <div>
              <strong>{Math.round(selectedFoodData.kcal * (grams / 100))}</strong> kcal
            </div>
            <div>
              <strong>{Math.round(selectedFoodData.protein * (grams / 100) * 10) / 10}</strong> g proteína
            </div>
            <div>
              <strong>{Math.round(selectedFoodData.fats * (grams / 100) * 10) / 10}</strong> g grasas
            </div>
            <div>
              <strong>{Math.round(selectedFoodData.carbs * (grams / 100) * 10) / 10}</strong> g carbs
            </div>
          </div>
        </div>
      )}

      <button onClick={handleRegister} className="btn-primary">
        Registrar Consumo
      </button>

      {message && (
        <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
          {message}
        </div>
      )}

      {todayConsumptions.length > 0 && (
        <>
          <h3>📋 Registros de hoy</h3>
          <div className="table-container">
            <table className="consumptions-table">
              <thead>
                <tr>
                  <th>Comida</th>
                  <th>Alimento</th>
                  <th>Cantidad</th>
                  <th>Kcal</th>
                  <th>P</th>
                  <th>G</th>
                  <th>C</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {todayConsumptions.map(consumption => (
                  <tr key={consumption.id}>
                    <td>{consumption.meal}</td>
                    <td>{consumption.foodName}</td>
                    <td>{consumption.grams}g</td>
                    <td>{consumption.kcal}</td>
                    <td>{consumption.protein}g</td>
                    <td>{consumption.fats}g</td>
                    <td>{consumption.carbs}g</td>
                    <td>
                      <button
                        onClick={() => setConsumptions(consumptions.filter(c => c.id !== consumption.id))}
                        className="btn-delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {todayConsumptions.length === 0 && (
        <div className="empty-message">
          No hay registros para hoy. ¡Comienza a registrar! 🍎
        </div>
      )}
    </div>
  )
}