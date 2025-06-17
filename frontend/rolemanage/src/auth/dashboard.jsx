import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../redux/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, loading, error } = useSelector(
    (state) => state.auth || {}, 
    shallowEqual
  );
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login", { replace: true });
    } else {
      dispatch(fetchProfile()).then((result) => {
        if (result.error) {
          localStorage.removeItem("access");
          navigate("/login", { replace: true });
        }
        setTokenChecked(true);
      });
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (tokenChecked && profile && profile.role) {
      switch (profile.role.toLowerCase()) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "teacher":
          navigate("/teacher", { replace: true });
          break;
        case "student":
          navigate("/student", { replace: true });
          break;
        case "clerk":
          navigate("/clerk", { replace: true });
          break;
        default:
          localStorage.removeItem("access");
          navigate("/login", { replace: true });
      }
    }
  }, [profile, tokenChecked, navigate]);

  if (loading || !tokenChecked) return <p>Loading...</p>;
  if (error) return <p>{error.message || "Failed to fetch profile."}</p>;
  if (!profile || Object.keys(profile).length === 0) return <p>No profile data available</p>;

  return (
    <div>
      <h2>Welcome, {profile.name || profile.username}</h2>
      <p><strong>Role:</strong> {profile.role}</p>
    </div>
  );
};

export default Dashboard;
