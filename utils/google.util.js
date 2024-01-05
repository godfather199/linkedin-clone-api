import User from "../models/user.model.js";
import errorHandler from "../middlewares/errorHandler.js";
import jwt from "jsonwebtoken";

export const register_Success_Func = async (req, res, next) => {
  const { displayName, emails } = req.user;

  const dummy_User = {
    username: String(Date.now()),
    password: Date.now(),
    name: displayName,
    email: emails[0].value,
  };

  const { username, email } = dummy_User;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (user) {
      if (user.username === username) {
        return next(errorHandler(400, "Username already taken"));
      }

      return next(errorHandler(400, "Email already exists"));
    }

    const newUser = await User.create({ ...dummy_User });

    const { password, ...userDetails } = newUser._doc;

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
      .json({
        msg: "User Registered successfully",
        userDetails,
      });
  } catch (error) {
    next(error);
  }
};



export const login_Success_Func = async (req, res, next) => {
  console.log('Inside login_Success_Func')
  const { displayName, emails } = req.user;

  try {
    const user = await User.findOne({email: emails[0].value})
    console.log('login_Success_Func user: ', user)

    if(!user) {
      return next(errorHandler(400, 'Invalid username/email'))
  }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      })
      .json({
        msg: "User login successfull",
        user
      });
  } catch (error) {
    next(error);
  }
};

