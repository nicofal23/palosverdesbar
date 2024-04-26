import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import { useParams } from 'react-router-dom';
import ItemListMesa from '../ItemListMesa/ItemListMesa';

const MesaDetail = () => {
  const { id } = useParams(); // Obtener el id de los parámetros de la URL
  const [mesa, setMesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productosMesa, setProductosMesa] = useState([]);


  useEffect(() => {
    const fetchMesa = async () => {
      try {
        setLoading(true);
        const mesaRef = doc(db, 'mesas', id);
        const mesaDoc = await getDoc(mesaRef);
  
        if (mesaDoc.exists()) {
          const mesaData = {
            id: mesaDoc.id,
            ...mesaDoc.data()
          };
          setMesa(mesaData);
        } else {
          console.log('No existe la mesa con el ID proporcionado');
        }
      } catch (error) {
        console.error('Error al obtener la mesa:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMesa();
  }, [id]);

  // Función para manejar la adición de productos a la mesa
  // Dentro del componente MesaDetail
  const handleAddToMesa = async ({ nombre, precio, cantidad }) => {
    try {
      const mesaRef = doc(db, 'mesas', id);
      await updateDoc(mesaRef, {
        productos: arrayUnion({
          nombre,
          precio,
          cantidad
        })
      });
      console.log('Producto agregado a la mesa exitosamente.');
    } catch (error) {
      console.error('Error al agregar el producto a la mesa:', error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Cargando detalles de la mesa...</p>
      ) : mesa ? (
        <div>
          <p>Número de Mesa: {mesa.numeroMesa}</p>
          <p>Fecha de Creación: {mesa.createdAt ? new Date(mesa.createdAt.seconds * 1000).toLocaleString() : 'No disponible'}</p>
          <p>Estado: {mesa.estado ? 'Abierta' : 'Cerrada'}</p>
          
          {/* Mostrar los productos asignados a la mesa */}
          <h2>Productos en la mesa:</h2>
          {productosMesa.map(producto => (
            <div key={producto.id}>
              <p>{producto.nombre}</p>
              <p>{producto.stock}</p>
              <p>{producto.precio}</p>
              {/* Mostrar otros detalles del producto si es necesario */}
            </div>
          ))}
          
          
          {/* Mostrar la lista de productos disponibles para agregar */}
          <h2>Productos Disponibles:</h2>
          <ItemListMesa greeting="Lista de Productos" mesaId={id} onAdd={handleAddToMesa}/>
        </div>
      ) : (
        <p>No se encontró la mesa</p>
      )}
    </div>
  );
};

export default MesaDetail;
