import React, { useState } from 'react';
import { db } from '../../firebase/cliente'; // Importa la referencia a la base de datos desde tu archivo cliente.js
import { collection, addDoc } from 'firebase/firestore'; // Importa funciones para trabajar con colecciones desde Firestore
import { Link } from 'react-router-dom';

const MesaAbrir = () => {
  const [numeroMesa, setNumeroMesa] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNumeroMesaChange = (event) => {
    setNumeroMesa(event.target.value);
  };
  const handleVerMesasAbiertasClick = () => {
    setShowMesaList(true); // Cambia esto según tu lógica para mostrar las mesas abiertas
  };

  const handleAbrirMesaClick = async () => {
    if (!numeroMesa) {
      setError('Por favor ingresa un número de mesa.');
      return;
    }

    setLoading(true);

    try {
      const mesaId = `${numeroMesa}-${new Date().getTime()}`; // Genera un ID único basado en el número de mesa y la fecha y hora actual
      const mesaRef = collection(db, 'mesas'); // Referencia a la colección de mesas

      // Crea la mesa en Firestore
      await addDoc(mesaRef, {
        id: mesaId, // Utiliza el ID generado para el documento
        numeroMesa: numeroMesa,
        createdAt: new Date(),
        productos: [] // Inicialmente, la mesa no tiene productos
      });

      // Lógica adicional para redirigir o mostrar un mensaje de éxito
    } catch (error) {
      console.error('Error al abrir la mesa:', error);
      setError('Hubo un error al abrir la mesa. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Abrir Mesa</h1>
      {error && <p>{error}</p>}
      <input
        type="text"
        value={numeroMesa}
        onChange={handleNumeroMesaChange}
        placeholder="Número de Mesa"
      />
      <button onClick={handleAbrirMesaClick} disabled={loading}>Abrir Mesa</button>
      <Link to="/mesas-abiertas">
        <button onClick={handleVerMesasAbiertasClick}>Ver Mesas Abiertas</button>
      </Link>
    </div>
    
  );
};

export default MesaAbrir;
