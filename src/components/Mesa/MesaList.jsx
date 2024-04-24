import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import styles from './MesaCard.module.css'; // Importa los estilos de la tarjeta de mesa
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

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
              <div className={styles.mesaContainer}>
                {mesasAbiertas.map(mesa => (
                  <Link key={mesa.id} to={`/mesa/${mesa.id}`} state={{ numeroMesa: mesa.numeroMesa }}>
                    {/* Utiliza el ID de la mesa en la URL */}
                    <div className={`${styles.mesaCard} ${styles.abierto}`}>
                      <p>Mesa {mesa.numeroMesa}</p>
                      <p>{mesa.createdAt ? `Creada el: ${mesa.createdAt.toLocaleString()}` : 'Fecha de creación no disponible'}</p>
                      <p>Abierta</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {mesasCerradas.length > 0 && (
            <div>
              <h3>Mesas cerradas</h3>
              <div className={styles.mesaContainer}>
                {mesasCerradas.map(mesa => (
                  <Link key={mesa.id} to={`/mesa/${mesa.id}`} state={{ numeroMesa: mesa.numeroMesa }}>
                    {/* Utiliza el ID de la mesa en la URL */}
                    <div className={`${styles.mesaCard} ${styles.cerrado}`}>
                      <p>Mesa {mesa.numeroMesa}</p>
                      <p>{mesa.createdAt ? `Creada el: ${mesa.createdAt.toLocaleString()}` : 'Fecha de creación no disponible'}</p>
                      <p>Cerrada</p>
                    </div>
                  </Link>
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
