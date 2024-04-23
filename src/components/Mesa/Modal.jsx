// Modal.js

import React from 'react';

const Modal = ({ isOpen, onRequestClose, mesa }) => {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onRequestClose}>&times;</span>
        <h2>Mesa {mesa.numeroMesa}</h2>
        <ul>
          {mesa.mercaderia.map((item, index) => (
            <li key={index}>{item.nombre} - ${item.precio}</li>
          ))}
        </ul>
        <button onClick={onRequestClose}>Cerrar</button>
        {/* Botones para agregar/quitar productos */}
        {/* Implementa la lógica para agregar/quitar productos a la mesa */}
      </div>
    </div>
  );
};

export default Modal;
