import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiError.js"

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

   const { fullname, email, username, password } = req.body
   console.log("Email:",email);

  if (
    [fullname, email, username, password].some((field) =>
    field?.trim() === "" )
  ){
     throw new ApiError(400,"All fields are required")
  }

} )

export { registerUser, }