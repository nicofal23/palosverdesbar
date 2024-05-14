# Palos verdes - Aplicación Web para Restaurantes

palos verdes es una aplicación web diseñada para facilitar las tareas de gestión de restaurantes, proporcionando tanto una interfaz para los usuarios finales para ver el menú, como un panel de administración para gestionar productos, mesas y pedidos.

## Interfaz de Usuario

La interfaz de usuario de Palosverdes es sencilla e intuitiva. Los usuarios pueden navegar por el menú del restaurante, seleccionar los artículos que desean pedir y ver información detallada sobre cada artículo. Al seleccionar un producto, pueden ver su descripción, precio y cualquier opción adicional disponible.

![Menú]()

## Panel de Administración

Acceder al panel de administración es fácil, simplemente agregue `/admin` a la URL e ingrese usuario y contraseña. Aquí, los administradores tienen acceso a tres funcionalidades principales:

1. **Agregar Productos**: Los administradores pueden agregar fácilmente nuevos productos al menú. Pueden especificar el nombre del producto, la descripción, el precio y cargar una imagen para mostrar el artículo, en caso de no cargar ninguna imagen , se agrega el logo por defecto.

   ![Agregar Productos](add_products_screenshot.png)

2. **Gestionar Mesas**: En esta sección, los administradores pueden manejar tareas de gestión de mesas. Pueden abrir nuevas mesas, gestionar mesas actualmente abiertas añadiendo o eliminando productos según lo solicitado por los clientes, y ver mesas cerradas donde pueden descargar la remito en formato PDF.

   ![Gestionar Mesas](manage_tables_screenshot.png)

3. **Modificar Productos**: Aquí, los administradores pueden modificar productos existentes. Pueden ajustar precios, actualizar descripciones, eliminar productos o cambiar imágenes de productos.

   ![Modificar Productos](modify_products_screenshot.png)

## Tecnologías Utilizadas

Moniessen está construido utilizando las siguientes tecnologías:

- **React**: Una biblioteca de JavaScript para construir interfaces de usuario.
- **React Router**: Utilizado para el enrutamiento dentro de la aplicación.
- **Material-UI**: Proporciona componentes para construir la interfaz de usuario.
- **Bootstrap**: Utilizado para estilizar componentes.
- **Firebase**: Proporciona servicios backend como autenticación y gestión de bases de datos.
- **JSPDF**: Permite la generación de documentos PDF.
- **SweetAlert2**: Para mostrar cuadros de diálogo modales.
- **dotenv**: Para gestionar variables de entorno.
- **lodash**: Una biblioteca de utilidades para simplificar tareas de programación.
- **Vite**: Una herramienta de frontend de próxima generación.

## Instalación y Uso

Para ejecutar la aplicación web Moniessen localmente, siga estos pasos:

1. Clona este repositorio.
2. Navega al directorio del proyecto.
3. Ejecuta `npm install` para instalar las dependencias.
4. Ejecuta `npm run dev` para iniciar el servidor de desarrollo.
5. Abre tu navegador y ve a `http://localhost:3000` para ver la aplicación.

## Licencia

Este proyecto pertenece a Nicolás Falciglio.
