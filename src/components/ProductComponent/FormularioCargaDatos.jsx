import React, { useState } from 'react';
import { db } from '../../firebase/cliente';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import style from './FormularioCargaDatos.module.css';
import { storage } from '../../firebase/cliente';
import Swal from 'sweetalert2'; // Importar SweetAlert

const FormularioCargaDatos = () => {
  const [category, setCategory] = useState('');
  const [subnombre, setSubnombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [img, setImg] = useState(null);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState(0);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
  };

  const handleTagChange = (e) => {
    const { value } = e.target;
    const alreadySelected = tags.includes(value);
    if (alreadySelected) {
      setTags(tags.filter(tag => tag !== value));
    } else {
      setTags([...tags, value]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imgUrl = '';

      if (!img) {
        const defaultImgUrl = 'https://firebasestorage.googleapis.com/v0/b/palosverdes-a3ee3.appspot.com/o/images%2Fpalos.png?alt=media&token=6cd016f1-d972-4356-b023-5797bd9a7235';
        imgUrl = defaultImgUrl;
      } else {
        const storageRef = ref(storage, 'images/' + img.name);
        await uploadBytes(storageRef, img);
        imgUrl = await getDownloadURL(storageRef);
      }

      const docRef = await addDoc(collection(db, 'productos'), {
        category,
        subnombre,
        descripcion,
        img: imgUrl,
        nombre,
        precio,
        stock,
        tags
      });

      console.log('Document written with ID: ', docRef.id);

      // Mostrar SweetAlert de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        text: 'El producto se ha agregado correctamente.',
      }).then(() => {
        // Restablecer los estados después de agregar el producto
        setCategory('');
        setSubnombre('');
        setDescripcion('');
        setImg(null);
        setNombre('');
        setPrecio('');
        setTags([]);
        setStock(0);
      });
    } catch (error) {
      console.error('Error adding document: ', error);

      // Mostrar SweetAlert de error
      Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Hubo un problema al agregar el producto. Por favor, intenta nuevamente más tarde.',
      });
    } finally {
      setLoading(false);
    }
  };

  const subnombreOptions = {
    restaurant: ['entrada', 'ensalada', 'pastas', 'carnes', 'woks', 'sándwich', 'postres', 'bebidas sin alcohol', 'bebidas con alcohol'],
    cafeteria: ['desayuno y merienda', 'tortas', 'cafetería clásica'],
    vinos: ['champagne', 'vinos'],
    cocktails: ['aperitivos', 'campari', 'gin', 'otros'],
    kiosko:['chicle','bebida','limpieza','cocina','mate']
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
          <option value="kiosko">Kiosko</option>
        </select>
      </label>
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
