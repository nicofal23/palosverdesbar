import React, { useState, useEffect } from "react";
import { db, storage } from '../../firebase/cliente'; // Asegúrate de importar storage desde Firebase
import { doc, getDocs, getDoc, updateDoc, deleteDoc, addDoc, collection } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import styles from '../ModificarProductos/ModificarProductos.module.css';
import SelectCategory from '../SelectProduct/SelectProduct';
import { ref } from 'firebase/storage'; // Importa ref desde firebase/storage

const ModificarProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [nombresProductos, setNombresProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                let productosQuery = collection(db, "productos");

                // Si hay una categoría seleccionada, agregar filtro por categoría a la consulta
                if (categoriaSeleccionada) {
                    productosQuery = query(productosQuery, where("category", "==", categoriaSeleccionada));
                }

                const productosSnapshot = await getDocs(productosQuery);
                const productosData = productosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                console.log("Productos obtenidos:", productosData); // Agregar este console.log para depurar
                setProductos(productosData);

                // Guardar los nombres de los productos en localStorage
                const nombres = productosData.map(producto => producto.nombre);
                localStorage.setItem('nombresProductos', JSON.stringify(nombres));
                setNombresProductos(nombres);
            } catch (error) {
                console.error("Error obteniendo productos:", error);
            }
        };
        fetchProductos();
    }, [categoriaSeleccionada]);

    // Función para manejar el cambio de término de búsqueda
    const handleSearch = (term) => {
        setSearchTerm(term);
    }

    // Función para filtrar productos por nombre
    const filtrarProductos = () => {
        if (!searchTerm) {
            return productos;
        }
        return productos.filter(producto =>
            producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Función para actualizar el stock del producto en Firebase
    const actualizarStock = async (id, nuevoStock) => {
        try {
            const productoRef = doc(db, "productos", id);
            await updateDoc(productoRef, { stock: nuevoStock });
            console.log("Stock actualizado exitosamente.");
        } catch (error) {
            console.error("Error al actualizar el stock:", error);
        }
    }

    // Función para modificar el stock del producto en Firebase
    const modificarStock = async (id, nuevoStock) => {
        try {
            const productoRef = doc(db, "productos", id);
            const productoSnapshot = await getDoc(productoRef); // Cambiar getDocs() por getDoc()
            if (!productoSnapshot.exists()) {
                // Si el producto no existe, agregarlo con el nuevo stock
                await addDoc(collection(db, "productos"), { stock: nuevoStock });
            } else {
                // Si el producto existe, actualizar su stock
                await actualizarStock(id, nuevoStock);
            }
            console.log("Stock modificado exitosamente.");
        } catch (error) {
            console.error("Error al modificar el stock:", error);
        }
    }
    

    // Función para eliminar un producto de Firebase y su imagen del storage
    const eliminarProducto = async (id, imagenURL) => {
        try {
            // Parsear la URL de la imagen para obtener el nombre del archivo
            const nombreArchivo = imagenURL.split('%2F').pop().split('?')[0];
            
            // Crear una referencia al objeto de almacenamiento basado en el nombre del archivo
            const imagenRef = ref(storage, `productos/${nombreArchivo}`);
            
            // Eliminar el objeto de almacenamiento
            await storage.deleteObject(imagenRef);

            // Eliminar el producto de la base de datos
            const productoRef = doc(db, "productos", id);
            await deleteDoc(productoRef);

            console.log("Producto eliminado exitosamente.");
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }

    return (
        <div className={styles.container}>
            <h2>Lista de Productos</h2>
            <div className={styles.filtro}>
                <SelectCategory value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)} />
                <div>
                    <label htmlFor="search">Buscar por nombre: </label>
                    <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>
            </div>
            <ul className={styles.productList}>
                {filtrarProductos().map(producto => (
                    <li key={producto.id} className={styles.productItem}>
                        <div className={styles.productInfo}>
                            <div className={styles.productDescription}>
                                <h2 className={styles.productName}>
                                    {producto.nombre}
                                </h2>
                                <p className={styles.productDescription}>
                                    {producto.descripcion}
                                </p>
                            </div>
                            <section className={styles.productDetails}>
                                <p className={styles.productPrice}>
                                    ${producto.precio}
                                </p>
                                <p className={styles.productStock}>
                                    Stock: {producto.stock}
                                    {/* Input para modificar stock */}
                                    <input
                                        type="number"
                                        value={producto.stock}
                                        onChange={(e) => {
                                            const nuevoStock = parseInt(e.target.value);
                                            if (!isNaN(nuevoStock)) {
                                                actualizarStock(producto.id, nuevoStock);
                                            }
                                        }}
                                    />
                                    {/* Botón para modificar stock */}
                                    <button onClick={() => modificarStock(producto.id, producto.stock)}>Modificar</button>
                                </p>
                            </section>
                            {/* Botón para eliminar producto */}
                            <button onClick={() => eliminarProducto(producto.id, producto.img)}>Eliminar Producto</button>
                        </div>
                        <div className={styles.productImage}>
                            <picture>
                                <img src={producto.img} alt={producto.nombre} className={styles.productImg} />
                            </picture>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ModificarProductos;
