import React from 'react';
import styles from './Modal.module.css'; // Importa las clases CSS del módulo

const Modal = ({ showModal, handleClose, handleLogin, email, setEmail, password, setPassword, error }) => {
  return (
    <>
      {showModal && (
        <div className={styles.modal}> {/* Aplica la clase CSS del módulo */}
          <form className={styles['login-form']} onSubmit={handleLogin}> {/* Aplica la clase CSS del módulo */}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
            <button type="submit">Iniciar sesión</button>
            {error && <p>{error}</p>}
          </form>
          <button className={styles['close-button']} onClick={handleClose}>Cerrar</button> {/* Aplica la clase CSS del módulo */}
        </div>
      )}
    </>
  );
}

export default Modal;
