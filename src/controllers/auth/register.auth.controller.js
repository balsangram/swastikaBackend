import Joi from 'joi';
import User from '../../models/user.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),

  userName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  phoneNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),

  password: Joi.string()
    .min(6)
    .max(30)
    .required(),

  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .optional(),

  xander: Joi.string().optional(),

  color: Joi.string()
    .valid('red', 'green', 'pink', 'none')
    .default('none'),

  role: Joi.string()
    .valid('admin', 'user')
    .default('user'),

  isActive: Joi.boolean().default(true),
});

export const registerUser = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const message = error.details.map((err) => err.message).join(', ');
    throw new ApiError(400, `Validation error: ${message}`);
  }

  const { email, userName, phoneNo } = value;

  // Check for existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { userName }, { phoneNo }],
  });

  if (existingUser) {
    throw new ApiError(409, 'User with this email, username, or phone already exists');
  }

  const newUser = await User.create(value);

  res.status(201).json({
    success: true,
    message: '✅ User registered successfully',
    user: newUser,
  });
});

