const jwt = require("jsonwebtoken");
const { signUpService, signInService } = require("../services/user.services");
const { httpResponse } = require("../utils/httpResponse");

// token create
const maxAge = 3 * 24 * 60 * 60;
const createToken = (params, secret, expiresIn = null) => {
  return jwt.sign({ ...params }, secret, {
    expiresIn: expiresIn ?? maxAge,
  });
};

exports.signUp = async (req, res) => {
  try {
    const user = await signUpService(req.body);

    res
      .status(201)
      .json(httpResponse("success", user, "Successfully signed up"));
  } catch (error) {
    res.status(500).json(httpResponse("fail", {}, error.message));
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(401)
        .json(httpResponse("fail", {}, "Please provide your credentials"));
    }
    const user = await signInService(email);
    if (!user) {
      return res
        .status(401)
        .json(
          httpResponse("fail", {}, "No user found! Please create a account!")
        );
    }

    const isPasswordValid = user.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(403)
        .json(httpResponse("fail", {}, "Password is not currect"));
    }
    if (isPasswordValid) {
      const userJwtData = {
        name: user.name,
        email: user.email,
        id: user._id,
      };

      const accessToken = createToken(
        userJwtData,
        process.env.ACCESS_TOKEN_SECRET,
        "7days"
      );

      const refreshToken = createToken(
        userJwtData,
        process.env.REFRESH_TOKEN_SECRET,
        "7days"
      );
      res.cookie("tokenExp", "1", {
        sameSite: "strict",
        secure: true,
        path: "/",
        expires: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
      });
      res.cookie("token", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
        expires: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
        expires: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
      });

      const { password: pwd, ...others } = user.toObject();

      res
        .status(200)
        .json(httpResponse("success", { others }, "Successfully logged in"));
    }
  } catch (error) {
    res.status(500).json(httpResponse("faild", {}, error));
  }
};
