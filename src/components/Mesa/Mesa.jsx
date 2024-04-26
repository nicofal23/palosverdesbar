import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './MesaCard.module.css'

const Mesa = () => {
  const handleAbrirMesaClick = () => {
    // Lógica para redireccionar a la página de abrir mesa
  };

  const handleVerMesasAbiertasClick = () => {
    // Lógica para redireccionar a la página de ver mesas abiertas
  };

  return (
    <div className={styles.conteinerAdmMesa}>
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
