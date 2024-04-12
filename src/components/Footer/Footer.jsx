// Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link desde React Router
import style from './Footer.module.css';

const Footer = () => {
  return (
    <div className={style.footer}>
      <p>© 2023 Mi Website \\  Falciglio Nicolas </p>
      {/* Enlace al componente FormularioCargaDatos */}
      <Link to="/admin">
        <button>BOTON</button>
      </Link>
    </div>
  );
};

export default Footer;
