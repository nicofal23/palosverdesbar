import { Route, Routes, BrowserRouter } from "react-router-dom";
import ItemListContainer from "../components/ItemListCointainer/ItemListContainer";
import ItemDetailContainer from "../components/ItemDetailContainer/ItemDetailContainer";
import { CartProvider } from "../context/CartContext";

import Prueba from "../components/Inicio/Inicio.jsx";
import Mesa from "../components/Mesa/Mesa.jsx";
import FormularioCargaDatos from "../components/ProductComponent/FormularioCargaDatos.jsx";
import ModificarProductos from "../components/ModificarProductos/ModificarProduct.jsx";

const RouterPrincipal = () => {
  return (
    <BrowserRouter>
      <CartProvider>
          <Routes>
            <Route path="/" element={<ItemListContainer/>} />
            <Route path="/admin" element={<Prueba />} />
            <Route path="/carta" element={<ItemDetailContainer />} />
            <Route path="/mesa" element={<Mesa />}/>
            <Route path="/73K9pQzX5E" element={<FormularioCargaDatos/>}/>
            <Route path="/R4s8W2nY6P" element={<ModificarProductos/>}/>
          </Routes>
        </CartProvider>
    </BrowserRouter> 
  );
};

export default RouterPrincipal;
