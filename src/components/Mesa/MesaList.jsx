import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import styles from '../MesaDetail/MesaCard.module.css';
import { Link } from 'react-router-dom';

const MesaList = () => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchNumeroMesa, setSearchNumeroMesa] = useState('');
  const [searchNombreSocio, setSearchNombreSocio] = useState('');

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
          nombreSocio: doc.data().nombreSocio,
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

    // Ejecutar la limpieza de mesas cerradas al montar el componente
    cleanUpClosedMesas();

    // Configurar la ejecución periódica para limpiar mesas cerradas cada 24 horas
    const interval = setInterval(() => {
      cleanUpClosedMesas();
    }, 24 * 60 * 60 * 1000); // Ejecutar cada 24 horas (86400000 milisegundos)
  
    // Limpiar el intervalo cuando el componente se desmonte para evitar fugas de memoria
    return () => clearInterval(interval);
  }, []);

  const cleanUpClosedMesas = async () => {
    try {
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const closedMesasToDelete = mesas.filter(mesa => mesa.estado === false && mesa.createdAt < thirtyDaysAgo);

      closedMesasToDelete.forEach(async mesa => {
        // Eliminar la mesa de Firestore
        await deleteDoc(doc(db, 'mesas', mesa.id));

        // Eliminar la mesa del estado local (si es necesario)
        setMesas(prevMesas => prevMesas.filter(m => m.id !== mesa.id));
      });

      console.log('Mesas cerradas eliminadas:', closedMesasToDelete);
    } catch (error) {
      console.error('Error al limpiar mesas cerradas:', error);
    }
  };

  const mesasFiltradas = mesas.filter(mesa => {
    const numeroMesaMatch = mesa.numeroMesa.toString().includes(searchNumeroMesa);
    const nombreSocioMatch = mesa.nombreSocio.toLowerCase().includes(searchNombreSocio.toLowerCase());
    return numeroMesaMatch && nombreSocioMatch;
  });

  return (
    <div>
      <h2 className={styles.h1}>Mesas</h2>
      <div className={styles.input}>
        <div className={styles.contenedorInput}> 
          <p>Buscar por numero de mesa</p>
          <input
            className={styles.inputt}
            type="text"
            pattern="[0-9]*"
            placeholder="Buscar por número de mesa"
            value={searchNumeroMesa}
            onChange={e => {
              const input = e.target.value;
              const regex = /^[0-9\b]+$/; // Expresión regular para permitir solo dígitos
              if (input === '' || regex.test(input)) {
                setSearchNumeroMesa(input);
              }
            }}
          />
        </div>
        <div className={styles.contenedorInput}>
          <p>Buscar por nombre del socio</p>
          <input
            type="text"
            placeholder="Buscar por nombre del socio"
            value={searchNombreSocio}
            onChange={e => setSearchNombreSocio(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <p>Cargando mesas...</p>
      ) : (
        <div>
          <h3>Mesas Abiertas</h3>
          <div className={styles.mesaContainer}>
            {mesasFiltradas.filter(mesa => mesa.estado === true).map(mesa => (
              <div key={mesa.id} className={styles.mesaCard1}>
                <p>Número de Mesa: {mesa.numeroMesa}</p>
                <p>Socio: {mesa.nombreSocio}</p>
                <p>Fecha de Creación: {mesa.createdAt ? mesa.createdAt.toLocaleString() : 'No disponible'}</p>
                <Link to={`/mesa/${mesa.id}`} className={styles.verDetalle}>Ver Detalle</Link> 
              </div>
            ))}
          </div>
          <h3>Mesas Cerradas</h3>
          <div className={styles.mesaContainer}>
            {mesasFiltradas.filter(mesa => mesa.estado === false).map(mesa => (
              <div key={mesa.id} className={styles.mesaCard}>
                <p>Número de Mesa: {mesa.numeroMesa}</p>
                <p>Socio: {mesa.nombreSocio}</p>
                <p>Fecha de Creación: {mesa.createdAt ? mesa.createdAt.toLocaleString() : 'No disponible'}</p>
                <Link to={`/mesa/${mesa.id}`} className={styles.verDetalle} >Ver Detalle</Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MesaList;
