import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTdmOWVlNjNlN2U4Y2VlNDAyMmMwZmMiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUxMC5jb20iLCJ1c2VybmFtZSI6Impob25lam9obl9kb2UxMCIsImZ1bGxOYW1lIjoiamhvbiBkb2UxMCIsImlhdCI6MTcwMjg2MjY2MSwiZXhwIjoxNzAyOTQ5MDYxfQ.YXC7nMze4Dv8Jl_CIKfDJ99Cmp0OurnJJxIeLQElxcs";// req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        console.log("requset:",req);
        console.log("token:",token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {

            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})