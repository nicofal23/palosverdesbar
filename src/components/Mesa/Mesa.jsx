import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/cliente'; // Importa la referencia a la base de datos desde tu archivo cliente.js

const Mesa = () => {
  const [numeroMesa, setNumeroMesa] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [mercaderia, setMercaderia] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Función para cargar la mercadería desde Firebase
    const cargarMercaderia = async () => {
      try {
        const mercaderiaData = []; // Aquí almacenaremos los datos de la mercadería
        const querySnapshot = await db.collection('mercaderia').get(); // Consulta la colección 'mercaderia' en Firestore
        querySnapshot.forEach(doc => {
          mercaderiaData.push(doc.data()); // Agrega los datos del documento a la lista de mercadería
        });
        setMercaderia(mercaderiaData); // Actualiza el estado con la mercadería cargada desde Firebase
      } catch (error) {
        console.error('Error al cargar la mercadería:', error);
      }
    };

    cargarMercaderia();
  }, []);

  // Función para calcular el total
  const calcularTotal = () => {
    // Implementa la lógica para calcular el total
    let totalCalculado = 0;
    mercaderia.forEach(item => {
      totalCalculado += item.precio;
    });
    setTotal(totalCalculado);
  };

  // Función para cerrar la mesa
  const cerrarMesa = () => {
    // Implementa la lógica para cerrar la mesa y guardar la información en Firebase
    const mesaData = {
      numeroMesa,
      nombreCliente,
      mercaderia,
      total,
      fecha: new Date().toISOString()
    };

    db.collection('mesas').add(mesaData)
      .then(() => {
        console.log('Mesa cerrada y guardada en Firebase');
        // Limpiar el estado para una nueva mesa
        setNumeroMesa('');
        setNombreCliente('');
        setMercaderia([]);
        setTotal(0);
      })
      .catch(error => {
        console.error('Error al cerrar la mesa y guardar en Firebase:', error);
      });
  };

  // Función para cerrar el día
  const cerrarDia = () => {
    // Implementa la lógica para cerrar el día y guardar toda la información en Firebase
    const diaData = {
      // Datos del día (por ejemplo, todas las mesas cerradas en ese día)
    };

    const fechaActual = new Date().toISOString().split('T')[0]; // Obtener la fecha actual en formato YYYY-MM-DD

    db.collection('dias').doc(fechaActual).set(diaData)
      .then(() => {
        console.log('Día cerrado y guardado en Firebase');
        // Puedes realizar otras operaciones necesarias después de cerrar el día
      })
      .catch(error => {
        console.error('Error al cerrar el día y guardar en Firebase:', error);
      });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Número de mesa"
        value={numeroMesa}
        onChange={e => setNumeroMesa(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nombre del cliente"
        value={nombreCliente}
        onChange={e => setNombreCliente(e.target.value)}
      />
      {/* Aquí puedes mostrar la lista de mercadería y permitir al usuario agregar productos */}
      {/* Muestra el total calculado */}
      <div>Total: ${total}</div>
      <button onClick={calcularTotal}>Calcular Total</button>
      <button onClick={cerrarMesa}>Cerrar Mesa</button>
      <button onClick={cerrarDia}>Cerrar Día</button>
    </div>
  );
};

export default Mesa;
