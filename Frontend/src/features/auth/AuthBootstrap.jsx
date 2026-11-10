
import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { CircularProgress, Box } from "@mui/material";

import { useGetMeQuery } from "../../services/authApi";

import {
  setCredentials,
  clearCredentials,
} from "./authSlice";

export default function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  const { data, isLoading, isFetching } = useGetMeQuery();

  useEffect(() => {
    if (data?.success && data?.user) {
      dispatch(setCredentials(data.user));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!isLoading && !isFetching && !data?.success) {
      dispatch(clearCredentials());
    }
  }, [data, isLoading, isFetching, dispatch]);

  if (isLoading || isFetching) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return children;
}
