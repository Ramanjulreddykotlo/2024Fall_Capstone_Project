import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PreferenceSetup from "./pages/PreferenceSetup";
import Recommendations from "./pages/Recommendations";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/recommendations" replace />;
  }
  return children;
};

const App = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <div className="app">
          <div className="background-layers">
            <div className="app-background"></div>
            <div className="gradient-overlay"></div>
            <div className="noise-overlay"></div>
          </div>

          <div className="app-content">
            <Navbar />
            <main className="main-container">
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <div className="page-transition">
                        <Login />
                      </div>
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <div className="page-transition">
                        <Register />
                      </div>
                    </PublicRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/preferences"
                  element={
                    <PrivateRoute>
                      <div className="page-transition">
                        <PreferenceSetup />
                      </div>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/recommendations"
                  element={
                    <PrivateRoute>
                      <div className="page-transition">
                        <Recommendations />
                      </div>
                    </PrivateRoute>
                  }
                />

                {/* Redirect Routes */}
                <Route
                  path="/"
                  element={
                    <Navigate
                      to={user ? "/recommendations" : "/login"}
                      replace
                    />
                  }
                />

                {/* 404 Route */}
                <Route
                  path="*"
                  element={
                    <div className="page-transition">
                      <div className="not-found">
                        <h1>404 - Page Not Found</h1>
                        <p>The page you're looking for doesn't exist.</p>
                        <button
                          className="btn-primary"
                          onClick={() =>
                            navigate(user ? "/recommendations" : "/login")
                          }
                        >
                          Go Home
                        </button>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
