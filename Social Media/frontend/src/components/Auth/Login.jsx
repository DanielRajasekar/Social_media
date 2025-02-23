import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { URL } from '../../url';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setUser  } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        try {
            const res = await fetch(URL + "/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            // Check if the response is OK
            if (!res.ok) {
                const errorData = await res.json();
                setError(errorData.message || "Email ID or password does not match.");
                return;
            }

            const data = await res.json();
            localStorage.setItem('token', data.token);

            setUser (data);
            setEmail("");
            setPassword("");
            console.log("Login successful:", data);
            navigate("/home");
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
            console.error("Login error:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Email ID:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Enter your Email ID"
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                    />
                </div>

                <button type="submit" className="btn btn-primary mt-3">Login</button>

                {error && <p className="text-danger mt-3">{error}</p>} {/* Display error message */}
                <h3 className="mt-3">
                    <Link to="/register" className="d-block mt-3">
                        Don't have an account? Sign up
                    </Link>
                </h3>
            </form>
        </div>
    );
}

export default Login;