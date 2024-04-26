import React, { useState } from 'react';
import { db } from '../../firebase/cliente';
import { collection, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import styles from './AbrirMesa.module.css';
import Swal from 'sweetalert2';

const MesaAbrir = () => {
  const [numeroMesa, setNumeroMesa] = useState('');
  const [nombreSocio, setNombreSocio] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNumeroMesaChange = (event) => {
    setNumeroMesa(event.target.value);
  };

  const handleNombreSocioChange = (event) => {
    setNombreSocio(event.target.value);
  };

  const handleVerMesasAbiertasClick = () => {
    // Lógica para ver las mesas abiertas
  };

  const handleAbrirMesaClick = async () => {
    if (!numeroMesa || !nombreSocio) {
      setError('Por favor ingresa un número de mesa y el nombre del socio.');
      return;
    }

    setLoading(true);

    try {
      const mesaId = `${numeroMesa}-${new Date().getTime()}`;
      const mesaRef = collection(db, 'mesas');

      // Agrega el campo 'estado' con el valor 'true' al documento de la mesa
      await addDoc(mesaRef, {
        id: mesaId,
        numeroMesa: numeroMesa,
        nombreSocio: nombreSocio,
        estado: true, // Estado por defecto siempre en true
        createdAt: new Date(),
        productos: []
      });

      Swal.fire({
        icon: 'success',
        title: 'Mesa Abierta',
        text: 'La mesa se ha abierto exitosamente. Puedes comenzar a operar.',
        confirmButtonText: 'Administrar Mesas',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/mesas-abiertas';
        }
      });
    } catch (error) {
      console.error('Error al abrir la mesa:', error);
      setError('Hubo un error al abrir la mesa. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.h1}>Abrir Mesa</h1>
      {error && <p>{error}</p>}
      <div className={styles.input}>
        <input
          type="text"
          value={numeroMesa}
          onChange={handleNumeroMesaChange}
          placeholder="Número de Mesa"
        />
        <input
          type="text"
          value={nombreSocio}
          onChange={handleNombreSocioChange}
          placeholder="Nombre del Socio"
        />
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleAbrirMesaClick} disabled={loading}>Abrir Mesa</button>
        <Link to="/administrar-mesas">
          <button>Administrar Mesas</button>
        </Link>
      </div>
    </div>
  );
};

export default MesaAbrir;
