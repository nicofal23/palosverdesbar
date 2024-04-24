import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import styles from './MesaCard.module.css'; // Importa los estilos de la tarjeta de mesa

const MesaList = ({ onMesaClick }) => {
  const [mesasAbiertas, setMesasAbiertas] = useState([]);
  const [mesasCerradas, setMesasCerradas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetchMesas = async () => {
      try {
        const mesaCollectionRef = collection(db, 'mesas');
        const mesaQuery = query(mesaCollectionRef);
        const querySnapshot = await getDocs(mesaQuery);

        const mesas = querySnapshot.docs.map(doc => ({
          id: doc.id,
          numeroMesa: doc.data().numeroMesa,
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : null,
          estado: doc.data().estado // Asegúrate de tener el campo "estado" en tu documento de mesa
        }));

        const mesasAbiertas = mesas.filter(mesa => mesa.estado);
        const mesasCerradas = mesas.filter(mesa => !mesa.estado);

        setMesasAbiertas(mesasAbiertas);
        setMesasCerradas(mesasCerradas);
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
          {mesasAbiertas.length > 0 && (
            <div>
              <h3>Mesas abiertas</h3>
              <div className={styles.mesaConteiner}>
                {mesasAbiertas.map(mesa => (
                  <div
                    key={mesa.id}
                    className={`${styles.mesaCard} ${styles.abierto}`}
                    onClick={() => onMesaClick(mesa)}
                  >
                    <p>Mesa {mesa.numeroMesa}</p>
                    <p>{mesa.createdAt ? `Creada el: ${mesa.createdAt.toLocaleString()}` : 'Fecha de creación no disponible'}</p>
                    <p>Abierta</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {mesasCerradas.length > 0 && (
            <div>
              <h3>Mesas cerradas</h3>
              <div className={styles.mesaConteiner}>
                {mesasCerradas.map(mesa => (
                  <div
                    key={mesa.id}
                    className={`${styles.mesaCard} ${styles.cerrado}`}
                    onClick={() => onMesaClick(mesa)}
                  >
                    <p>Mesa {mesa.numeroMesa}</p>
                    <p>{mesa.createdAt ? `Creada el: ${mesa.createdAt.toLocaleString()}` : 'Fecha de creación no disponible'}</p>
                    <p>Cerrada</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MesaList;
