import jwt from "jsonwebtoken";

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
