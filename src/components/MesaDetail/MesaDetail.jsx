import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import { useParams } from 'react-router-dom';
import ItemListMesa from '../ItemListMesa/ItemListMesa';
import Swal from 'sweetalert2';

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
          
          // Obtener los productos asignados a la mesa
          if (mesaData.productos) {
            setProductosMesa(mesaData.productos);
          }
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
        productos: arrayRemove({
          nombre,
          precio,
          cantidad
        })
      });
      console.log('Producto agregado a la mesa exitosamente.');
      
      // Actualizar la lista de productos de la mesa después de agregar el producto
      setProductosMesa([...productosMesa, { nombre, precio, cantidad }]);
    } catch (error) {
      console.error('Error al agregar el producto a la mesa:', error);
    }
  };

  const handleEliminarProducto = (index) => {
    Swal.fire({
      title: '¿Cuántos productos deseas eliminar?',
      input: 'number',
      inputAttributes: {
        min: '0',
        step: '1',
      },
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar una cantidad';
        }
        if (value < 0) {
          return 'La cantidad debe ser mayor o igual a cero';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const cantidadEliminar = parseInt(result.value); // Convertir la cantidad a un número entero
        if (cantidadEliminar === 0) {
          // Si la cantidad a eliminar es 0, eliminar el producto completo
          const productosActualizados = productosMesa.filter((_, i) => i !== index);
          actualizarProductosMesa(productosActualizados);
        } else {
          // Si la cantidad a eliminar es mayor que 0, actualizar la cantidad del producto
          const productosActualizados = [...productosMesa];
          productosActualizados[index].cantidad -= cantidadEliminar;
          actualizarProductosMesa(productosActualizados);
        }
      }
    });
  };
  

  const actualizarProductosMesa = async (nuevosProductos) => {
    try {
      const mesaRef = doc(db, 'mesas', id);
      await updateDoc(mesaRef, { productos: nuevosProductos });
      console.log('Producto(s) eliminado(s) de la mesa exitosamente.');
    } catch (error) {
      console.error('Error al eliminar el producto de la mesa:', error);
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
          {productosMesa.map((producto, index) => (
            <div key={index}>
              <p>{producto.nombre}</p>
              <p>{producto.stock}</p>
              <p>{producto.precio}</p>
              <button onClick={() => handleEliminarProducto(index)}>Eliminar</button>
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
