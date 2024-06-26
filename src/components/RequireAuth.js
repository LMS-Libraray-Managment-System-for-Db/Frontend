import { Navigate, Outlet } from "react-router-dom";
import { apis, routes } from "./URLs";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { decryptAndRetrieve, encryptAndStore } from "../rtk/slices/authSlice";
import { useLocation } from "react-router-dom";
import { fetchUsers } from "../rtk/slices/usersSlice";
import { fetchGenres } from "../rtk/slices/genresSlice";

function setAccessToken(access_token) {
  encryptAndStore("fathy", "access_token", access_token);
}

function setRefreshToken(refresh_token) {
  encryptAndStore("fathy", "refresh_token", refresh_token);
}

function getAccessToken() {
  return decryptAndRetrieve("fathy", "access_token");
}

function getRefreshToken() {
  return decryptAndRetrieve("fathy", "refresh_token");
}

function getRoleUser() {
  return decryptAndRetrieve("fathy", "role");
}

export const RequireAuth = ({ allowedRoles = "" }) => {
  const refresh_token = getRefreshToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const checkAccessToken = async () => {
      const token = getAccessToken();
      const refreshToken = getRefreshToken();
      const role = getRoleUser();

      if (token && refreshToken) {
        try {
          const decodedToken = jwtDecode(token);
          const expirationTime = decodedToken.exp * 1000;

          const decodedRefreshToken = jwtDecode(refreshToken);
          const expirationTimeRefreshToken = decodedRefreshToken.exp * 1000;

          console.log(
            "AccessToken: ",
            Date.now() - expirationTime > 0 ? "expired" : "work"
          );
          console.log(
            "RefreshToken: ",
            Date.now() - expirationTimeRefreshToken > 0 ? "expired" : "work"
          );

          if (Date.now() - expirationTime > 0) {
            if (expirationTimeRefreshToken < Date.now()) {
              navigate(routes.Login);
            } else {
              const res = await fetch(apis.RefreshToken, {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  refreshToken: refreshToken,
                }),
              });

              if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
              }

              const data = await res.json();
              setAccessToken(data.new_access_token);

              if (role == "administrator") {
                dispatch(fetchUsers(apis.Admin.AllUsers.replace(":number", 1)));
              } else if (role == "librarian") {
                dispatch(fetchGenres(apis.Librarian.Genre.All));

                dispatch(
                  fetchUsers(apis.Librarian.User.AllUsers.replace(":number", 1))
                );
              }

              navigate(location?.state);
            }
          }
        } catch (error) {
          console.error("Error occurred:", error);
        }
      } else {
        console.log("Access token not found");
        // navigate(routes.Login);
      }
    };

    checkAccessToken();

    const interval = setInterval(checkAccessToken, 60000);

    return () => clearInterval(interval);
  }, []);

  const token = getAccessToken();
  const role = getRoleUser();

  console.log(allowedRoles);
  console.log(role);
  console.log(role == allowedRoles);

  return token ? (
    role == allowedRoles ? (
      <Outlet />
    ) : allowedRoles == "" ? (
      <Outlet />
    ) : (
      <Navigate to={routes.Login} />
    )
  ) : allowedRoles == "" ? (
    <Outlet />
  ) : (
    <Navigate to={routes.Login} />
  );
};

export default RequireAuth;
