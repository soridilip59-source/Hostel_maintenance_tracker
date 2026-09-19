import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css"

function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const [error, setError] = useState("");



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

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);


            if (role === "student") {
                navigate("/student/dashboard");
            }

            if (role === "admin") {
                navigate("/admin/dashboard");
            }


        } catch (error) {
            console.log(error);
            setError("Invalid email or password")

        }


    }
    return (
        <div className='login-page'>
            <div className='login-card'>
                <h1>Hostel Maintenance</h1>
                <p className='login-subtitle'>Login to your account</p>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" />
                    </div>

                    {error && <p>{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login