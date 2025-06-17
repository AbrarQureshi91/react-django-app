import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/authSlice";

const UserInfo = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!profile && token) {
      dispatch(fetchProfile());
    }
  }, [dispatch, profile]);

  return null; 
};

export default UserInfo;
