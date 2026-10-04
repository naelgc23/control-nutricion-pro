import React, { useState } from 'react'
import Select from 'react-select'
import { Trash2 } from 'lucide-react'
import '../styles/Registro.css'

export default function Registro({ foods, consumptions, setConsumptions }) {
  const currentDate = new Date()
  const selectedDate = [
    currentDate.getFullYear(),
    String(currentDate.getMonth() + 1).padStart(2, '0'),
    String(currentDate.getDate()).padStart(2, '0')
  ].join('-')
  const displayDate = currentDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const [selectedMeal, setSelectedMeal] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [grams, setGrams] = useState('')
  const [customMealName, setCustomMealName] = useState('')
  const [customMacros, setCustomMacros] = useState({
    kcal: '',
    protein: '',
    fats: '',
    carbs: '',
    fiber: ''
  })
  const [message, setMessage] = useState('')
  const [validationErrors, setValidationErrors] = useState([])

  const mealTypes = ['Desayuno', 'Media mañana', 'Comida', 'Merienda', 'Cena', 'Snack', 'Plato libre']
  const isCustomMeal = selectedMeal === 'Plato libre'
  const customMacroFields = [
    { key: 'kcal', label: 'Kcal', step: '1' },
    { key: 'protein', label: 'Proteína (g)', step: '0.1' },
    { key: 'fats', label: 'Grasas (g)', step: '0.1' },
    { key: 'carbs', label: 'Hidratos (g)', step: '0.1' },
    { key: 'fiber', label: 'Fibra (g)', step: '0.1' }
  ]

  // Convertir alimentos a formato react-select
  const foodOptions = foods.map(food => ({
    value: food.name,
    label: `${food.name}`,
    food: food
  }))

  const handleRegister = () => {
    const errors = []

    // Validar tipo de comida
    if (!selectedMeal || selectedMeal.trim() === '') {
      errors.push('tipo de comida')
    }

    if (isCustomMeal) {
      if (!customMealName.trim()) {
        errors.push('nombre del plato')
      }

      customMacroFields.forEach(({ key, label }) => {
        const value = customMacros[key]
        if (value === '' || !Number.isFinite(Number(value)) || Number(value) < 0) {
          errors.push(label)
        }
      })
    } else {
      // Validar alimento y cantidad
      if (!selectedFood || !selectedFood.value) {
        errors.push('alimento')
      }

      const gramsValue = Number(grams)
      if (!grams || Number.isNaN(gramsValue) || gramsValue <= 0) {
        errors.push('cantidad en gramos')
      }
    }

    // Si hay errores, mostrar mensaje
    if (errors.length > 0) {
      setValidationErrors(errors)
      setMessage('Faltan datos: rellena ' + errors.join(', '))
      setTimeout(() => setMessage(''), 4000)
      return
    }

    setValidationErrors([])
    let newConsumption
    if (isCustomMeal) {
      newConsumption = {
        id: Date.now(),
        date: selectedDate,
        meal: selectedMeal,
        foodName: customMealName.trim(),
        grams: null,
        ...Object.fromEntries(customMacroFields.map(({ key }) => [key, Number(customMacros[key])]))
      }
    } else {
      const food = selectedFood.food
      const consumedGrams = parseFloat(grams)
      const multiplier = consumedGrams / 100

      newConsumption = {
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
    }

    setConsumptions(prevConsumptions => [...prevConsumptions, newConsumption])
    setMessage('Registrado correctamente')
    setSelectedFood(null)
    setGrams('')
    setCustomMealName('')
    setCustomMacros({ kcal: '', protein: '', fats: '', carbs: '', fiber: '' })
    // IMPORTANTE: NO resetear selectedMeal para que se mantenga seleccionado
    setTimeout(() => setMessage(''), 3000)
  }

  const clearValidationError = (error) => {
    const remainingErrors = validationErrors.filter(item => item !== error)
    setValidationErrors(remainingErrors)
    setMessage(remainingErrors.length
      ? 'Faltan datos: rellena ' + remainingErrors.join(', ')
      : '')
  }

  const todayConsumptions = consumptions.filter(c => c.date === selectedDate)
  const mealsByType = todayConsumptions.reduce((groups, consumption) => {
    if (!groups[consumption.meal]) {
      groups[consumption.meal] = []
    }
    groups[consumption.meal].push(consumption)
    return groups
  }, {})
  const orderedMealTypes = [
    ...mealTypes,
    ...Object.keys(mealsByType).filter(mealType => !mealTypes.includes(mealType))
  ]
  const selectedFoodData = selectedFood?.food

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderColor: validationErrors.includes('alimento')
        ? '#ff453a'
        : state.isFocused ? '#ff375f' : '#3a3d45',
      borderWidth: '2px',
      borderRadius: '8px',
      padding: '4px',
      backgroundColor: '#101216',
      color: '#f5f5f7',
      fontSize: '1rem',
      boxShadow: validationErrors.includes('alimento')
        ? '0 0 0 3px rgba(255, 69, 58, 0.16)'
        : state.isFocused ? '0 0 0 3px rgba(255, 55, 95, 0.16)' : 'none',
      '&:hover': {
        borderColor: '#ff375f'
      }
    }),
    input: (base) => ({
      ...base,
      color: '#f5f5f7'
    }),
    singleValue: (base) => ({
      ...base,
      color: '#f5f5f7'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#92949b'
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#17191e',
      borderRadius: '8px',
      boxShadow: '0 12px 32px rgba(0,0,0,0.48)'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#ff375f' : state.isFocused ? '#292c33' : '#17191e',
      color: '#f5f5f7',
      cursor: 'pointer',
      padding: '12px'
    })
  }

  return (
    <div className="registro">
      <div className="registro-heading-spacer" aria-hidden="true" />

      <div className="form-group date-form-group">
        <div className="current-date-display" aria-label={`Fecha actual: ${displayDate}`}>
          {displayDate}
        </div>
      </div>

      <div className="form-group">
        <label>Tipo de Comida</label>
        <select
          className={`${selectedMeal ? 'has-value' : 'is-placeholder'} ${validationErrors.includes('tipo de comida') ? 'field-invalid' : ''}`}
          value={selectedMeal}
          aria-invalid={validationErrors.includes('tipo de comida')}
          onChange={(e) => {
            setSelectedMeal(e.target.value)
            if (e.target.value) clearValidationError('tipo de comida')
          }}
        >
          <option value="">Selecciona comida</option>
          {mealTypes.map(meal => (
            <option key={meal} value={meal}>
              {meal === 'Plato libre' ? 'Plato libre' : meal}
            </option>
          ))}
        </select>
      </div>

      {isCustomMeal ? (
        <div className="custom-meal-fields">
          <div className="form-group">
            <label htmlFor="custom-meal-name">Nombre del plato</label>
            <input
              id="custom-meal-name"
              className={validationErrors.includes('nombre del plato') ? 'field-invalid' : ''}
              type="text"
              value={customMealName}
              aria-invalid={validationErrors.includes('nombre del plato')}
              onChange={(e) => {
                setCustomMealName(e.target.value)
                if (e.target.value.trim()) clearValidationError('nombre del plato')
              }}
              placeholder="Ej: Paella casera"
              maxLength="60"
            />
          </div>
          {customMacroFields.map(({ key, label, step }) => (
            <div className="form-group" key={key}>
              <label htmlFor={`custom-${key}`}>{label}</label>
              <input
                id={`custom-${key}`}
                className={validationErrors.includes(label) ? 'field-invalid' : ''}
                type="number"
                value={customMacros[key]}
                aria-invalid={validationErrors.includes(label)}
                onChange={(e) => {
                  setCustomMacros(prev => ({ ...prev, [key]: e.target.value }))
                  if (e.target.value !== '' && Number.isFinite(Number(e.target.value)) && Number(e.target.value) >= 0) {
                    clearValidationError(label)
                  }
                }}
                min="0"
                step={step}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="form-group">
            <label>Buscar Alimento</label>
            <Select
              options={foodOptions}
              value={selectedFood}
              onChange={(food) => {
                setSelectedFood(food)
                if (food) clearValidationError('alimento')
              }}
              aria-invalid={validationErrors.includes('alimento')}
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
              className={validationErrors.includes('cantidad en gramos') ? 'field-invalid' : ''}
              value={grams}
              aria-invalid={validationErrors.includes('cantidad en gramos')}
              onChange={(e) => {
                setGrams(e.target.value)
                if (Number(e.target.value) > 0) clearValidationError('cantidad en gramos')
              }}
              placeholder="Ej: 150"
              min="1"
              step="0.1"
              onWheel={(e) => e.currentTarget.blur()}
            />
          </div>
        </>
      )}

      {selectedFoodData && grams && (
        <div className="nutrient-info">
          <p>Macros para {grams}g de {selectedFood.value}:</p>
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
            <div>
              <strong>{Math.round((selectedFoodData.fiber || 0) * (grams / 100) * 10) / 10}</strong> g fibra
            </div>
          </div>
        </div>
      )}

      <button onClick={handleRegister} className="btn-primary">
        Registrar Consumo
      </button>

      {message && (
        <div
          className={`alert show ${message.startsWith('Registrado') ? 'alert-success' : 'alert-error'}`}
          role="alert"
          aria-live="assertive"
        >
          {message}
        </div>
      )}

      {todayConsumptions.length > 0 && (
        <>
          <h3>Registros de hoy</h3>
          <div className="today-meals-list">
            {orderedMealTypes.filter(mealType => mealsByType[mealType]).map(mealType => (
              <section className="meal-record-card" key={mealType}>
                <h4 className="meal-record-title">{mealType}</h4>
                <div className="table-container meal-table-container">
                  <table className="consumptions-table">
                    <thead>
                      <tr>
                        <th>Alimento</th>
                        <th>Grs</th>
                        <th>Kcal</th>
                        <th>Pro</th>
                        <th>Gra</th>
                        <th>Hid</th>
                        <th>Fib</th>
                        <th aria-label="Acciones" />
                      </tr>
                    </thead>
                    <tbody>
                      {mealsByType[mealType].map(consumption => (
                        <tr key={consumption.id}>
                          <td className="food-name-cell">{consumption.foodName}</td>
                          <td>{consumption.grams == null ? '—' : `${consumption.grams}g`}</td>
                          <td>{consumption.kcal}</td>
                          <td>{consumption.protein}g</td>
                          <td>{consumption.fats}g</td>
                          <td>{consumption.carbs}g</td>
                          <td>{(consumption.fiber || 0).toFixed(1)}g</td>
                          <td>
                            <button
                              onClick={() => setConsumptions(prevConsumptions => prevConsumptions.filter(c => c.id !== consumption.id))}
                              className="delete-extra-button"
                              aria-label={`Eliminar ${consumption.foodName}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {todayConsumptions.length === 0 && (
        <div className="empty-message">
          No hay registros para hoy. Comienza a registrar.
        </div>
      )}
    </div>
  )
}