import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signinUser, clearError, clearMessage, fetchProfile,} from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, msg } = useSelector((state) => state.user);

  const loginHandler = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    const userData = { username, password };

    try {
      const result = await dispatch(signinUser(userData));

      if (!result.error) {
        console.log(" Login successful, fetching profile...");
        const profileResult = await dispatch(fetchProfile());
        console.log("Profile result:", profileResult);

        if (profileResult.type === "user/fetchProfile/fulfilled" && profileResult.payload) {
          const role = profileResult.payload.role?.toLowerCase();
          console.log("User role:", role);

          switch (role) {
            case "admin":
              navigate("/admin");
              break;
            case "teacher":
              navigate("/teacher");
              break;
            case "student":
              navigate("/student");
              break;
            case "clerk":
              navigate("/clerk");
              break;
            default:
              console.warn("Unknown role, redirecting to dashboard");
              navigate("/login");
          }
        } else {
          console.error("Failed to fetch profile after login");
          alert("Profile fetch failed. Please try again.");
        }
      } else {
        console.error("Login failed:", result.error);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        dispatch(clearError());
      }, 15000);
      return () => clearTimeout(timeout);
    }
  }, [error, dispatch]);

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h3>Login</h3>

      {msg && <div style={{ color: "green", marginBottom: "10px" }}>{msg}</div>}
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {typeof error === "object" ? JSON.stringify(error) : error}
        </div>
      )}

      <form onSubmit={loginHandler}>
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

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div>
        <p>
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
