import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Dashboard from './pages/Dashboard';
import Registro from './pages/Registro';
import Alimentos from './pages/Alimentos';
import Objetivos from './pages/Objetivos';
import Historial from './pages/Historial';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [foods, setFoods] = useLocalStorage('foods', getDefaultFoods());
  const [consumptions, setConsumptions] = useLocalStorage('consumptions', []);
  const [goals, setGoals] = useLocalStorage('goals', {
    calories: 2200,
    protein: 220,
    fats: 65,
    carbs: 165
  });

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', component: Dashboard },
    { id: 'registro', label: '📝 Registrar', component: Registro },
    { id: 'alimentos', label: '🍎 Alimentos', component: Alimentos },
    { id: 'objetivos', label: '🎯 Objetivos', component: Objetivos },
    { id: 'historial', label: '📅 Historial', component: Historial }
  ];

  const currentComponent = tabs.find(t => t.id === activeTab)?.component;
  const CurrentComponent = currentComponent;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🥗 Control Nutrición Pro</h1>
        <p>Controla tus macronutrientes de forma fácil</p>
      </header>

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {CurrentComponent && (
          <CurrentComponent
            foods={foods}
            setFoods={setFoods}
            consumptions={consumptions}
            setConsumptions={setConsumptions}
            goals={goals}
            setGoals={setGoals}
          />
        )}
      </div>
    </div>
  );
}

function getDefaultFoods() {
  return [
    { name: 'Pavo extrafino Hacendado', kcal: 89, protein: 19.5, fats: 1.3, carbs: 1.0, fiber: 0.0 },
    { name: 'Pan cereales Hacendado', kcal: 294, protein: 11, fats: 8.0, carbs: 43.0, fiber: 3.6 },
    { name: 'Queso light Hacendado', kcal: 267, protein: 27, fats: 17.0, carbs: 1.6, fiber: 0.0 },
    { name: 'Tomate', kcal: 18, protein: 1, fats: 0.2, carbs: 3.5, fiber: 1.2 },
    { name: 'Lomo barato Hacendado', kcal: 199, protein: 38, fats: 5.0, carbs: 0.5, fiber: 0.0 },
    { name: 'Aceite VE Hacendado', kcal: 819, protein: 0, fats: 91.0, carbs: 0.0, fiber: 0.0 },
    { name: 'MyProtein', kcal: 376, protein: 73, fats: 6.2, carbs: 6.5, fiber: 0.0 },
    { name: 'Bocadillo bacon pollo Keki', kcal: 940, protein: 60, fats: 43.0, carbs: 74.0, fiber: 2.0 },
    { name: 'Pepinillo agridulce hacendado', kcal: 56, protein: 0.9, fats: 0.5, carbs: 11.0, fiber: 1.0 },
    { name: 'Pechuga de pollo', kcal: 110, protein: 23, fats: 1.2, carbs: 0.0, fiber: 0.0 },
    { name: 'Patata cocida', kcal: 87, protein: 2, fats: 0.1, carbs: 21.0, fiber: 1.8 },
    { name: 'Melocoton', kcal: 39, protein: 0.9, fats: 0.3, carbs: 9.5, fiber: 1.2 },
    { name: 'Lonchas pollo Hacendado', kcal: 125, protein: 26.8, fats: 2.0, carbs: 0.5, fiber: 0.0 },
    { name: 'Ciruela roja', kcal: 46, protein: 0.7, fats: 0.3, carbs: 11.4, fiber: 1.4 },
    { name: 'Mousse proteica hacendado', kcal: 74, protein: 10, fats: 1.5, carbs: 4.5, fiber: 1.0 },
    { name: 'Cocktail frutos secos 0% sal', kcal: 629, protein: 22, fats: 53.0, carbs: 12.0, fiber: 8.3 },
    { name: 'Chia', kcal: 464, protein: 22, fats: 34.0, carbs: 2.6, fiber: 30.0 },
    { name: 'Lomo alto ternera angus', kcal: 270, protein: 26, fats: 19.0, carbs: 0.0, fiber: 0.0 },
    { name: 'Menestra hacendado', kcal: 47, protein: 3, fats: 0.3, carbs: 6.3, fiber: 3.5 },
    { name: 'Balconi relleno cacao', kcal: 419, protein: 5.6, fats: 20.0, carbs: 53.0, fiber: 0.0 },
    { name: 'Pizza 4 quesos hacendado', kcal: 267, protein: 14.4, fats: 11.0, carbs: 27.6, fiber: 0.0 },
    { name: 'Atún aceite girasol escurrido hacendado', kcal: 255, protein: 21.6, fats: 18.3, carbs: 0.8, fiber: 0.0 },
    { name: 'Salsa yougurt hacendado', kcal: 257, protein: 0.8, fats: 23.9, carbs: 8.7, fiber: 0.0 },
    { name: 'Ternera magra', kcal: 176, protein: 21, fats: 10.0, carbs: 0.0, fiber: 0.0 },
    { name: 'Pan arabe pita', kcal: 298, protein: 8.2, fats: 1.3, carbs: 62.7, fiber: 2.1 },
    { name: 'Pan rustico baguet', kcal: 236, protein: 2, fats: 8.6, carbs: 45.0, fiber: 2.0 },
    { name: 'Tomate frito hacendado', kcal: 81, protein: 1.4, fats: 3.0, carbs: 11.6, fiber: 0.0 },
    { name: 'Queso cabra', kcal: 330, protein: 21, fats: 27.0, carbs: 2.0, fiber: 0.0 },
    { name: 'Pasta penne rummo', kcal: 356, protein: 14.5, fats: 1.6, carbs: 69.5, fiber: 2.9 },
    { name: 'Mayonesa hacendado', kcal: 599, protein: 0.6, fats: 65.0, carbs: 2.4, fiber: 0.0 },
    { name: 'Queso gouda eliges', kcal: 344, protein: 23, fats: 28.0, carbs: 0.0, fiber: 0.0 },
    { name: 'Pan cristal cereales supeco', kcal: 262, protein: 10, fats: 5.1, carbs: 41.0, fiber: 6.2 },
    { name: 'Azucar', kcal: 400, protein: 0, fats: 0.0, carbs: 100.0, fiber: 0.0 },
    { name: 'Spaguetti hacendado', kcal: 361, protein: 13, fats: 1.5, carbs: 72.0, fiber: 3.5 },
    { name: 'Queso Edam hacendado', kcal: 321, protein: 25.4, fats: 24.0, carbs: 0.0, fiber: 0.0 },
    { name: 'Platano', kcal: 90, protein: 1, fats: 0.3, carbs: 21.0, fiber: 3.0 },
    { name: 'Natillas proteicas hacendado chocolate', kcal: 81, protein: 8.4, fats: 1.1, carbs: 8.7, fiber: 0.7 },
    { name: 'Bebida proteica stracciatella', kcal: 52, protein: 7.3, fats: 0.7, carbs: 4.1, fiber: 0.0 },
    { name: 'Pollo lonchas braseada hacendado', kcal: 89, protein: 18.1, fats: 1.7, carbs: 1.0, fiber: 0.0 },
    { name: 'The rustik bakery pan', kcal: 245, protein: 11, fats: 3.8, carbs: 38.0, fiber: 8.2 },
    { name: 'Nectarina', kcal: 44, protein: 1, fats: 0.3, carbs: 10.5, fiber: 1.7 },
    { name: 'Tiramisu', kcal: 290, protein: 5, fats: 19.0, carbs: 28.0, fiber: 0.0 },
    { name: 'Bebida proteica platano arandanos', kcal: 51, protein: 7.3, fats: 0.4, carbs: 4.2, fiber: 0.0 },
    { name: 'Natillas proteicas hacendado mango', kcal: 56, protein: 8.3, fats: 0.5, carbs: 5.8, fiber: 0.0 },
    { name: 'Higado de pollo', kcal: 119, protein: 17, fats: 5.0, carbs: 1.0, fiber: 0.0 },
    { name: 'Nueces', kcal: 716, protein: 17, fats: 69.6, carbs: 2.2, fiber: 6.2 },
    { name: 'Tortitas trigo eliges', kcal: 316, protein: 8, fats: 7.4, carbs: 53.0, fiber: 2.7 },
    { name: 'Batido 330 chocolate hacendado', kcal: 48, protein: 9.2, fats: 0.3, carbs: 2.2, fiber: 0.0 },
    { name: 'Lomo bellota iberico 50%', kcal: 366, protein: 34, fats: 25.0, carbs: 1.0, fiber: 0.0 },
    { name: 'Melon piel de sapo', kcal: 32, protein: 0.5, fats: 0.2, carbs: 8.0, fiber: 0.8 },
    { name: 'Pera', kcal: 58, protein: 0.4, fats: 0.1, carbs: 12.1, fiber: 3.1 },
    { name: 'Cono vainilla chocolate eliges (ud 76g)', kcal: 298, protein: 3.2, fats: 16.0, carbs: 35.0, fiber: 1.5 },
    { name: 'Batido 330 vainilla hacendado', kcal: 46, protein: 9.1, fats: 0.2, carbs: 2.0, fiber: 0.0 },
    { name: 'Chapata cristal hacendado', kcal: 299, protein: 8.8, fats: 7.0, carbs: 48.0, fiber: 4.4 },
    { name: 'Jamon extrafino hacendado', kcal: 102, protein: 19, fats: 2.5, carbs: 0.9, fiber: 0.0 },
    { name: 'Pizza margarita casera', kcal: 240, protein: 10, fats: 9.0, carbs: 30.0, fiber: 1.5 },
    { name: 'Entercote Hacendado', kcal: 191, protein: 22, fats: 12.0, carbs: 0.5, fiber: 0.0 },
    { name: 'Coliflor, brocoli y zanahoria mercadona', kcal: 32, protein: 2.1, fats: 0.3, carbs: 3.8, fiber: 2.6 },
    { name: 'Cebolla', kcal: 40, protein: 1.2, fats: 0.2, carbs: 7.0, fiber: 1.7 },
    { name: 'Higos negros', kcal: 74, protein: 0.8, fats: 0.3, carbs: 20.0, fiber: 2.5 },
    { name: 'Helado sorbete lima limon hacendado', kcal: 93, protein: 0, fats: 0.0, carbs: 23.0, fiber: 0.0 },
    { name: 'Patatas classicas rubio hacendado', kcal: 558, protein: 6.7, fats: 35.0, carbs: 52.0, fiber: 0.0 },
    { name: 'Yougurt griego hacendado', kcal: 129, protein: 3.9, fats: 10.8, carbs: 3.9, fiber: 0.0 },
    { name: 'Patatas queso cabra hacendado', kcal: 525, protein: 6.1, fats: 33.0, carbs: 49.0, fiber: 3.6 },
    { name: 'Pan bombia 8 cereales integral', kcal: 245, protein: 11, fats: 4.3, carbs: 37.0, fiber: 7.4 },
    { name: 'Hamburguesa vacuno hacendado', kcal: 206, protein: 17, fats: 14.0, carbs: 2.9, fiber: 0.0 },
    { name: 'Guisante hacendado', kcal: 82, protein: 6, fats: 0.4, carbs: 11.0, fiber: 5.0 },
    { name: 'Lonchas lomo 96% hacendado', kcal: 142, protein: 26, fats: 4.1, carbs: 0.5, fiber: 0.0 },
    { name: 'Palmera kiki kinder', kcal: 545, protein: 5.2, fats: 34.5, carbs: 53.0, fiber: 0.0 },
    { name: 'Sandia', kcal: 30, protein: 0.6, fats: 0.2, carbs: 7.6, fiber: 0.4 },
    { name: 'Queso lonchas cremoso hacendado', kcal: 396, protein: 19, fats: 35.0, carbs: 1.3, fiber: 0.0 },
    { name: 'Monchi tarta de la abuela', kcal: 321, protein: 4, fats: 14.6, carbs: 43.0, fiber: 0.9 },
    { name: 'Arroz sos', kcal: 354, protein: 6.5, fats: 0.5, carbs: 79.5, fiber: 2.8 },
    { name: 'Lentejas rojas duru', kcal: 347, protein: 24.6, fats: 2.2, carbs: 52.8, fiber: 8.8 },
    { name: 'Chapata cristal cerveza Carrefour', kcal: 242, protein: 7.2, fats: 2.7, carbs: 46.0, fiber: 2.3 },
    { name: 'Queso parmesano', kcal: 395, protein: 34, fats: 30.0, carbs: 1.0, fiber: 0.0 },
    { name: 'Helado proteico vainilla sal lidl', kcal: 135, protein: 9.8, fats: 2.9, carbs: 18.8, fiber: 4.1 },
    { name: 'Pan 100% integral hacendado', kcal: 223, protein: 9.1, fats: 2.5, carbs: 38.0, fiber: 7.0 },
    { name: 'Pollo relleno 97% pollo carloteña', kcal: 166, protein: 18.5, fats: 9.5, carbs: 1.7, fiber: 0.0 },
    { name: 'Spaguetti n3 rummo', kcal: 356, protein: 14.5, fats: 1.6, carbs: 69.5, fiber: 2.9 },
    { name: 'Mantequila asturiana', kcal: 742, protein: 0.6, fats: 82.0, carbs: 0.4, fiber: 0.0 },
    { name: 'Trigo tierno nomen', kcal: 356, protein: 13.3, fats: 2.1, carbs: 68.0, fiber: 5.8 },
    { name: 'Almendra natural', kcal: 642, protein: 25.2, fats: 54.8, carbs: 5.9, fiber: 12.2 }
  ];
}

export default App;
