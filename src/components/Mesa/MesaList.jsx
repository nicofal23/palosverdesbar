import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import styles from '../MesaDetail/MesaCard.module.css';
import { Link } from 'react-router-dom';


const MesaList = () => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);

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
          productos: doc.data().productos,
          estado: doc.data().estado
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

  return (
    <div>
      <h2>Mesas</h2>
      {loading ? (
        <p>Cargando mesas...</p>
      ) : (
        <div>
          <h3>Mesas Abiertas</h3>
          <div className={styles.mesaContainer}>
            {mesas.filter(mesa => mesa.estado).map(mesa => (
              <div key={mesa.id} className={styles.mesaCard}>
                <p>Número de Mesa: {mesa.numeroMesa}</p>
                <p>Fecha de Creación: {mesa.createdAt ? mesa.createdAt.toLocaleString() : 'No disponible'}</p>
                <p>Productos: {mesa.productos}</p>
                <Link to={`/mesa/${mesa.id}`}>Ver Detalle</Link> 
              </div>
            ))}
          </div>
          <h3>Mesas Cerradas</h3>
          <div className={styles.mesaContainer}>
            {mesas.filter(mesa => !mesa.estado).map(mesa => (
              <div key={mesa.id} className={styles.mesaCard}>
                <p>Número de Mesa: {mesa.numeroMesa}</p>
                <p>Fecha de Creación: {mesa.createdAt ? mesa.createdAt.toLocaleString() : 'No disponible'}</p>
                <Link to={`/mesa/${mesa.id}`}>Ver Detalle</Link> {/* No necesitas pasar id como prop */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MesaList;
