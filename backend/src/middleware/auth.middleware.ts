import { Request, Response, NextFunction } from "express";

/**
 * Verifies the `Authorization: Bearer civicfix_session_<userId>_<ts>` token.
 * On success attaches `req.userId`. On failure returns 401.
 */
export interface AuthedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const token = match[1];
  const tokenMatch = token.match(/^civicfix_session_(.+)_\d+$/);
  if (!tokenMatch) {
    return res.status(401).json({ error: "Invalid session token." });
  }

  req.userId = tokenMatch[1];
  next();
}