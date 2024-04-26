import React, { useState } from 'react';
import { db } from '../../firebase/cliente';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import style from './FormularioCargaDatos.module.css'; 
import { storage } from '../../firebase/cliente'; 

const FormularioCargaDatos = () => {
  const [category, setCategory] = useState('');
  const [subnombre, setSubnombre] = useState(''); // Estado para el subnombre
  const [descripcion, setDescripcion] = useState('');
  const [img, setImg] = useState(null); 
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [tags, setTags] = useState([]); // Cambiado a un array para almacenar múltiples tags seleccionados
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState(0); // Estado para el stock

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
          subnombre, // Agregar el subnombre a la base de datos
          descripcion,
          img: imgUrl,
          nombre,
          precio,
          stock, // Agregar el stock a la base de datos
          tags // Almacenar los tags en la base de datos
        });
        console.log('Document written with ID: ', docRef.id);
        setCategory('');
        setSubnombre('');
        setDescripcion('');
        setImg(null);
        setNombre('');
        setPrecio('');
        setTags([]);
        setStock(0); // Restablecer el stock después de agregar el producto
      } else {
        console.error('Error: No se seleccionó ningún archivo de imagen.');
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Opciones de subnombre según la categoría seleccionada
  const subnombreOptions = {
    restaurant: ['entrada', 'ensalada', 'pastas', 'carnes', 'woks', 'sándwich', 'postres', 'bebidas sin alcohol', 'bebidas con alcohol'],
    cafeteria: ['desayuno y merienda', 'tortas', 'cafetería clásica'],
    vinos: ['champagne', 'vinos'],
    cocktails: ['aperitivos', 'campari', 'gin', 'otros']
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
      {/* Agregar el select para subnombre */}
      {category && (
        <label>
          Subnombre:
          <select value={subnombre} onChange={(e) => setSubnombre(e.target.value)}>
            <option value="">Selecciona un subnombre</option>
            {subnombreOptions[category].map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      )}
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
        {/* Código de los tags... */}
      </div>
      <div className={style.stock}>
        <p>Stock:</p>
        <label>
          Sí
          <input
            type="radio"
            value="1"
            checked={stock === 1}
            onChange={() => setStock(1)}
          />
        </label>
        <label>
          No
          <input
            type="radio"
            value="0"
            checked={stock === 0}
            onChange={() => setStock(0)}
          />
        </label>
      </div>
      <button type="submit" disabled={loading}>Guardar</button>
    </form>
  );
};
 
export default FormularioCargaDatos;
