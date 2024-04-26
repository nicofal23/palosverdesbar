import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import { useParams } from 'react-router-dom';
import ItemListMesa from '../ItemListMesa/ItemListMesa';
import Swal from 'sweetalert2';
import styles from './MesaDetail';

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
  const handleAddToMesa = async ({ nombre, precio }) => {
    try {
      const mesaRef = doc(db, 'mesas', id);
      await updateDoc(mesaRef, {
        productos: [...productosMesa, { nombre, precio, cantidad: 1 }]
      });
      console.log('Producto agregado a la mesa exitosamente.');

      // Actualizar la lista de productos de la mesa después de agregar el producto
      setProductosMesa([...productosMesa, { nombre, precio, cantidad: 1 }]);
    } catch (error) {
      console.error('Error al agregar el producto a la mesa:', error);
    }
  };

  // Función para modificar la cantidad de un producto en la mesa
  const handleModificarCantidad = async (index) => {
    Swal.fire({
      title: 'Modificar cantidad',
      input: 'number',
      inputAttributes: {
        min: '0',
        step: '1',
      },
      showCancelButton: true,
      confirmButtonText: 'Modificar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes ingresar una cantidad';
        }
        if (value < 0) {
          return 'La cantidad debe ser mayor o igual a cero';
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const nuevaCantidad = parseInt(result.value); // Convertir la cantidad a un número entero
        const productosActualizados = [...productosMesa];
        productosActualizados[index].cantidad = nuevaCantidad;

        // Actualizar la cantidad en Firebase
        await actualizarProductosMesa(productosActualizados);

        // Actualizar el estado local para que la vista refleje el cambio
        setProductosMesa(productosActualizados);
      }
    });
  };

  // Función para eliminar un producto de la mesa
  const handleEliminarProducto = async (index) => {
    const productosActualizados = [...productosMesa];
    productosActualizados.splice(index, 1);
    await actualizarProductosMesa(productosActualizados);

    // Actualizar el estado local para que la vista refleje el cambio
    setProductosMesa(productosActualizados);
  };

  // Función para actualizar los productos de la mesa en Firebase
  const actualizarProductosMesa = async (nuevosProductos) => {
    try {
      const mesaRef = doc(db, 'mesas', id);
      await updateDoc(mesaRef, { productos: nuevosProductos });
      console.log('Producto(s) actualizado(s) exitosamente.');
    } catch (error) {
      console.error('Error al actualizar los productos de la mesa:', error);
    }
  };

  // Calcular el total de la compra
  const totalCompra = productosMesa.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);

  return (
    <div className={styles.contenedor}>
      {loading ? (
        <p>Cargando detalles de la mesa...</p>
      ) : mesa ? (
        <div className={styles.detallemesa}>
          <div className={styles.detalles}>
            <p>Número de Mesa: {mesa.numeroMesa}</p>
            <p>Fecha de Creación: {mesa.createdAt ? new Date(mesa.createdAt.seconds * 1000).toLocaleString() : 'No disponible'}</p>
            <p>Estado: {mesa.estado ? 'Abierta' : 'Cerrada'}</p>
            <h2>Productos en la mesa:</h2>
            {productosMesa.map((producto, index) => (
              <div key={index}>
                <p>Producto: {producto.nombre}</p>
                <p>Precio: ${producto.precio}</p>
                <p>Cantidad: {producto.cantidad}</p>
                <button onClick={() => handleEliminarProducto(index)}>X</button>
                <button onClick={() => handleModificarCantidad(index)}>Modificar</button>
              </div>
            ))}
            <p>Total: ${totalCompra}</p> {/* Mostrar el total de la compra */}
          </div>
          <div className={styles.listaProductos}>
            <h2>Productos Disponibles:</h2>
            <ItemListMesa greeting="Lista de Productos" mesaId={id} onAdd={handleAddToMesa}/>
          </div>
        </div>
      ) : (
        <p>No se encontró la mesa</p>
      )}
    </div>
  );
};

export default MesaDetail;
