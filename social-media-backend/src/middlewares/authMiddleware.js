import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const protect = async (req, res, next) => {
  let token;

  // ✅ Check if `Authorization` header exists
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Find user from database
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, username: true },
      });

      if (!req.user) {
        return res.status(401).json({ error: "User not found, authorization denied." });
      }

      next();
    } catch (error) {
      console.error("Error in protect middleware:", error);
      return res.status(401).json({ error: "Token is not valid." });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied." });
  }
};
