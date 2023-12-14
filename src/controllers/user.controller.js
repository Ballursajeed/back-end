import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshTokens = async (userId) =>{
  try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken
      const refreshToken = user.generateRefreshToken



  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler( async (req,res) => {
   //get data from frontend
   //validation - not empty
   //check if user already exists: username,email
   //check for image, check for avatar
   //upload them to cloudinary, avatar
   //create user object - create entry in db
   //remove password and refresh token field from response
   //check for user creation
   //return response

//1) get data from user
   const { fullName, email, username, password } = req.body
   console.log("Email:",email);
   console.log("fullname:",fullName);

//2) validation
  if (
    [fullName, email, username, password].some((field) =>
    field?.trim() === "" )
  ){
     throw new ApiError(400,"All fields are required")
     console.log("The full name:",fullName);
  }

//3) check if user already exists
 const existedUser = await User.findOne({
       $or: [{ username }, { email }]
   });
   if (existedUser) {
       throw new ApiError(409, "User with email or username already exist")
       console.log("The full name:",fullName);
   }
   console.log(req.files);
//4) check image and check avatar
  const avatarLocalPath =  req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImagePath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0 ) {
        coverImagePath = req.files.coverImage[0].path;
  }

 if (!avatarLocalPath) {
     throw  new ApiError(400, "Avatar file is required");
 }
  console.log("Avatar Local Path:", avatarLocalPath);

//5) upload them cloudinary
  const avatar = avatarLocalPath; // await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImagePath //await uploadOnCloudinary(coverImageLocalPath);

 if (!avatar) {
       throw  new ApiError(400, "Avatar file is required");
  }

//6) create new user in db
 const user = await User.create({
       fullName,
       avatar, // avatar.url || " ",
       coverImage, // coverImage?.url || " ",
       email,
       password,
       username: username.toLowerCase()
 })

//7) remove password and refresh tokens
 const createdUser = await User.findById(user._id).select(
       "-password -refreshToken"
 )

//8) finally check the user creation
 if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user!!")
 }

//9) return response
 return res.status(201).json(
     new ApiResponse(200, createdUser, "User Registered successfully!!")
 )

} )

const loginUser = asyncHandler( async (req,res) => {
     // req body -> data
     // username or email
     // find the user
     // password check
     // access and refresh token
     // send cookie

// 1) get the req body
 const { email, username, password } = req.body;

//2) username or email
 if (!username || !email) {
       throw new ApiError(400, "username or email is required!!")
 }

//3) find the user
 const user = await User.findOne({
     $or: [{ username }, { email }]
  })
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

//4) password check
 const isPasswordvalid = await user.isPasswordCorrect(password);
 if (!isPasswordvalid) {
    throw new ApiError(401, "Password incorrect!!");
  }

//5) Access and refresh token


})

export {
	 registerUser,
    loginUser
    }
