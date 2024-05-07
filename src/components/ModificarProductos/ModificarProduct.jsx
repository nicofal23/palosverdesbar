import React, { useState, useEffect } from "react";
import { db, storage, ref, deleteObject, uploadBytes, getDownloadURL } from '../../firebase/cliente'; // Asegúrate de importar storage desde Firebase
import { doc, getDocs, getDoc, updateDoc, deleteDoc, addDoc, collection, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import styles from '../ModificarProductos/ModificarProductos.module.css';
import SelectCategory from '../SelectProduct/SelectProduct';
import Swal from 'sweetalert2';
import ModificarPrecio from "../ModificarPrecio/ModificarPrecio";

const ModificarProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [nombresProductos, setNombresProductos] = useState([]);
    const [nuevaImagen, setNuevaImagen] = useState(null);
    const [productoModificando, setProductoModificando] = useState(null);

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
    }, [categoriaSeleccionada, nuevaImagen]);

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

    // Función para actualizar el stock del producto en Firebase y en el estado local
    const actualizarStock = async (id, nuevoStock) => {
        try {
            const productoRef = doc(db, "productos", id);
            await updateDoc(productoRef, { stock: nuevoStock });
            // Actualizar el estado local de los productos
            setProductos(prevProductos => {
                return prevProductos.map(producto => {
                    if (producto.id === id) {
                        return { ...producto, stock: nuevoStock };
                    } else {
                        return producto;
                    }
                });
            });
            console.log("Stock actualizado exitosamente.");
        } catch (error) {
            console.error("Error al actualizar el stock:", error);
        }
    }

    // Función para cambiar la imagen del producto
    const cambiarImagenProducto = async (id, nuevaImagen) => {
        try {
            const storageRef = ref(storage, `productos/${id}/${nuevaImagen.name}`);
            await uploadBytes(storageRef, nuevaImagen);
            const imageUrl = await getDownloadURL(storageRef);
            const productoRef = doc(db, "productos", id);
            await updateDoc(productoRef, { img: imageUrl });
            console.log("Imagen del producto actualizada exitosamente.");
            // Actualizar el estado local de los productos con la nueva URL de la imagen
        setProductos(prevProductos => {
            return prevProductos.map(producto => {
                if (producto.id === id) {
                    return { ...producto, img: imageUrl };
                } else {
                    return producto;
                }
            });
        });

        setNuevaImagen(null); // Limpiar nuevaImagen después de la carga exitosa
        setProductoModificando(null); // Limpiar productoModificando después de la carga exitosa
    } catch (error) {
        console.error("Error al cambiar la imagen del producto:", error);
    }
}


    // Función para confirmar la modificación y recargar la página
    const confirmarModificacion = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Una vez confirmada la modificación, se actualizará la imagen del producto.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar'
        }).then((result) => {
            if (result.isConfirmed) {
                cambiarImagenProducto(id, nuevaImagen);
            }
        });
    }

    // Función para establecer el producto que se está modificando
    const setProductoParaModificar = (id) => {
        setProductoModificando(id);
    }

    // Función para eliminar un producto de la base de datos y de la interfaz
    const eliminarProducto = async (id) => {
        try {
            // Tu código para eliminar un producto
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            // Mostrar mensaje de error
            Swal.fire(
                'Error',
                'Hubo un problema al eliminar el producto.',
                'error'
            );
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.titulo}>
                <h2>Lista de Productos</h2>
            </div>
            <div className={styles.filtro}>
                <SelectCategory value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)} />
                <div className={styles.inputt}>
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
                                <div>
                                    <p className={styles.productPrice}>
                                        ${producto.precio}
                                    </p>
                                    {/* Renderizar el componente ModificarPrecio aquí */}
                                    <ModificarPrecio producto={producto} updateLocalState={setProductos} />
                                </div>
                                <div className={styles.stockOptions}>
                                    <p>Stock:</p>
                                    <div className={styles.stockBoxes}>
                                        <div className={`${styles.stockBox} ${producto.stock > 0 ? styles.available : styles.unavailable}`}>
                                            Si
                                            <input
                                                type="radio"
                                                value="1"
                                                checked={producto.stock > 0}
                                                onChange={() => {
                                                    if (producto.stock === 0) {
                                                        actualizarStock(producto.id, 1);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className={`${styles.stockBox} ${producto.stock === 0 ? styles.available : styles.unavailable}`}>
                                            No
                                            <input
                                                type="radio"
                                                value="0"
                                                checked={producto.stock === 0}
                                                onChange={() => {
                                                    if (producto.stock > 0) {
                                                        actualizarStock(producto.id, 0);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Botón para cambiar imagen */}
                                <input type="file" onChange={(e) => {
                                    setNuevaImagen(e.target.files[0]);
                                    setProductoParaModificar(producto.id);
                                }} />
                            </section>
                            {/* Botón para eliminar producto */}
                            <button onClick={() => eliminarProducto(producto.id, producto.img)}>Eliminar Producto</button>
                            {/* Botón para confirmar la modificación */}
                            {productoModificando === producto.id && nuevaImagen && (
                                <button onClick={() => confirmarModificacion(producto.id)}>Confirmar Modificación</button>
                            )}
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
