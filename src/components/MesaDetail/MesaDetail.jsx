import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/cliente'; // Importa la referencia a la base de datos desde tu archivo cliente.js

const MesaDetail = ({ id }) => {
  const [mesa, setMesa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMesa = async () => {
        try {
          setLoading(true);
          console.log('ID:', id);
          const mesaDoc = await getDoc(doc(db, 'mesas', id)); // Aquí se usa el ID pasado como argumento
          if (mesaDoc.exists()) {
            setMesa({ id: mesaDoc.id, ...mesaDoc.data() });
          } else {
            console.log('No existe la mesa con el ID proporcionado');
          }
        } catch (error) {
          console.error('Error al obtener los detalles de la mesa:', error);
        } finally {
          setLoading(false);
        }
      };

    fetchMesa();
  }, [id]);

  if (loading) {
    return <p>Cargando detalles de la mesa...</p>;
  }

  if (!mesa) {
    return <p>No se encontraron detalles de la mesa.</p>;
  }

  return (
    <div>
      <h2>Detalle de la mesa</h2>
      <p>Número de mesa: {mesa.numeroMesa}</p>
      {/* Muestra otros detalles de la mesa según la estructura de tu documento en Firebase */}
      <p>Estado: {mesa.estado ? 'Abierta' : 'Cerrada'}</p>
    </div>
  );
};

export default MesaDetail;
