import React, { useState } from 'react';
import { db } from '../../firebase/cliente';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import style from './FormularioCargaDatos.module.css'; // Estilos CSS para el formulario
import { storage } from '../../firebase/cliente'; // Ajusta la ruta según la ubicación de tu archivo de configuración


const FormularioCargaDatos = () => {
  const [category, setCategory] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [img, setImg] = useState(null); // Cambiado a null para representar el archivo de imagen seleccionado
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImgChange = (e) => {
    // Obtener el archivo de imagen seleccionado
    const file = e.target.files[0];
    setImg(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (img) {
        // Subir la imagen al storage
        const storageRef = ref(storage, 'images/' + img.name);
        await uploadBytes(storageRef, img);
  
        // Obtener la URL de la imagen subida
        const imgUrl = await getDownloadURL(storageRef);
  
        // Guardar los datos en la base de datos
        const docRef = await addDoc(collection(db, 'productos'), {
          category,
          descripcion,
          img: imgUrl,
          nombre,
          precio,
          tag
        });
        console.log('Document written with ID: ', docRef.id);
        // Limpiar los campos después de enviar los datos
        setCategory('');
        setDescripcion('');
        setImg(null);
        setNombre('');
        setPrecio('');
        setTag('');
      } else {
        console.error('Error: No se seleccionó ningún archivo de imagen.');
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <label>
        Categoría:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Selecciona una categoría</option>
          <option value="restaurant">Restaurant</option>
          <option value="cocktails">Cocktails</option>
          <option value="cafeteria">Cafetería</option>
          <option value="vinos">Vinos</option>
        </select>
      </label>
      <label>
        Descripción:
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
      </label>
      <label>
        Cargar imagen:
        <input type="file" accept="image/*" onChange={handleImgChange} />
      </label>
      <label>
        Nombre:
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </label>
      <label>
        Precio:
        <input type="text" value={precio} onChange={(e) => setPrecio(e.target.value)} />
      </label>
      <label>
        Tag:
        <select value={tag} onChange={(e) => setTag(e.target.value)}>
          <option value="">Selecciona un tag</option>
          <option value="entrada">Entrada</option>
          <option value="ensalada">Ensalada</option>
          <option value="carnes">Carnes</option>
          <option value="pastas">Pastas</option>
          <option value="woks">Woks</option>
          <option value="sandwich">Sandwich</option>
          <option value="sin_tacc">Sin TACC</option>
          <option value="veggi">Veggi</option>
          <option value="vegetariano">Vegetariano</option>
        </select>
      </label>
      <button type="submit" disabled={loading}>Guardar</button>
    </form>
  );
};

export default FormularioCargaDatos;
