// MesaList.js

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/cliente'; // Importa la referencia a la base de datos desde tu archivo cliente.js

const MesaList = ({ onMesaClick }) => {
  const [mesas, setMesas] = useState([]);

  useEffect(() => {
    // Función para cargar todas las mesas desde Firebase
    const cargarMesas = async () => {
      try {
        const mesasData = []; // Aquí almacenaremos los datos de las mesas
        const querySnapshot = await db.collection('mesas').get(); // Consulta la colección 'mesas' en Firestore
        querySnapshot.forEach(doc => {
          mesasData.push({ id: doc.id, ...doc.data() }); // Agrega los datos del documento a la lista de mesas
        });
        setMesas(mesasData); // Actualiza el estado con las mesas cargadas desde Firebase
      } catch (error) {
        console.error('Error al cargar las mesas:', error);
      }
    };

    cargarMesas();
  }, []);

  return (
    <div>
      <h2>Mesas</h2>
      <ul>
        {mesas.map(mesa => (
          <li key={mesa.id} onClick={() => onMesaClick(mesa)}>
            Mesa {mesa.numeroMesa}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MesaList;
