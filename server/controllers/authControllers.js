import User from "../models/User.js";
import jwt from "jsonwebtoken";




const setTokenCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd, // true in production
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};


// register api

export const registerApi = async (req, res) => {
  try {
    const { name, email, password, role, managerId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    if (!["employee", "manager"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be employee or manager",
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    // ✅ Employee must have managerId
    if (role === "employee" && !managerId) {
      return res.status(400).json({
        success: false,
        message: "managerId is required for employee",
      });
    }

    // ✅ Validate managerId (must be a manager)
    if (role === "employee") {
      const manager = await User.findById(managerId);
      if (!manager || manager.role !== "manager") {
        return res.status(400).json({
          success: false,
          message: "Invalid manager ID or manager not found",
        });
      }
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
      managerId: role === "employee" ? managerId : null,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        managerId: user.managerId,
      },
    });
  } catch (error) {
    console.error("Register API Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};



// login api
export const loginApi = async(req,res)=> {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      return res.status(400).json({success: false, message: "All fields required"});
    }

    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({success: false, message: "Invalid email or password"});
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({success: false, message: "Invalid email or password"});
    }


    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    setTokenCookie(res, token);

     res.json({
       success: true,
       message: "Login success",
       user: {
         id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
       },
     });


  } catch (error) {
    console.error("Login API Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
    
  }
}
    


//  Logout
export const logoutApi = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    // Clear cookie with same options as setCookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd, 
      sameSite: isProd ? "none" : "lax", 
      path: "/",
    });

    res.json({ success: true, message: "Logout success" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
  
};


// ✅ Current user
export const meApi = async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
    };