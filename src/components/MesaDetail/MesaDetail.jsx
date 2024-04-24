import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/cliente';

const MesaDetail = ({ mesaId }) => {
  console.log(mesaId)
  const [mesa, setMesa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMesa = async () => {
      try {
        setLoading(true);
        const mesaRef = doc(db, 'mesas', mesaId);
        const mesaDoc = await getDoc(mesaRef);

        if (mesaDoc.exists()) {
          const mesaData = {
            id: mesaDoc.id,
            ...mesaDoc.data()
          };
          setMesa(mesaData);
        } else {
          console.log('No existe la mesa con el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener la mesa:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMesa();
  }, [mesaId]);

  return (
    <div>
      {loading ? (
        <p>Cargando detalles de la mesa...</p>
      ) : mesa ? (
        <div>
          <p>Número de Mesa: {mesa.numeroMesa}</p>
          <p>Fecha de Creación: {mesa.createdAt ? mesa.createdAt.toLocaleString() : 'No disponible'}</p>
          <p>Productos: {mesa.productos}</p>
          <p>Estado: {mesa.estado ? 'Abierta' : 'Cerrada'}</p>
        </div>
      ) : (
        <p>No se encontró la mesa</p>
      )}
    </div>
  );
};

export default MesaDetail;
