import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/cliente';
import { doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const ModificarImagenProducto = ({ productoId }) => {
  const [nuevaImagen, setNuevaImagen] = useState(null);

  const handleImagenChange = (e) => {
    setNuevaImagen(e.target.files[0]);
  };

  const actualizarImagen = async () => {
    try {
      const storageRef = ref(storage, `images/${nuevaImagen.name}`);
      await uploadBytes(storageRef, nuevaImagen);
      const nuevaUrl = await getDownloadURL(storageRef);
      const productoRef = doc(db, 'productos', productoId);
      await updateDoc(productoRef, { img: nuevaUrl });
      Swal.fire({
        icon: 'success',
        title: '¡Imagen actualizada!',
        text: 'La imagen se ha actualizado correctamente.',
      });
    } catch (error) {
      console.error('Error al actualizar la imagen:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar la imagen. Por favor, inténtalo de nuevo más tarde.',
      });
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImagenChange} />
      <button onClick={actualizarImagen}>Actualizar Imagen</button>
    </div>
  );
};

export default ModificarImagenProducto;
