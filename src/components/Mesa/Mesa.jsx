import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/cliente'; // Importa la referencia a la base de datos desde tu archivo cliente.js
import { Link } from 'react-router-dom';

const Mesa = () => {
  const [showMesaList, setShowMesaList] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState(null);
  

  const [numeroMesa, setNumeroMesa] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [mercaderia, setMercaderia] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Función para cargar la mercadería desde Firebase
    const cargarMercaderia = async () => {
      try {
        const mercaderiaData = []; // Aquí almacenaremos los datos de la mercadería
        const querySnapshot = await db.collection('mercaderia').get(); // Consulta la colección 'mercaderia' en Firestore
        querySnapshot.forEach(doc => {
          mercaderiaData.push(doc.data()); // Agrega los datos del documento a la lista de mercadería
        });
        setMercaderia(mercaderiaData); // Actualiza el estado con la mercadería cargada desde Firebase
      } catch (error) {
        console.error('Error al cargar la mercadería:', error);
      }
    };

    cargarMercaderia();
  }, []);

  // Función para calcular el total
  const calcularTotal = () => {
    // Implementa la lógica para calcular el total
    let totalCalculado = 0;
    mercaderia.forEach(item => {
      totalCalculado += item.precio;
    });
    setTotal(totalCalculado);
  };

  const handleAbrirMesaClick = () => {
    setShowMesaList(true);
  };

  const handleVerMesasAbiertasClick = () => {
    setShowMesaList(true); // Cambia esto según tu lógica para mostrar las mesas abiertas
  };

  const handleMesaClick = (mesa) => {
    setSelectedMesa(mesa);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <Link to="/abrir-mesa">
        <button onClick={handleAbrirMesaClick}>Abrir Mesa</button>
      </Link>
      <Link to="/mesas-abiertas">
        <button onClick={handleVerMesasAbiertasClick}>Ver Mesas Abiertas</button>
      </Link>
    </div>
  );
};

export default Mesa;
