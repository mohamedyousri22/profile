import User from "../models/User.js";
import { Router } from "express";
const router = Router();
import pkg from "bcryptjs";
const { hash, compare } = pkg;

//signup
router.post("/signup", (req, res) => {
  let { name, email, password, age } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  age = String(age).trim();

  if (name == "" || email == "" || password == "" || age == "") {
    res.json({
      status: "failed",
      message: "Empty input fields",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: "failed",
      message: "Invalid name entered",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "failed",
      message: "Invalid email entered",
    });
  } else if (password.length < 8) {
    res.json({
      status: "failed",
      message: "Password is too short",
    });
  } else {
    // Use User.find or User.findOne as appropriate
    User.findOne({ email })
      .then((result) => {
        if (result) {
          res.json({
            status: "failed",
            message: "User with the provided email already exists",
          });
        } else {
          // Continue with user creation
          const saltRounds = 10;
          hash(password, saltRounds)
            .then((hashedpassword) => {
              const newUser = new User({
                name,
                email,
                password: hashedpassword,
                age,
              });
              newUser
                .save()
                .then((result) => {
                  res.json({
                    status: "success",
                    message: "Signup successful",
                    data: result,
                  });
                })
                .catch((err) => {
                  res.json({
                    status: "failed",
                    message: "An error occurred while saving user account",
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: "failed",
                message: "An error occurred while hashing password",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "failed",
          message: "An error occurred",
        });
      });
  }
});

//signin
router.post("/signin", (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();
  if (email == "" || password == "") {
    res.json({
      status: "failed",
      message: "Email and password are required",
    });
  } else {
    // Use User.findOne to find a single user
    User.findOne({ email })
      .then((user) => {
        if (user) {
          const hashedpassword = user.password;
          compare(password, hashedpassword)
            .then((result) => {
              if (result) {
                res.json({
                  status: "success",
                  message: "Signin successful",
                  data: user,
                });
              } else {
                res.json({
                  status: "failed",
                  message: "Invalid credentials entered",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "failed",
                message: "An error occurred",
              });
            });
        } else {
          res.json({
            status: "failed",
            message: "User not found",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "failed",
          message: "An error occurred",
        });
      });
  }
});

export default router;
