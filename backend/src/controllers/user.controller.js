import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details from frontend (req.body)
    const { idNumber, name, universityEmail, password, branch, batch } = req.body;

    // 2. Validation: Check if any field is empty
    if ([idNumber, name, universityEmail, password, branch, batch].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check if user already exists (by ID or Email)
    const existedUser = await User.findOne({
        $or: [{ idNumber }, { universityEmail }]
    });

    if (existedUser) {
        throw new ApiError(409, "User with this ID or Email already exists");
    }

    // 4. Create user object - create entry in DB
    // Note: Password hashing will happen in the model middleware (next step)
    const user = await User.create({
        idNumber,
        name,
        universityEmail,
        password,
        branch,
        batch
    });

    // 5. Remove password and refresh token from response for security
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 6. Return success response
    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully! 🎓")
    );
});

export { registerUser };