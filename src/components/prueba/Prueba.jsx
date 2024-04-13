import React from 'react';
import { Link } from 'react-router-dom';

export default function Prueba() {
  return (
    <div>
      <h1>Prueba</h1>
      {/* Botón para ir a la ruta '/admin' */}
      <Link to="/admin">
        <button>Ir a /admin</button>
      </Link>
      {/* Botón para ir a la ruta '/category' */}
      <Link to="/category">
        <button>Ir a /category</button>
      </Link>
    </div>
  );
}
