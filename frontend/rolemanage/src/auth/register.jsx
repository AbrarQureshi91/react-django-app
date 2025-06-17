import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser, clearError, clearMessage } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [role, setRole] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, msg } = useSelector((state) => state.user);

    const registerHandler = (e) => {
        e.preventDefault(); 
        
        if (!username || !password || !password2 || !role) {
            alert("Please fill in all fields");
            return;
        }
        
        if (password !== password2) {
            alert("Passwords do not match");
            return;
        }

        const userData = {
            username,
            password,
            password2,
            role,
        };
        
        dispatch(signUpUser(userData));
    };

    useEffect(() => {
        if (msg === "Signup successful") {
            setUsername("");
            setPassword("");
            setPassword2("");
            setRole("");

            setTimeout(() => {
                dispatch(clearMessage());
                navigate("/login");  // Navigate to login after success
            }, 2000);
        }
    }, [msg, dispatch, navigate]);

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(clearError());
            }, 5000);
        }
    }, [error, dispatch]);

    return (
        <div>
            <h3>Registration</h3>
            
            {msg && (
                <div style={{ color: "green", marginBottom: "10px" }}>
                    {msg}
                </div>
            )}
            {error && (
                <div style={{ color: "red", marginBottom: "10px" }}>
                    {typeof error === 'object' ? JSON.stringify(error) : error}
                </div>
            )}
            <form onSubmit={registerHandler}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="password2">Confirm Password</label>
                    <input
                        id="password2"
                        type="password"
                        placeholder="Confirm Password"
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="teacher">teacher</option>
                        <option value="student">student</option>
                        <option value="admin">Administration</option>
                        <option value="clerk">clerk</option>
                    </select>
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
             <div style={{ marginTop: "20px" }}>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
};

export default Register;
