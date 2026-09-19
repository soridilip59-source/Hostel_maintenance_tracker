import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";
import "./Login.css"

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loginRole, setLoginRole] = useState("student");

    const [error, setError] = useState("");
    const [googleLoading, setGoogleLoading] = useState(false);

    function finishLogin(user, token) {
        if (user.role !== loginRole) {
            setError(`This account is registered as a ${user.role}. Please select ${user.role === "admin" ? "Admin Login" : "Student Login"}.`);
            return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);
        localStorage.setItem("user", JSON.stringify(user));
        navigate(user.role === "student" ? "/student/dashboard" : "/admin/dashboard");
    }

    async function handleGoogleLogin(response) {
        setGoogleLoading(true);
        setError("");
        try {
            const result = await api.post("/auth/google", { credential: response.credential });
            finishLogin(result.data.user, result.data.token);
        } catch (requestError) {
            setError(requestError.response?.data?.message || "Google login failed");
        } finally {
            setGoogleLoading(false);
        }
    }



    async function handleLogin(e) {
        e.preventDefault();
        if (email === "") {
            setError("Email is required");
            return;
        }
        if (password === "") {
            setError("Password is required");
            return;
        }
        setError("")

        try {
            const response = await api.post("/auth/login", {
                email: email,
                password: password,
            });
            console.log(response.data);



            const token = response.data.token;
            const role = response.data.user.role;

            if (role !== loginRole) {
                setError(`This account is registered as a ${role}. Please select ${role === "admin" ? "Admin Login" : "Student Login"}.`);
                return;
            }

            finishLogin(response.data.user, token);


        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || (error.request ? "Cannot reach the backend server" : "Login failed"))

        }


    }
    return (
        <div className='login-page'>
            <div className='login-card'>
                <h1>Hostel Maintenance</h1>
                <p className='login-subtitle'>Login to your account</p>

                <div className="login-role-selector">
                    <button
                        type="button"
                        onClick={() => { setLoginRole("student"); setError(""); }}
                        aria-pressed={loginRole === "student"}
                    >
                        Student Login
                    </button>
                    <button
                        type="button"
                        onClick={() => { setLoginRole("admin"); setError(""); }}
                        aria-pressed={loginRole === "admin"}
                    >
                        Admin Login
                    </button>
                </div>

                <h2 className="login-role-title">{loginRole === "admin" ? "Admin Login" : "Student Login"}</h2>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" />
                    </div>

                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">Login</button>
                </form>
                <div className="login-divider"><span>or continue with</span></div>
                {import.meta.env.VITE_GOOGLE_CLIENT_ID ? <div className="google-login"><GoogleLogin onSuccess={handleGoogleLogin} onError={() => setError("Google login was cancelled or failed")} useOneTap={false} /></div> : <p className="google-config-note">Google login is unavailable until VITE_GOOGLE_CLIENT_ID is configured.</p>}
                {googleLoading && <p className="login-status">Signing you in with Google...</p>}
                <p>
                    New student? <Link to="/signup">Create an account</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
