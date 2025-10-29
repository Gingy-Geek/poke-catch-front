// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider } from "../src/context/userContext";
import { useState, useEffect } from "react";
import LoadingScreen from "./pages/LoadingScreen";

function App() {
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular "ping" al backend + carga de 3 segundos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen />; // mostramos la pantalla de carga

  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
