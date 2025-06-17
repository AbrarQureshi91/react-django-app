import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const signUpUser = createAsyncThunk(
  "user/signUpUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// SingIn 

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const signinUser = createAsyncThunk(
  "user/signinUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/login/", userData);
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("access", access_token);
      localStorage.setItem("refresh", refresh_token);

      return {
        access: access_token,
        refresh: refresh_token,
      };
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue({ message: "No response from server." });
      } else {
        return rejectWithValue({ message: error.message });
      }
    }
  }
);

//profile

export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access");

      console.log("Fetching profile with token:", token);

      const res = await api.get("/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      console.error("fetchProfile failed:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { error: "Profile fetch failed" });
    }
  }
);




const initialState = {
  msg: "",
  profile:  null,
  profileLoading: false,
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("access") || "",
  loading: false,
  error: "",
};


const authSlice = createSlice({
  name: "user",
  initialState,
 reducers: {
  setUserProfile: (state, action) => {
    state.profile = action.payload;
    state.loading = false;
  },
  setUserLoading: (state) => {
    state.loading = true;
  },
  clearUser: (state) => {
    state.profile = null;
    state.loading = false;
  },
},
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.msg = "";
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.msg = "Signup successful";
        state.error = "";
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload || "Something went wrong";
        state.msg = "";
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.profileLoading = false;
        localStorage.setItem("profile", JSON.stringify(action.payload));
      })
      .addCase(fetchProfile.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.profileLoading = false;
        state.profile = null;
        localStorage.removeItem("profile"); 
      });

  },
});

export const { clearError, clearMessage, logout } = authSlice.actions;
export default authSlice.reducer;