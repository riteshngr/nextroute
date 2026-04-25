import React, { useState } from "react";
import { apiPost, setToken } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./login.css";


export default function AuthPopup({ isOpen, onClose }) {
  const [mode, setMode] = useState("login");
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const validate = () => {
    let newErrors = {};

    const emailRegex = /\S+@\S+\.\S+/;

    if (mode === "signup" && !form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      if (mode === "login") {
        const data = await apiPost("/auth/login", {
          email: form.email,
          password: form.password,
        });
        setToken(data.token);
        refreshUser();
        onClose();
      } else {
        const data = await apiPost("/auth/signup", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setToken(data.token);
        refreshUser();
        onClose();
      }
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setServerError("");
  };

  return (
    <div className="auth-overlay">
      <div className="auth-popup">

        <button className="close-btn" onClick={onClose}>✕</button>

        <form onSubmit={handleSubmit}>
          
          {serverError && (
            <div style={{ 
              background: 'rgba(255,77,77,0.15)', 
              color: '#ff4d4d', 
              padding: '10px 15px', 
              borderRadius: '8px', 
              marginBottom: '15px',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {serverError}
            </div>
          )}

          {mode === "login" && (
            <div className="auth-content">
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Continue your journey</p>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className={errors.email ? "input-error" : ""}
                  onChange={handleChange}
                />
                {errors.email && <p className="error-msg">{errors.email}</p>}
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="•••••••"
                  className={errors.password ? "input-error" : ""}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="error-msg">{errors.password}</p>
                )}
              </div>

              <button className="auth-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className="auth-footer">
                Don't have an account?
                <span className="auth-link" onClick={() => switchMode("signup")}>
                  Create one
                </span>
              </p>
            </div>
          )}

          {mode === "signup" && (
            <div className="auth-content">
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join the Next Route community</p>

              <div className="field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className={errors.name ? "input-error" : ""}
                  onChange={handleChange}
                />
                {errors.name && <p className="error-msg">{errors.name}</p>}
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className={errors.email ? "input-error" : ""}
                  onChange={handleChange}
                />
                {errors.email && <p className="error-msg">{errors.email}</p>}
              </div>

              <div className="field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  className={errors.password ? "input-error" : ""}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="error-msg">{errors.password}</p>
                )}
              </div>

              <button className="auth-btn" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </button>

              <p className="auth-footer">
                Already have an account?
                <span className="auth-link" onClick={() => switchMode("login")}>
                  Login
                </span>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
