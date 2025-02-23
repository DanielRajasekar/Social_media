import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../../url';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [bio, setBio] = useState('');
    const [profilePic, setProfilePic] = useState(null); // State for profile picture
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]); // Set selected file
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('bio', bio);
            if (profilePic) {
                formData.append('profilePic', profilePic);
            }

            await axios.post(`${URL}/api/auth/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Reset input fields
            setUsername('');
            setEmail('');
            setPassword('');
            setBio('');
            setProfilePic(null);
            navigate("/"); // Navigate to login
        } catch (err) {
            if (err.response) {
                if (err.response.status === 409) {
                    setError("Email already exists. Please use a different email.");
                } else {
                    setError(err.response.data.message || "An error occurred. Please try again.");
                }
            } else {
                setError("An error occurred. Please try again.");
            }
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Register</h1>
            <form onSubmit={handleRegister} encType="multipart/form-data">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="Enter your Username"
                        required
                    />
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="form-control"
                        placeholder="Enter Your Email id"
                        required
                    />
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className="form-control"
                        placeholder="Enter your Password"
                        required
                    />
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="bio">Bio:</label>
                    <input
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        type="text"
                        className="form-control"
                        placeholder="Enter your Bio"
                        required
                    />
                </div>

                <div className="form-group mt-3">
                    <label htmlFor="profilePic">Profile Picture:</label>
                    <input
                        id="profilePic"
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>

                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>

            {error && <p className="text-danger mt-3">{error}</p>}
            <h3 className="mt-3">
                <Link to="/">Already have an account? Login</Link>
            </h3>
        </div>
    );
};

export default Register;
