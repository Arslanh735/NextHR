
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";

import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useLoginMutation } from "../services/authApi";
import { setCredentials } from "../features/auth/authSlice";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (formData) => {
    try {
      const response = await login(formData).unwrap();

      dispatch(setCredentials(response.user));

      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const errorMessage =
    error?.data?.message || "Unable to login. Please try again.";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F5F7FB",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Stack spacing={3} alignItems="center">
          <Box textAlign="center">
            <Typography
              variant="h3"
              fontWeight={800}
              color="primary"
            >
              NexHR.
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Human Capital Management System
            </Typography>
          </Box>

          <Card sx={{ width: "100%", borderRadius: 3 }}>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography variant="h5" fontWeight={700}>
                Welcome Back
              </Typography>

              <Typography color="text.secondary" mb={3} mt={1}>
                Sign in to access your workspace.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    placeholder="admin@example.com"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined />
                        </InputAdornment>
                      ),

                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowPassword(!showPassword)
                            }
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isLoading}
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="caption" color="text.secondary">
            © 2026 NexHR. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
