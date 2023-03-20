import "./styles/global.css";
import AboutUsPage from "./pages/about-us";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import ProfilePage from "./pages/profile";
import NotFound from "./pages/404";

const App = () => (
  <div className="app">
    <Routes>
      <Route>
        <Route path="/" element={<AboutUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path='*' element={<NotFound />}/>
      </Route>
    </Routes>
  </div>
);

export default App;
