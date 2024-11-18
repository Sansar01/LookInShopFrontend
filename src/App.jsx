import { Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLayout from "./components/AdminView/AdminLayout";
import Dashboard from "./pages/adminView/Dashboard";
import Features from "./pages/adminView/Features";
import Orders from "./pages/adminView/Orders";
import Products from "./pages/adminView/Products";
import ShoppingLayout from "./components/Shopping-View/ShoppingLayout";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/Shopping-View/Home";
import Account from "./pages/Shopping-View/Account";
import Listing from "./pages/Shopping-View/Listing";
import Checkout from "./pages/Shopping-View/Checkout";
import CheckAuth from "./components/common/CheckAuth";
import UnAuth from "./pages/UnAuth/UnAuth";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect } from "react";
import { checkAuthentication } from "./store/auth-Slice";
import Paypalreturn from "./pages/Shopping-View/Paypalreturn";
import PaymentSuccess from "./pages/Shopping-View/PaymentSuccess";
import Search from "./pages/Shopping-View/Search";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthentication());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* Common Component */}

      <Routes>
      <Route
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
/>
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="features" element={<Features />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="account" element={<Account />} />
          <Route path="listing" element={<Listing />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="paypal-return" element={<Paypalreturn />} />
          <Route path="/shop/payment-success" element={<PaymentSuccess />} />
          <Route path='/shop/search' element={<Search/>}/>
        </Route>
        <Route path="/unauth-page" element={<UnAuth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
