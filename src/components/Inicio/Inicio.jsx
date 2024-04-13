import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Prueba.css'; // Importa tu archivo de estilos CSS
import { auth } from '../../firebase/cliente'; // Importa tu instancia de autenticación de Firebase

export default function Prueba() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Si el inicio de sesión es exitoso, redirige a "/admin" u otra ruta según sea necesario
      // history.push('/admin');
      setShowModal(false); // Oculta el modal después de iniciar sesión
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1>Prueba</h1>
      <div className="buttons-container">
        {/* Botón para Mesas */}
        <button className="blue-button" onClick={() => setShowModal(true)}>Mesas</button>

        {/* Botón para Carta */}
        <Link to="/category">
          <button>Carta</button>
        </Link>
      </div>

      {/* Modal de inicio de sesión */}
      {showModal && (
        <div className="modal">
          <form className="login-form" onSubmit={handleLogin}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
            <button type="submit">Iniciar sesión</button>
            {error && <p>{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
