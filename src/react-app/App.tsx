import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import { CartProvider } from "@/react-app/hooks/useCart";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/daLux-premium-health-beauty" element={<HomePage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
