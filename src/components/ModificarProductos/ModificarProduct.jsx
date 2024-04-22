import React, { useState, useEffect } from "react";
import { db } from '../../firebase/cliente';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import styles from '../ModificarProductos/ModificarProductos.module.css';
import SelectCategory from '../SelectProduct/SelectProduct';

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
                                </p>
                            </section>
                            {/* Aquí puedes agregar botones u otras acciones */}
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
