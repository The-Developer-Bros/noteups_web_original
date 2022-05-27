import * as Sentry from "@sentry/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import NotFoundPage from "./pages/404/NotFoundPage";
import ChangePassword from "./pages/auth/changepassword/ChangePassword";
import EmailVerified from "./pages/auth/emailverified/EmailVerified";
import ForgotPassword from "./pages/auth/forgotpassword/ForgotPassword";
import SendEmail from "./pages/auth/sendemail/SendEmail";
import Signin from "./pages/auth/signin/Signin";
import Signup from "./pages/auth/signup/Signup";
import HomePage from "./pages/home/HomePage";
import AboutPage from "./pages/info/about/AboutPage";
import ContactPage from "./pages/info/contact/ContactPage";
import ContributePage from "./pages/info/contribute/ContributePage";
import FAQPage from "./pages/info/faq/FAQPage";
import PricingPage from "./pages/info/pricing/PricingPage";
import ProductCategoriesPage from "./pages/product/categories/ProductCategoriesPage";
import ProductDetailPage from "./pages/product/details/ProductDetailPage";
import ProductListingPage from "./pages/product/listing/ProductListingPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Header />

      <div className="App">
        <Routes>
          {/* Info Routes */}
          <Route path="about" element={<AboutPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contribute" element={<ContributePage />} />

          {/* Product Routes */}
          <Route path="products" element={<ProductCategoriesPage />} />
          <Route path="products/:domain" element={<ProductListingPage />} />
          <Route
            path="products/:domain/:subdomain"
            element={<ProductListingPage />}
          />
          <Route
            path="products/:domain/:subdomain/:subject"
            element={<ProductDetailPage />}
          />

          {/* Auth Routes */}
          <Route
            path="/"
            element={token ? <HomePage /> : <Navigate to="/signin" />}
          />

          <Route path="/send-verify-mail" element={<SendEmail />} />
          <Route path="/email-verify/:token" element={<EmailVerified />} />

          <Route
            path="/signin"
            element={!token ? <Signin /> : <Navigate to="/" />}
          />

          <Route
            path="/signup"
            element={!token ? <Signup /> : <Navigate to="/" />}
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/forgot-password-verify/:token"
            element={<ChangePassword />}
          />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* <Footer /> */}
    </BrowserRouter>
  );
}

export default Sentry.withProfiler(App);
