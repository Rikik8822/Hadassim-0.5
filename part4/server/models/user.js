import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  companyName: String,
  phone: String,
  representativeName: String,
  merchandise: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  role: { type: String, enum: ["supplier", "admin"], default: "supplier" }

}, { timestamps: true });

export const UserModel = mongoose.model("User", userSchema);




export const validatUser = (user) => {

  const userValidationSchema = Joi.object({
    userName: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 2 characters long",
      "any.required": "Username is required"
    }),

    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required"
    }),

    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required"
    }),

    companyName: Joi.string().min(2).max(100).required().messages({
      "string.empty": "Company name is required",
      "any.required": "Company name is required"
    }),

    phone: Joi.string()
      .pattern(/^0\d{1,2}-?\d{7}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid phone number format",
        "any.required": "Phone number is required"
      }),

    representativeName: Joi.string().min(2).max(50).required().messages({
      "string.empty": "Representative name is required",
      "any.required": "Representative name is required"
    }),

    merchandise: Joi.array().items(
      Joi.string().regex(/^[0-9a-fA-F]{24}$/)
    ).messages({
      "string.pattern.base": "Invalid product ID format"
    }),

    role: Joi.string().valid("supplier", "admin").default("supplier")
  }).unknown();

  const validationResult = userValidationSchema.validate(user);

  if (validationResult.error) {
    return validationResult.error.details.map((error) => error.message);
  }
  return null;

}