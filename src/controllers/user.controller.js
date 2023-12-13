import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
   const { fullname, email, username, password } = req.body
   console.log("Email:",email);

//2) validation
  if (
    [fullname, email, username, password].some((field) =>
    field?.trim() === "" )
  ){
     throw new ApiError(400,"All fields are required")
  }

//3) check if user already exists
 const existedUser = User.findOne({
       $or: [{ username }, { email }]
   });
   if (existedUser) {
       throw new ApiError(409, "User with email or username already exist")
   }

//4) check image and check avatar
 const avatarLocalPath = req.files?.avatar[0]?.path;
 const coverImageLocalPath = req.files?.coverImage[0]?.path;

 if (!avatarLocalPath) {
     throw  new ApiError(400, "Avatar file is required");
 }

//5) upload them cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
       throw  new ApiError(400, "Avatar file is required");
  }
//6) create new user in db
 User.create({
       fullname,
       avatar: avatar.url,
       coverimage: coverImage?.url || " ",
       email,
       password,
       username: username.toLowerCase()
 })

} )

export { registerUser, }