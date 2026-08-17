import jwt from "jsonwebtoken";

/**
 * Single hardcoded owner account, sourced from env vars. This is the
 * "Basic Auth is fine" bar the brief sets, upgraded to a JWT so the
 * frontend doesn't need to re-send raw credentials on every request.
 *
 * Deliberately out of scope: multiple owner accounts, password reset,
 * role permissions. Documented as such in DECISIONS.md. If this were
 * going further than one owner + one bookkeeper sharing one login, an
 * Owner/User model with bcrypt-hashed passwords stored in Mongo (not env)
 * would replace this in about an hour of work.
 */
export function login(req, res) {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required." });
  }

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign({ sub: username, role: "owner" }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.json({ token, expiresIn: "12h" });
}
