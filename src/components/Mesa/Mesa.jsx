// Mesa.js

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/cliente'; // Importa la referencia a la base de datos desde tu archivo cliente.js
import MesaList from './MesaList';
import Modal from './Modal';

const Mesa = () => {
  const [showMesaList, setShowMesaList] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

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

  const handleCrearMesaClick = () => {
    setShowMesaList(true);
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
      {!showMesaList && (
        <button onClick={handleCrearMesaClick}>Crear Mesa</button>
      )}
      {showMesaList && <MesaList onMesaClick={handleMesaClick} />}
      {/* Resto del código del componente Mesa... */}

      {selectedMesa && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Detalles de la Mesa"
        >
          <h2>Mesa {selectedMesa.numeroMesa}</h2>
          <ul>
            {selectedMesa.mercaderia.map((item, index) => (
              <li key={index}>{item.nombre} - ${item.precio}</li>
            ))}
          </ul>
          <button onClick={closeModal}>Cerrar</button>
          {/* Botones para agregar/quitar productos */}
          {/* Implementa la lógica para agregar/quitar productos a la mesa */}
        </Modal>
      )}
    </div>
  );
};

export default Mesa;
