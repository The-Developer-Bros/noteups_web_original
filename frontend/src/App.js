import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import AboutPage from './pages/AboutPage/AboutPage';
import ContributePage from './pages/ContributePage/ContributePage';
import HomePage from './pages/HomePage/HomePage';
// import LoginPage from './pages/LoginPage/LoginPage';
// import SignupPage from './pages/SignupPage/SignupPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
// import ContactPage from './pages/ContactPage/ContactPage';
import PricingPage from './pages/PricingPage/PricingPage';
import ProductCategoriesPage from './pages/ProductCategoriesPage/ProductCategoriesPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import ProductListingPage from './pages/ProductListingPage/ProductListingPage';


function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="pricing" element={<PricingPage />} />
        {/* <Route path="/contact" element={<ContactPage />} /> */}
        <Route path="contribute" element={<ContributePage />} />

        <Route path="products" element={<ProductCategoriesPage />} />
        <Route path="products/:domain" element={<ProductCategoriesPage />} />
        <Route path="products/:domain/:subdomain" element={<ProductListingPage />} />
        <Route path="products/:domain/:subdomain/:subject" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>

  );
}

export default App;
