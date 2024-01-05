import { Router } from "express";
import passport from "passport";
import { login_Success_Func, register_Success_Func } from "../utils/google.util.js";



const router = Router();


router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});



router.get("/register/success", register_Success_Func);
router.get("/login/success", login_Success_Func);


router.get("/google", passport.authenticate("google", ["profile", "email"]));


router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

export default router;
