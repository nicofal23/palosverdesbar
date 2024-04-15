import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Prueba.css';
import Modal from '../Modal/Modal';
import { auth, signInWithEmailAndPassword } from '../../firebase/cliente';

export default function Prueba() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Obteniendo la función de navegación

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Redirige al usuario a la página de admin después de iniciar sesión exitosamente
      navigate('/admin');
      setShowModal(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      <h1>Prueba</h1>
      <div className="buttons-container">
        <button className="blue-button" onClick={() => setShowModal(true)}>Mesas</button>
        <Link to="/category">
          <button className="blue-button">Carta</button>
        </Link>
      </div>
      
      <Modal 
        showModal={showModal}
        handleClose={handleClose}
        handleLogin={handleLogin}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
      />
    </div>
  );
}
