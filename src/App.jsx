// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import List from "./pages/List";
import MovieDetail from "./pages/MovieDetail";
import Watch from "./pages/Watch";
import History from "./pages/History";
import ScrollToTop from "./components/common/ScrollToTop";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import { PrivateRoute } from "./components/PrivateRoute";
import Favorites from "./pages/Favorites";
import { useAuth } from "./hooks/useAuth";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
       

      <Routes>
        <Route element={<Layout />}>
          {/* --- CÁC ROUTE CÔNG KHAI --- */}
          <Route path="/" element={<Home />} />
          <Route path="/dang-nhap" element={<Login />} />
          <Route path="/dang-ky" element={<SignUp />} />
          <Route path="/danh-sach/:slug" element={<List />} />
          <Route path="/the-loai/:slug" element={<List />} />
          <Route path="/quoc-gia/:slug" element={<List />} />
          <Route path="/phim/:slug" element={<MovieDetail />} />
          <Route path="/xem/:slug" element={<Watch />} />
          <Route path="/xem/:slug/:episodeSlug" element={<Watch />} />
          <Route path="/tim-kiem" element={<SearchPage />} />

          {/* --- CÁC ROUTE CẦN ĐĂNG NHẬP (PRIVATE) --- */}
          <Route
            path="/yeu-thich"
            element={
              <PrivateRoute>
                <Favorites />
              </PrivateRoute>
            }
          />
          
          <Route path="/lich-su" element={<History />} />

          {/* Route dành riêng cho Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <div className="p-10 text-white">Admin Dashboard</div>
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}