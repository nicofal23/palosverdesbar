import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../firebase/cliente';
import { useParams } from 'react-router-dom';
import ItemListMesa from '../ItemListMesa/ItemListMesa';
import Swal from 'sweetalert2';
import styles from './MesaCard.module.css';
import { jsPDF } from 'jspdf';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

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
const handleAddToMesa = async ({ nombre, precio }, cantidadSeleccionada) => {
  try {
    const mesaRef = doc(db, 'mesas', id);
    // Verificar si el producto ya está en la lista de productos de la mesa
    const productoExistenteIndex = productosMesa.findIndex(producto => producto.nombre === nombre);

    if (productoExistenteIndex !== -1) {
      // Producto existente: mostrar un alert para preguntar si desea agregar más
      Swal.fire({
        title: 'Producto existente',
        text: 'El producto ya está en la mesa. ¿Desea agregar más?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Agregar más cantidad del producto existente
          const nuevaCantidad = parseInt(cantidadSeleccionada);
          const productosActualizados = [...productosMesa];
          productosActualizados[productoExistenteIndex].cantidad += nuevaCantidad;

          // Actualizar la cantidad en Firebase
          await actualizarProductosMesa(productosActualizados);

          // Actualizar el estado local para que la vista refleje el cambio
          setProductosMesa(productosActualizados);
        }
      });
    } else {
      // Producto no existente: agregar como un nuevo producto a la mesa
      // Actualizar en Firestore
      await updateDoc(mesaRef, {
        productos: [...productosMesa, { nombre, precio, cantidad: cantidadSeleccionada }]
      });

      // Actualizar el estado local después de la actualización en Firestore
      setProductosMesa([...productosMesa, { nombre, precio, cantidad: cantidadSeleccionada }]);
      console.log('Producto agregado a la mesa exitosamente.');
    }
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
const handleEliminarProducto = (index) => {
  // Mostrar un alert para confirmar la eliminación
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Una vez eliminado, se quitara el producto de la mesa.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const productosActualizados = [...productosMesa];
      productosActualizados.splice(index, 1);
      await actualizarProductosMesa(productosActualizados);

      // Actualizar el estado local para que la vista refleje el cambio
      setProductosMesa(productosActualizados);
    }
  });
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

  // Función para cerrar la mesa
  const handleCerrarMesa = async () => {
    try {
      const mesaRef = doc(db, 'mesas', id);
      await updateDoc(mesaRef, { estado: false });

      // Generar el detalle de la mesa en PDF
      const pdf = new jsPDF();
      pdf.text('Detalle del Ticket', 50, 10);
      pdf.text(`Socio: ${mesa.nombreSocio}`, 10, 20);
      pdf.text(`Número de Mesa: ${mesa.numeroMesa}`, 10, 30);
      pdf.text(`Fecha: ${mesa.createdAt ? new Date(mesa.createdAt.seconds * 1000).toLocaleString() : 'No disponible'}`, 10, 40);
      pdf.text('Productos consumidos:', 10, 50);
      productosMesa.forEach((producto, index) => {
        pdf.text(`${index + 1}. Producto: ${producto.nombre},     Precio: $${producto.precio},     Cantidad: ${producto.cantidad}`, 10, 60 + index * 10);
      });
      pdf.text(`Total: $${totalCompra}`, 90, 80 + productosMesa.length * 10);
      pdf.save(`Mesa_${mesa.numeroMesa}_${mesa.nombreSocio}.pdf`);

      console.log('Mesa cerrada y detalle descargado en PDF exitosamente.');
    } catch (error) {
      console.error('Error al cerrar la mesa:', error);
    }
  };

  // Función para reimprimir el ticket
 // Función para reimprimir el ticket
const handleReimprimirTicket = async () => {
  try {
    const pdf = new jsPDF();
    pdf.text('Detalle del Ticket', 50, 10);
      pdf.text(`Socio: ${mesa.nombreSocio}`, 10, 20);
      pdf.text(`Número de Mesa: ${mesa.numeroMesa}`, 10, 30);
      pdf.text(`Fecha: ${mesa.createdAt ? new Date(mesa.createdAt.seconds * 1000).toLocaleString() : 'No disponible'}`, 10, 40);
      pdf.text('Productos consumidos:', 10, 50);
      productosMesa.forEach((producto, index) => {
        pdf.text(`${index + 1}. Producto: ${producto.nombre},     Precio: $${producto.precio},     Cantidad: ${producto.cantidad}`, 10, 60 + index * 10);
      });
      pdf.text(`Total: $${totalCompra}`, 90, 80 + productosMesa.length * 10);
      pdf.save(`Ticket_Mesa_${mesa.numeroMesa}.pdf`);

    console.log('Ticket reimprimido exitosamente.');
  } catch (error) {
    console.error('Error al reimprimir el ticket:', error);
  }
};


  // Calcular el total de la compra
  const totalCompra = productosMesa.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);

  return (
    <div className={styles.contenedor}>
      {loading ? (
        <div className={styles.mesa}>
            <LoadingSpinner />
      </div>
      ) : mesa ? (
        <div className={styles.detallemesa}>
          <div className={styles.detalles}>
            <p>Número de Mesa: {mesa.numeroMesa}</p>
            <p>Socio: {mesa.nombreSocio}</p>
            <p>Fecha de Creación: {mesa.createdAt ? new Date(mesa.createdAt.seconds * 1000).toLocaleString() : 'No disponible'}</p>
            <p>Estado: {mesa.estado ? 'Abierta' : 'Cerrada'}</p>
            <div className={styles.conteinerH2}>
              <h2 className={styles.titulo}>Productos en la mesa:</h2>
            </div>
            {productosMesa.map((producto, index) => (
  <div key={index} className={styles.card}>
    <div className={styles.cardMesa}>
      <p>Producto: {producto.nombre}</p>
      <p>Precio: ${producto.precio}</p>
      <p>Cantidad: {producto.cantidad}</p>
      <div className={styles.botonesEditor}>
        {/* Deshabilitar los botones si la mesa está cerrada */}
        <button onClick={() => handleModificarCantidad(index)} disabled={!mesa.estado}>
          Modificar
        </button>
        <button onClick={() => handleEliminarProducto(index)} disabled={!mesa.estado}>
          Eliminar
        </button>
      </div>
    </div>
    <div className={styles.delete}>
      <button onClick={() => handleEliminarProducto(index)} disabled={!mesa.estado}>
        X
      </button>
    </div>
  </div>
))}

            <p className={styles.parrafo}>Total: ${totalCompra}</p> {/* Mostrar el total de la compra */}
            {mesa.estado && (
              <button onClick={handleCerrarMesa}>Cerrar Mesa</button>
            )}
            {!mesa.estado && (
              <button onClick={handleReimprimirTicket}>Reimprimir Ticket</button>
            )}
          </div>
          {mesa.estado && (
            <div className={styles.listaProductos}>
              <h2>Productos Disponibles:</h2>
              <ItemListMesa
  greeting="Lista de Productos"
  mesaId={id}
  onAddToMesa={handleAddToMesa}
  updateProductosMesa={setProductosMesa} // Pasar la función de actualización
/>

            </div>
          )}
        </div>
      ) : (
        <p>No se encontró la mesa</p>
      )}
    </div>
  );
};  

export default MesaDetail;
