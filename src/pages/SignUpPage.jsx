import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";

export default function SignIn() {
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
    e.preventDefault();
    validateInputs();

    const data = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      console.log(data);
      const res = await axios.post(`${VITE_SERVER_URL}/api/users/signup`, data);
      console.log(res);
      setShowToast(true);
      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
      return;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
      return;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          px: 2,
          width: "100%",
          mx: "auto",
        }}
      >
        <Card
          variant="outlined"
          sx={{
            width: "100%",
            p: 4,
            boxShadow: 3,
            maxWidth: 400,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            fullWidth
            textAlign={"center"}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <TextField
              id="firstName"
              name="firstName"
              label="First Name"
              autoFocus
              required
              fullWidth
              variant="outlined"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              id="lastName"
              name="lastName"
              label="Last Name"
              autoFocus
              required
              fullWidth
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              label="Email"
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? "error" : "primary"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              label="Password"
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              Sign up
            </Button>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => {
                navigate("/home");
              }}
            >
              Go to login
            </Button>

            {showToast && (
              <Toast
                message={"You have successfully created a user"}
                success={true}
              />
            )}
          </Box>
        </Card>
      </Box>
    </>
  );
}
