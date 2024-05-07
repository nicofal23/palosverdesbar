import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/cliente'; // Asegúrate de importar db desde Firebase
import './ModificarPrecio.css';

const ModificarPrecio = ({ producto, updateLocalState }) => {
  const [nuevoPrecio, setNuevoPrecio] = useState(producto.precio.toString());

  const handleModificarPrecio = async () => {
    try {
      const { value: nuevoPrecioInput } = await Swal.fire({
        title: 'Modificar Precio',
        input: 'text',
        inputValue: nuevoPrecio,
        inputLabel: 'Nuevo Precio',
        inputPlaceholder: 'Ingrese el nuevo precio',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar un precio';
          }
          if (isNaN(parseFloat(value))) {
            return 'Ingrese un valor numérico válido';
          }
        },
        customClass: {
          input: 'swal2-input',
          popup: 'custom-popup' // Clase personalizada para el popup
        } // Agregar la clase CSS al input
      });

      if (nuevoPrecioInput) {
        // Convertir el nuevo precio a número
        const nuevoPrecioNumber = parseFloat(nuevoPrecioInput);

        // Actualizar el precio en Firebase
        const productoRef = doc(db, 'productos', producto.id);
        await updateDoc(productoRef, { precio: nuevoPrecioNumber });

        // Actualizar el estado local de los productos
        updateLocalState(prevProductos => {
          return prevProductos.map(prod => {
            if (prod.id === producto.id) {
              return { ...prod, precio: nuevoPrecioNumber };
            } else {
              return prod;
            }
          });
        });

        // Mostrar mensaje de éxito con el nuevo precio
        Swal.fire('Precio Modificado', `El nuevo precio es: ${nuevoPrecioNumber.toFixed(2)}`, 'success');

        // Actualizar el estado del nuevo precio
        setNuevoPrecio(nuevoPrecioNumber.toString());
      }
    } catch (error) {
      console.error('Error al modificar el precio:', error);
      // Mostrar mensaje de error si ocurre algún problema
      Swal.fire('Error', 'Hubo un problema al modificar el precio', 'error');
    }
  };

  return (
    <button onClick={handleModificarPrecio}>Precio</button>
  );
};

export default ModificarPrecio;
