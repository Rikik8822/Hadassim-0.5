import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { serverRegister } from "./userApi";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

import Swal from "sweetalert2"
import { useDispatch } from "react-redux";
import { userIn } from "./userSlice";
import ProductItemForm from "../product/ProductItemForm";

/**
 * This component allows the user to register by filling in personal and company details,
 * and add products for the supplier if applicable.
 */
const Register = () => {
  let dispatch = useDispatch()

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "merchandise",
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    try {
      let res = await serverRegister(data)

      console.log(res);
      Swal.fire({
        title: "Register successfully",
        icon: "success",
        draggable: true
      });
      dispatch(userIn(res.data))
      reset();
    }
    catch (err) {
      console.log(err);
      Swal.fire({
        title: err.response.data.message,
        icon: "error",
        draggable: true
      });

    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} >
      <Box marginBottom={"10px"} marginTop={"100px"}>
        <TextField  {...register("userName", { required: "Username is required" })}
          id="filled-error-helper-text" label="User name" helperText={errors?.userName?.message} variant="filled" />
      </Box>
      <Box marginBottom={"10px"}>

        <TextField  {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } })}
          id="filled-error-helper-text" label="Email" helperText={errors?.email?.message} variant="filled" />
      </Box>

      <Box marginBottom={"10px"}>
        <TextField  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
          id="filled-error-helper-text" label="Password" helperText={errors?.password?.message} variant="filled" />
      </Box>

      <Box marginBottom={"10px"}>
        <TextField  {...{ ...register("companyName") }}
          id="filled-error-helper-text" label="Company name" helperText={errors?.companyName?.message} variant="filled" />
      </Box>

      <Box marginBottom={"10px"}>
        <TextField  {...register("phone", { required: "Phone number is required" })}
          id="filled-error-helper-text" label="Phone" helperText={errors?.phone?.message} variant="filled" />
      </Box>

      <Box marginBottom={"10px"}>
        <TextField  {...register("representativeName")}
          id="filled-error-helper-text" label="Representative Name" helperText={errors?.RepresentativeName?.message} variant="filled" />
      </Box>


      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Supplier's Products
      </Typography>

      <Box display="flex" flexDirection="column" alignItems="center">
        {fields.map((item, index) => (
          <ProductItemForm register={register} item={item} key={item.id} remove={remove} index={index} />
        ))}
      </Box>

      <Box display="flex" justifyContent="center" mt={3} >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => append({ name: "", price: "", minQuantity: "" })}
          sx={{ textTransform: "none" }}
        >
          Add Product
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button type="submit" variant="contained" color="primary" sx={{ textTransform: "none" }}>
          Submit
        </Button>
      </Box>

    </form >
  );
};

export default Register;
