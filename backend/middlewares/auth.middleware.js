import { TokenService } from "../services/index.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization?.split(" ") || null;

    let accessToken =
      authHeader && authHeader[0] === "Bearer" ? authHeader[1] : null;
    // validate
    if (!accessToken) throw new Error("Unauthorized");
    const userData = await TokenService.verifyAccessToken(accessToken);
    if (!userData) throw new Error("Unauthorized");
    req.user = { id: userData._id };
    next();
  } catch (error) {
    res.status(401).send("Invalid Token");
  }
};

export default authMiddleware;
