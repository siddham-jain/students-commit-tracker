import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import { LoaderProvider } from "./contexts/LoaderContext";
import ErrorPage from "./pages/ErrorPage";
import LeaderboardPage from "./pages/Leaderboard/LeaderboardPage";
import NavBar from "./components/NavBar";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <UserProvider>
      <LoaderProvider>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route
              index
              element={
                <ProtectedRoute>
                  <TooltipProvider>
                    <HomePage />
                  </TooltipProvider>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </LoaderProvider>
    </UserProvider>
  );
}
export default App;
