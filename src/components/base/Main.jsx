import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";

const Dashboard = lazy(() => import("../UserTransactions/Dashboard"));
const SellerProducts = lazy(() => import("../UserTransactions/SellerProducts"));
const CustomerProducts = lazy(() => import("../UserTransactions/CustomerProducts"));
const Cart = lazy(() => import("../UserTransactions/Cart"));
const PendingForDeliveryProducts = lazy(() => import("../UserTransactions/PendForDevileryProducts"));
const DeliveredProducts = lazy(() => import("../UserTransactions/DeliveredProducts"));
const MySales = lazy(() => import("../UserTransactions/MySales"));
const MyOrder = lazy(() => import("../UserTransactions/MyOrder"));

export default function Main() {
  return (
    <Container bsPrefix="main">
      <Routes>
        <Route exact path="/" element={
          <Suspense
            fallback={
              <div className="spinner-box">
                <Spinner animation="border" className="spinner"></Spinner>
              </div>}>
            {sessionStorage.getItem('user_role') == "Seller" ? <SellerProducts /> : <CustomerProducts />}
          </Suspense>}></Route>
        <Route exact path="/myNotes" element={
          <Suspense
            fallback={
              <div className="spinner-box">
                <Spinner animation="border" className="spinner"></Spinner>
              </div>}>
            <Dashboard />
          </Suspense>}></Route>
        <Route exact path="/cart" element={
          <Suspense
            fallback={
              <div className="spinner-box">
                <Spinner animation="border" className="spinner"></Spinner>
              </div>}>
            <Cart />
          </Suspense>}></Route>
        <Route exact path="/pendingForDeliveryProducts" element={
          <Suspense
            fallback={
              <div className="spinner-box">
                <Spinner animation="border" className="spinner"></Spinner>
              </div>}>
            <PendingForDeliveryProducts />
          </Suspense>}></Route>
        <Route exact path="/deliveredProducts" element={
          <Suspense
            fallback={
              <div className="spinner-box">
                <Spinner animation="border" className="spinner"></Spinner>
              </div>}>
            <DeliveredProducts />
          </Suspense>}></Route>
        <Route exact path="/mySales" element={
          <Suspense
            fallback={
              <div className="spinner-box">
                <Spinner animation="border" className="spinner"></Spinner>
              </div>}>
            <MySales />
          </Suspense>}></Route>
        <Route exact path="/myOrder" element={
          <Suspense
            fallback={
              <div className="spinner-box">
                <Spinner animation="border" className="spinner"></Spinner>
              </div>}>
            <MyOrder />
          </Suspense>}></Route>
      </Routes>
    </Container>
  );
}
