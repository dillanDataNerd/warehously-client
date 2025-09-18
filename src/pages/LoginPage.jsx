import * as React from "react";
import { useState, useContext } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";  

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { authenticateUser }=useContext(AuthContext)

  const providers = [{ id: "credentials", name: "Email and Password" }];
  const signIn = async (provider, formData) => {
    try {
      const userCredentials = Object.fromEntries(formData.entries());

      const response = await axios.post(
        `${VITE_SERVER_URL}/api/auth/login`,
        userCredentials
      );

      console.log("Login success:", response);
      localStorage.setItem("authToken", response.data.authToken)
      authenticateUser()
      navigate("/orders");
      return;
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // resets the login button on a failed attempt
      return {
        error: "Incorrect username or password",
      };
    }
  };

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{
          emailField: { autoFocus: false },
          form: { noValidate: true },
        }}
      />
    </AppProvider>
  );
}

export default LoginPage;
