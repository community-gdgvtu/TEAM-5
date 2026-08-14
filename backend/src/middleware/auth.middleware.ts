import { Request, Response, NextFunction } from "express";
import { getUserModel } from "../config/db";

/**
 * Verifies the `Authorization: Bearer civicfix_session_<userId>_<ts>` token.
 *
 * Security: a token is only trusted when the embedded user id actually exists
 * as a verified account (never accepts a forged id), the issued timestamp is
 * sane (not in the future) and the session is younger than 30 days. On success
 * attaches `req.userId` + `req.userRole`. On failure returns 401.
 */
export interface AuthedRequest extends Request {
  userId?: string;
  userRole?: string;
}

const TOKEN_RE = /^civicfix_session_(.+)_(\d+)$/;
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const CLOCK_SKEW_MS = 60 * 1000;

export async function authMiddleware(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const token = match[1].trim();
  const tokenMatch = token.match(TOKEN_RE);
  if (!tokenMatch) {
    return res.status(401).json({ error: "Invalid session token." });
  }

  const [, userId, ts] = tokenMatch;
  const issuedAt = Number(ts);

  // Reject malformed/future tokens and long-expired sessions.
  if (!Number.isFinite(issuedAt) || issuedAt > Date.now() + CLOCK_SKEW_MS || Date.now() - issuedAt > MAX_AGE_MS) {
    return res.status(401).json({ error: "Session token expired. Please log in again." });
  }

  try {
    // The embedded id must correspond to a real, WhatsApp-verified account.
    const user = await getUserModel().findOne({ id: userId })?.lean();
    if (!user || user.verifiedWhatsApp !== true) {
      return res.status(401).json({ error: "Session token invalid." });
    }

    req.userId = user.id;
    req.userRole = user.role;
    next();
  } catch (err) {
    console.error("[AUTH] token validation failed:", err);
    return res.status(500).json({ error: "Authentication check failed." });
  }
}
