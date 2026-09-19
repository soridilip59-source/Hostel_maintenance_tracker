import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../services/api";
function Signup() {
  const navigate = useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    if (name === "") {
      setError("Name is required");
      return;
    }

    if (email === "") {
      setError("Email is required");
      return;
    }

    if (password === "") {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    if (confirmPassword === "") {
      setError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await api.post("/auth/register", {
        name: name,
        email: email,
        password: password,
      });

      console.log("Signup response:", response.data);

      setError("");

      navigate("/");
    } catch (error) {
      console.log("Signup error:", error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Server is not running");
      }
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
      <p className="eyebrow">Hostel Maintenance Tracker</p><h1>Create Account</h1><p className="login-subtitle">Create your student account to report and track issues.</p>
      <form onSubmit={handleSignup}>
        <div className="form-group"><label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group"><label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group"><label>Password</label>

          <input
            type="password"
            minLength="6"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group"><label>Confirm Password</label>

          <input
            type="password"
            minLength="6"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">
          Sign Up
        </button>
      </form>
      <p>Already registered? <Link to="/">Back to login</Link></p>
      </div>
    </div>
  );
}

export default Signup;
