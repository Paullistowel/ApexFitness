import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingPage/LandingPage";
import ContactPage from "./pages/ContactUsPage/ContactPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ForgotPasswordPage from "./pages/AuthPage/ForgotPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <div className="font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
