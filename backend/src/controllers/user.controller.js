    import { asyncHandler } from "../utils/asyncHandler.js";
    import { ApiError } from "../utils/apiError.js";
    import { User } from "../models/user.model.js";
    import { ApiResponse } from "../utils/apiResponse.js";

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    }

    const generateAccessAndRefreshTokens = async (userId) => {
        try {
            const user = await User.findById(userId);
        
            if (!user) {
                console.log("Debug: No user found with ID:", userId);
                throw new ApiError(404, "User not found for token generation");
            }

            const accessToken = user.generateAuthToken(); 
            const refreshToken = user.generateRefreshToken(); 

            user.refreshToken = refreshToken; 
            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken };
        } catch (error) {
            //  THIS IS THE CRITICAL LINE: It prints the raw system error to your terminal console
            console.error(" RAW TOKEN GENERATION ERROR:", error); 
            
            throw new ApiError(500, "Error generating tokens");
        }
    };

    //register and login user in one go
    const registerUser = asyncHandler(async (req, res) => {


        const { idNumber, name, universityEmail, password, branch, batch } = req.body;

        if ([idNumber, name, universityEmail, password, branch, batch].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const existedUser = await User.findOne({
            $or: [{ idNumber }, { universityEmail }]
        });

        if (existedUser) {
            throw new ApiError(409, "User with this ID or Email already exists");
        }

        const user = await User.create({
            idNumber,
            name,
            universityEmail,
            password,
            branch,
            batch
        });
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

        return res
        .status(201) 
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                201, 
                { user: createdUser, accessToken }, 
                "User registered and logged in successfully! 🎓"
            )
        );
    });

    //login user
    const loginUser = asyncHandler(async (req, res) => {
        const {universityEmail, password} = req.body;

        if(!universityEmail || !password){
            throw new ApiError(400, "Email and password are required");
        }

        const user = await User.findOne({universityEmail});

        if(!user){
            throw new ApiError(401, "User not found with this email");
        }
        
        const isPasswordValid = await user.isPasswordCorrect(password);
        if(!isPasswordValid){
            throw new ApiError(401, "Invalid password");
        }
        
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        if(!loggedInUser){
            throw new ApiError(500, "Something went wrong while logging in the user");
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken}, 
                "User logged in sucessfully!"
            )
        );

    });

    export { registerUser, loginUser };