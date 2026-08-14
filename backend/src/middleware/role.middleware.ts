import { Response, NextFunction } from "express";
import { AuthedRequest } from "./auth.middleware";
import { getUserModel } from "../config/db";

/**
 * Role-based access guard: rejects if the authenticated user's role
 * is not one of the allowed roles. Looks the user up by their real id
 * (authMiddleware already guaranteed the account exists).
 */
export function roleMiddleware(...allowedRoles: Array<"citizen" | "organization" | "worker" | "investor">) {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Authentication required." });
    }

    try {
      const user = await getUserModel().findOne({ id: req.userId })?.lean();
      const role = user?.role;

      if (!role || !allowedRoles.includes(role)) {
        return res.status(403).json({ error: `This action requires role: ${allowedRoles.join("/")}.` });
      }

      req.userRole = role;
      next();
    } catch (err) {
      console.error("[ROLE] check failed:", err);
      return res.status(500).json({ error: "Role check failed." });
    }
  };
}
