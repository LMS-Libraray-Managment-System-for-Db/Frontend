import { useSelector, useDispatch } from "react-redux";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apis, routes } from "../../components/URLs";
import { jwtDecode } from "jwt-decode";
import { decryptAndRetrieve } from "./authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function getAccessToken() {
  return decryptAndRetrieve("fathy", "access_token");
}

export const fetchUsers = createAsyncThunk(
  "usersSlice/fetchUsers",
  async (api) => {
    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      if (access_token) {
        let res = await fetch(api, {
          method: "GET",
          headers: {
            Authorization: `${access_token}`,
          },
        });

        let data = await res.json();
        console.log(data);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const filterUsers = createAsyncThunk(
  "userSlice/filterUsers",
  async ([
    number,
    id,
    userName,
    email,
    accountType,
    libraryName,
    role,
    verified,
    isActive,
  ]) => {
    try {
      const access_token = getAccessToken();

      let APIFilter = apis.Admin.Filter.replace(":number", number);
      if (id !== "") APIFilter += "user_id=" + id + "&";
      if (userName !== "") APIFilter += "username=" + userName + "&";
      if (email !== "") APIFilter += "email=" + email + "&";
      if (accountType !== "") APIFilter += "account_type=" + accountType + "&";
      if (libraryName !== "") APIFilter += "library_name=" + libraryName + "&";
      if (role !== "") APIFilter += "role=" + role + "&";
      if (verified !== "") APIFilter += "verified=" + verified + "&";
      if (isActive !== "") APIFilter += "is_active=" + isActive + "&";

      let res = await fetch(APIFilter, {
        method: "POST",
        headers: { Authorization: `${access_token}` },
      });

      let data = await res.json();

      if (data.success === true) {
        toast.success(data.msg);
        console.log(data);
        return data;
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const editUser = createAsyncThunk(
  "userSlice/editUser",
  async ([
    userId,
    username,
    accountType,
    email,
    role,
    libraryName,
    verified,
    isActive,
  ]) => {
    let user = {
      username: username,
      account_type: accountType,
      email: email,
      role: role,
      library_name: libraryName,
      verified: verified,
      is_active: isActive,
    };

    console.log(user);

    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      if (access_token) {
        let res = await fetch(apis.Admin.Edit, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${access_token}`,
          },
          body: JSON.stringify({
            userId: userId,
            updatedUserData: user,
          }),
        });

        let data = await res.json();

        if (data.success === true) {
          toast.success(data.msg);
        } else {
          toast.error(data.msg);
        }
      }
    } catch (error) {
      toast.error(error);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "usersSlice/deleteUser",
  async (userInfo) => {
    try {
      const access_token = getAccessToken();
      let res = await fetch(apis.Admin.Delete, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${access_token}`,
        },
        body: JSON.stringify({ identifier: userInfo }),
      });
      let data = await res.json();

      if (data.success === true) {
        toast.success(data.msg);
        return data;
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const toggleUserActive = createAsyncThunk(
  "usersSlice/toggleUserActive",
  async (userInfo) => {
    try {
      const access_token = getAccessToken();

      if (!access_token) {
        throw new Error("Access token not found");
      }

      if (access_token) {
        let res = await fetch(apis.Librarian.User.ToggleUserActive, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${access_token}`,
          },
          body: JSON.stringify({ identifier: userInfo }),
        });

        let data = await res.json();

        if (data.success === true) {
          toast.success("toggle state success");
          return data;
        } else {
          toast.error("toggle state failed");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
);

const initialState = {
  data: null,
  page: null,
  loading: false,
  error: null,
};

export const usersSlice = createSlice({
  initialState: initialState,
  name: "usersSlice",
  reducers: {
    clearUser: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data;
        state.page = action.payload?.page;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(filterUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data;
        state.page = action.payload?.page;
      })
      .addCase(filterUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data = state.data.map((item) => {
          if (item.user_id === action.payload?.data?.user_id) {
            return action.payload?.data;
          }
          return item;
        });
      })
      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(toggleUserActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserActive.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.map((item) => {
          if (item.user_id === action.payload?.id) {
            return {
              ...item,
              user_libraries: [
                {
                  is_active: action.payload?.isActive,
                },
              ],
            };
          }
          return item;
        });
        console.log(state.data);
      })
      .addCase(toggleUserActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message;
      });
  },
});

export const { clearUser } = usersSlice.actions;
export default usersSlice.reducer;
