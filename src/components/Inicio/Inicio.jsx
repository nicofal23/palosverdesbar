import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Prueba.css';
import Modal from '../Modal/Modal';
import { auth, signInWithEmailAndPassword } from '../../firebase/cliente';
import FormularioCargaDatos from '../ProductComponent/FormularioCargaDatos';

export default function Prueba() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // Estado para verificar si el usuario ha iniciado sesión
  const navigate = useNavigate(); // Obteniendo la función de navegación

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Actualiza el estado para indicar que el usuario ha iniciado sesión
      setLoggedIn(true);
      setShowModal(false);
    } catch (error) {
      setError('Usuario y/o contraseña incorrecto');
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      <h2 className="titulo">Panel de usuario</h2>
      <div className="buttons-container">
        <button className="blue-button" onClick={() => setShowModal(true)}>Administración</button>
        <Link to="/carta">
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
      
      {loggedIn && <FormularioCargaDatos />}
    </div>
  );
}