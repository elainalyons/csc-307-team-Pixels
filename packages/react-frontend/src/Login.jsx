import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login({
  handleSubmit,
  buttonLabel = "Login",
  message = "",
  setShowNavLinks
}) {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    handleSubmit(formData);
  }

  const isSignup = buttonLabel === "Sign Up";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>

        <form className="auth-form" onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="auth-input"
            data-cy="login-username"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            data-cy="login-password"
          />

          <button
            type="submit"
            className="auth-submit-btn"
            data-cy="login-submit">
            {buttonLabel}
          </button>

          {isSignup && (
            <p className="auth-switch-text">
              Want to try it first?{" "}
              <Link
                to="/home"
                className="auth-switch-link"
                onClick={() => setShowNavLinks?.(true)}>
                Continue as guest
              </Link>
            </p>
          )}
        </form>

        {!isSignup ? (
          <p className="auth-switch-text">
            Don&apos;t have a password?{" "}
            <Link to="/signup" className="auth-switch-link">
              Sign Up
            </Link>
          </p>
        ) : (
          <p className="auth-switch-text">
            Already have an account?{" "}
            <Link to="/login" className="auth-switch-link">
              Login
            </Link>
          </p>
        )}

        {message && <p className="auth-message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;
