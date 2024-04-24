// MesaDetailModal.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/cliente';

const MesaDetailModal = ({ mesaId, onClose }) => {
  const [mesa, setMesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMesa = async () => {
      try {
        setLoading(true);
        const mesaDoc = await getDoc(doc(db, 'mesas', mesaId));
        if (mesaDoc.exists()) {
          setMesa({ id: mesaDoc.id, ...mesaDoc.data() });
          setProductos(mesaDoc.data().productos || []);
        } else {
          console.log('No existe la mesa con el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener los detalles de la mesa:', error);
        setError('Error al cargar los detalles de la mesa');
      } finally {
        setLoading(false);
      }
    };

    fetchMesa();
  }, [mesaId]);

  const handleAddProducto = () => {
    if (nuevoProducto.trim() !== '') {
      setProductos([...productos, nuevoProducto]);
      setNuevoProducto('');
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (loading) {
    return <p>Cargando detalles de la mesa...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!mesa) {
    return <p>No se encontraron detalles de la mesa.</p>;
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>Detalle de la mesa</h2>
        <p>Número de mesa: {mesa.numeroMesa}</p>
        <p>Fecha de creación: {mesa.createdAt ? mesa.createdAt.toDate().toLocaleString() : 'No disponible'}</p>
        <h3>Productos agregados a la mesa:</h3>
        <ul>
          {productos.map((producto, index) => (
            <li key={index}>{producto}</li>
          ))}
        </ul>
        <h3>Agregar nuevo producto:</h3>
        <input type="text" value={nuevoProducto} onChange={e => setNuevoProducto(e.target.value)} />
        <button onClick={handleAddProducto}>Agregar Producto</button>
      </div>
    </div>
  );
};

export default MesaDetailModal;