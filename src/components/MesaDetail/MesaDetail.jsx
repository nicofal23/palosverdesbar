import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import styles from './MesaCard.module.css'; // Importa los estilos de la tarjeta de mesa
import MesaDetailModal from './MesaDetailModal'; // Importa el componente MesaDetailModal

const MesaList = () => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMesaId, setSelectedMesaId] = useState(null);

  useEffect(() => {
    const fetchMesas = async () => {
      try {
        setLoading(true);
        const mesaCollectionRef = collection(db, 'mesas');
        const mesaQuery = query(mesaCollectionRef);
        const querySnapshot = await getDocs(mesaQuery);

        const mesasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          numeroMesa: doc.data().numeroMesa,
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null,
        }));

        setMesas(mesasData);
      } catch (error) {
        console.error('Error fetching mesas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMesas();
  }, []);

  const handleVerDetalle = (mesaId) => {
    setSelectedMesaId(mesaId);
  };

  const handleCloseModal = () => {
    setSelectedMesaId(null);
  };

  return (
    <div>
      <h2>Mesas</h2>
      {loading ? (
        <p>Cargando mesas...</p>
      ) : (
        <div className={styles.mesaContainer}>
          {mesas.map(mesa => (
            <div key={mesa.id} className={styles.mesaCard}>
              <p>Número de Mesa: {mesa.numeroMesa}</p>
              <p>Fecha de Creación: {mesa.createdAt ? mesa.createdAt.toLocaleString() : 'No disponible'}</p>
              <button onClick={() => handleVerDetalle(mesa.id)}>Ver Detalle</button>
            </div>
          ))}
        </div>
      )}
      {selectedMesaId && (
        <MesaDetailModal mesaId={selectedMesaId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MesaList;
