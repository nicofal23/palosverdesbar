import React from 'react';
import { Link } from 'react-router-dom';

export default function Prueba() {
  return (
    <div>
      <h1>Prueba</h1>
      <Link to="/admin">
        <button>Ir a /admin</button>
      </Link>
      <Link to="/category">
        <button>Ir a /category</button>
      </Link>
    </div>
  );
}
