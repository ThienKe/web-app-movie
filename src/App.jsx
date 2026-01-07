// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import List from "./pages/List";
import MovieDetail from "./pages/MovieDetail";
import Watch from "./pages/Watch";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import ScrollToTop from "./components/common/ScrollToTop";
import SearchPage from "./pages/SearchPage";
import LogIn from "./pages/Loging";



export default function App() {
  return (
    <Router>
       <ScrollToTop />
      <Routes>
        <Route element={<Layout />}> {/* <-- Tất cả page con nằm trong Layout */}
          <Route path="/" element={<Home />} />
          <Route path="/danh-sach/:slug" element={<List />} />
          <Route path="/the-loai/:slug" element={<List />} />
          <Route path="/quoc-gia/:slug" element={<List />} />
          <Route path="/phim/:slug" element={<MovieDetail />} />
          <Route path="/xem/:slug" element={<Watch />} />
          <Route path="/xem/:slug/:episodeSlug" element={<Watch />} />
          <Route path="/yeu-thich" element={<Favorites />} />
          <Route path="/lich-su" element={<History />} />
          <Route path="/dang-nhap" element={<LogIn />} />
          <Route path="/tim-kiem" element={<SearchPage/>} />
        
        </Route>
      </Routes>
    </Router>
  );
}