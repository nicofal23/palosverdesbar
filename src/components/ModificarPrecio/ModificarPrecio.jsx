import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/cliente'; // Asegúrate de importar db desde Firebase
import './ModificarPrecio.css'

const ModificarPrecio = ({ producto }) => {
  const [nuevoPrecio, setNuevoPrecio] = useState('');

  const handleModificarPrecio = async () => {
    try {
      const { value: nuevoPrecioInput } = await Swal.fire({
        title: 'Modificar Precio',
        input: 'text',
        inputValue: producto.precio, // Valor actual del precio
        inputLabel: 'Nuevo Precio',
        inputPlaceholder: 'Ingrese el nuevo precio',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar un precio';
          }
        },
        customClass: {
          input: 'swal2-input',
          popup: 'custom-popup' // Clase personalizada para el popup
        } // Agregar la clase CSS al input
      });

      if (nuevoPrecioInput) {
        // Convertir el nuevo precio a número o el formato que requieras
        const nuevoPrecioNumber = parseFloat(nuevoPrecioInput);

        // Actualizar el precio en Firebase
        const productoRef = doc(db, 'productos', producto.id);
        await updateDoc(productoRef, { precio: nuevoPrecioNumber });

        // Mostrar mensaje de éxito
        Swal.fire('Precio Modificado', `El nuevo precio es: ${nuevoPrecioNumber}`, 'success');
      }
    } catch (error) {
      console.error('Error al modificar el precio:', error);
      // Mostrar mensaje de error si ocurre algún problema
      Swal.fire('Error', 'Hubo un problema al modificar el precio', 'error');
    }
  };

  return (
    <button onClick={handleModificarPrecio}>Modificar Precio</button>
  );
};

export default ModificarPrecio;
