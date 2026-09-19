import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div>
      <h1>Create Account</h1>

      <form onSubmit={handleSignup}>
        <div>
          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Signup;