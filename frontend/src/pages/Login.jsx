import { useState } from 'react';
import "./Login.css"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const [error, setError] = useState("")
    function handleLogin(e) {
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
        console.log("email : ", email);
        console.log("password : ", password);


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