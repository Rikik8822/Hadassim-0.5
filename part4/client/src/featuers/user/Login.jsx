import React from "react";
import { useForm } from "react-hook-form";
import { serverLogin } from "./userApi";
import { Box, Button, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { userIn } from "./userSlice";


/**
 * Login Component for user authentication.
 * Handles form submission, validation, and interaction with the API.
 */
const Login = () => {

    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    let dispatch = useDispatch()


    const onSubmit = async (data) => {
        console.log("Form Data:", data);
        try {
            let res = await serverLogin(data)
            Swal.fire({
                title: "Login successfully",
                icon: "success",
                draggable: true
            });
            dispatch(userIn(res.data))
            reset();
        }
        catch (err) {
            Swal.fire({
                title: err.response.data.message,
                icon: "error",
                draggable: true
            });

        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} >

            <Box marginBottom={"10px"}>
                <TextField  {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}
                    id="filled-error-helper-text" label="Email" helperText={errors?.email?.message} variant="filled" />
            </Box>

            <Box marginBottom={"10px"}>

                <TextField  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                    id="filled-error-helper-text" label="Password" helperText={errors?.password?.message} variant="filled" />

            </Box>

            <Box display="flex" justifyContent="center" mt={3}>
                <Button type="submit" variant="contained" color="primary" sx={{ textTransform: "none" }}>
                    Submit
                </Button>
            </Box>

        </form >
    );
};

export default Login;
