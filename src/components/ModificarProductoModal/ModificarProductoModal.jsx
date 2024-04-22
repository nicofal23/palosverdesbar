// ModificarProductoModal.jsx
import React, { useState } from "react";
import Modal from "../Modal/Modal";

const ModificarProductoModal = ({ producto, onClose, onUpdate }) => {
  const [nombre, setNombre] = useState(producto.nombre);
  const [descripcion, setDescripcion] = useState(producto.descripcion);
  const [imagen, setImagen] = useState(producto.imagen);
  const [precio, setPrecio] = useState(producto.precio);

  const handleGuardar = () => {
    // Actualizar el producto en Firestore
    onUpdate({ id: producto.id, nombre, descripcion, imagen, precio });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <h2>Modificar Producto</h2>
      <label>Nombre:</label>
      <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      {/* Agregar más campos para descripción, imagen, precio, etc. */}
      <button onClick={handleGuardar}>Guardar cambios</button>
    </Modal>
  );
};

export default ModificarProductoModal;
