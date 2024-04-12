import { Route, Routes, BrowserRouter } from "react-router-dom";
import ItemListContainer from "../components/ItemListCointainer/ItemListContainer";
import ItemDetailContainer from "../components/ItemDetailContainer/ItemDetailContainer";
import NavBar from "../components/NavBar/NavBar";
import { CartProvider } from "../context/CartContext";
import Cart from "../components/Cart/Cart";
import Order from "../components/Order/Order.jsx";
import FormularioCargaDatos from "../components/ProductComponent/FormularioCargaDatos.jsx"

const RouterPrincipal = () => {
  return (
    <BrowserRouter>
      <CartProvider>
          <Routes>
            <Route path="/" element={<ItemListContainer />} />
            <Route path="/category/:categoryId" element={<ItemListContainer />}></Route>
            <Route path="/item/:itemId" element={<ItemDetailContainer />} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/checkout" element={<Order/>} />
          </Routes>
        </CartProvider>
            <Route path="/admin" element={<FormularioCargaDatos/>}/>
    </BrowserRouter> 
  );
};

export default RouterPrincipal;
