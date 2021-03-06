import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    // the slice gets the token part only by getting rid of the bearer part
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

// export const isAuthUser = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   const user_id = req.headers.userId;

//   if (authorization) {
//     // the slice gets the token part only by getting rid of the bearer part
//     const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
//     jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
//       if (err) {
//         res.status(401).send({ message: "Invalid Token" });
//       } else if (decode._id === user_id) {
//         res.status(401).send({ message: "Token dont match" });
//       } else {
//         req.user = decode;
//         next();
//       }
//     });
//   } else {
//     res.status(401).send({ message: "No Token" });
//   }
// };
