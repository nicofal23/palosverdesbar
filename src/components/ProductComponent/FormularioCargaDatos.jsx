import React, { useState } from 'react';
import { db } from '../../firebase/cliente';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import style from './FormularioCargaDatos.module.css'; 
import { storage } from '../../firebase/cliente'; 

const FormularioCargaDatos = () => {
  const [category, setCategory] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [img, setImg] = useState(null); 
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [tags, setTags] = useState([]); // Cambiado a un array para almacenar múltiples tags seleccionados
  const [loading, setLoading] = useState(false);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  const handleTagChange = (e) => {
    const { value } = e.target;
    // Verificar si el tag ya está seleccionado
    const alreadySelected = tags.includes(value);
    if (alreadySelected) {
      // Si está seleccionado, eliminarlo de la lista de tags
      setTags(tags.filter(tag => tag !== value));
    } else {
      // Si no está seleccionado, agregarlo a la lista de tags
      setTags([...tags, value]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (img) {
        const storageRef = ref(storage, 'images/' + img.name);
        await uploadBytes(storageRef, img);
        const imgUrl = await getDownloadURL(storageRef);
        const docRef = await addDoc(collection(db, 'productos'), {
          category,
          descripcion,
          img: imgUrl,
          nombre,
          precio,
          tags // Almacenar los tags en la base de datos
        });
        console.log('Document written with ID: ', docRef.id);
        setCategory('');
        setDescripcion('');
        setImg(null);
        setNombre('');
        setPrecio('');
        setTags([]);
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
      <div>
        <p>Tags:</p>
        {/* Renderizar las cajas de opción para los tags */}
        <label>
          <input type="checkbox" value="entrada" checked={tags.includes('entrada')} onChange={handleTagChange} />
           Entrada
        </label>
        <label>
          <input type="checkbox" value="carnes" checked={tags.includes('carnes')} onChange={handleTagChange} />
           Carnes
        </label>
        <label>
          <input type="checkbox" value="ensalada" checked={tags.includes('ensalada')} onChange={handleTagChange} />
           Ensalada
        </label>
        <label>
          <input type="checkbox" value="pastas" checked={tags.includes('pastas')} onChange={handleTagChange} />
           Pastas
        </label>
        <label>
          <input type="checkbox" value="woks" checked={tags.includes('woks')} onChange={handleTagChange} />
           Woks
        </label>
        <label>
          <input type="checkbox" value="sandwich" checked={tags.includes('sandwich')} onChange={handleTagChange} />
           Sándwiches
        </label>
        <label>
          <input type="checkbox" value="postres" checked={tags.includes('postres')} onChange={handleTagChange} />
           Postres
        </label>
        <label>
          <input type="checkbox" value="cafeteria" checked={tags.includes('cafeteria')} onChange={handleTagChange} />
           cafetria
        </label>
        <label>
          <input type="checkbox" value="gaseosa" checked={tags.includes('gaseosa')} onChange={handleTagChange} />
           Gaseosa
        </label>
        <label>
          <input type="checkbox" value="jugos" checked={tags.includes('jugos')} onChange={handleTagChange} />
           Jugos y Licuados
        </label>
        <label>
          <input type="checkbox" value="limonada" checked={tags.includes('limonada')} onChange={handleTagChange} />
           Limonadas
        </label>
        <label>
          <input type="checkbox" value="cerveza" checked={tags.includes('cerveza')} onChange={handleTagChange} />
           Cerveza
        </label>
        {/* Agregar el resto de las opciones de tags aquí */}
      </div>
      <button type="submit" disabled={loading}>Guardar</button>
    </form>
  );
};

export default FormularioCargaDatos;
