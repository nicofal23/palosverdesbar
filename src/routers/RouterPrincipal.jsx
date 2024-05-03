// RouterPrincipal.jsx
import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import ItemListContainer from "../components/ItemListCointainer/ItemListContainer";
import { CartProvider } from "../context/CartContext";
import Prueba from "../components/Inicio/Inicio.jsx";
import Mesa from "../components/Mesa/Mesa.jsx";
import FormularioCargaDatos from "../components/ProductComponent/FormularioCargaDatos.jsx";
import ModificarProductos from "../components/ModificarProductos/ModificarProduct.jsx";
import MesaList from "../components/Mesa/MesaList.jsx";
import MesaDetail from "../components/MesaDetail/MesaDetail.jsx"; 
import Modal from "../components/Modal/Modal.jsx";
import MesaAbrir from "../components/Mesa/MesaAbrir.jsx";
import ItemDetail from "../components/ItemDetail/ItemDetail.jsx";

const RouterPrincipal = () => {
  return (
    <BrowserRouter>
      <CartProvider>
          <Routes>
            <Route path="/" element={<ItemListContainer/>} />
            <Route path="/admin" element={<Prueba />} />
            <Route path="/carta" element={<ItemListContainer/>} />
            <Route path="/:categoryId" element={<ItemListContainer />} />
            <Route path="/administrar-mesas" element={<Mesa />}/>
            <Route path="/mesas-abiertas" element={<MesaList/>}/>
            <Route path="/abrir-mesa" element={<MesaAbrir/>}/>
            <Route path="/mesa/:id" element={<MesaDetail />} /> {/* Nueva ruta para la página de detalles de la mesa */}
            <Route path="/73K9pQzX5E" element={<FormularioCargaDatos/>}/>
            <Route path="/R4s8W2nY6P" element={<ModificarProductos/>}/>
            <Route path="/item/:id" element={<ItemDetail/>}/> {/* Definir la ruta para ItemDetail */}
          </Routes>
        </CartProvider>
    </BrowserRouter> 
  );
};

export default RouterPrincipal;
