require("./envLoader.js");
var express = require("express");
var cors = require("cors");
var jwtVerify = require("jose").jwtVerify;
var SignJWT = require("jose").SignJWT;
var bcrypt = require("bcrypt");
var supabase = require("./db/client.js").supabase;
var app = express();

// CORS and JSON parsing must come before any routes
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

const textEncoder = new TextEncoder();
const secret = textEncoder.encode(process.env.JWT_SECRET);

/* Middleware Function -> Check whether the user is allowed to access protected routes, in
 other words, verify if the user is authenticated to access the protected resource*/
async function authToken(req, res, next) {
  //Get the token from the authorization header
  const authHeader = req.headers["authorization"];
  // The token is usually sent as "Bearer <token>", so split by space and get the second part
  const token = authHeader?.split(" ")[1];
  // If no token is provided or has expired, return an unauthorized error
  if (!token)
    return res
      .status(401)
      .json({ message: "Unauthorized Access or Expired Login" });
  // Verify the token using the secret key
  await jwtVerify(token, secret);
  // If the token is valid, proceed to the next middleware or route handler
  next();
}
//POST /register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(password.trim(), 10);
  // Store the new user in the database
  const { error } = await supabase
    .from("users")
    .insert({ username: username.trim(), hashed_pass: hashedPassword });
  // If there's an error during registration, return an error message
  if (error) {
    return res.status(409).json({
      message:
        "One of the credentials is already taken or the server might be experiencing issues",
    });
  }
  res.status(201).json({ message: "User registered successfully" });
});
// POST /login
app.post("/login", async (req, res) => {
  // Get the user login information
  const { username, password } = req.body;
  // Check whether the user exists in the database
  const { data: user } = await supabase
    .from("users")
    .select("username, hashed_pass")
    .eq("username", username.trim())
    .single();
  // If the user does not exist, return an error with unauthorized status
  if (!user) return res.status(401).json({ message: "Invalid user" });

  // Compare password using await
  const isSame = await bcrypt.compare(password.trim(), user.hashed_pass);
  if (!isSame) return res.status(401).json({ message: "Invalid password" });

  // Generate a session token for the user, which expires in 15 minutes
  const token = await new SignJWT({ username: user.username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(secret);

  res.status(200).json({ token, message: "Login successful" });
});
// POST /reset-password
app.post("/reset-password", async (req, res) => {
  const { username, newPassword } = req.body;

  // Check if user exists
  const { data: user, error: fetchError } = await supabase
    .from("users")
    .select("username")
    .eq("username", username.trim())
    .single();

  if (!user || fetchError) {
    return res.status(404).json({ message: "User not found" });
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);

  // Update the password in the database
  const { error: updateError } = await supabase
    .from("users")
    .update({ hashed_pass: hashedPassword })
    .eq("username", username.trim());

  if (updateError) {
    return res.status(500).json({
      message: "Failed to reset password. Please try again.",
    });
  }

  res.status(200).json({ message: "Password reset successfully" });
});
// POST /logout
app.post("/logout", authToken, (req, res) => {
  req.logOut();
  res.status(200).json({ message: "Logout successful" });
});
// GET /verify
app.get("/verify", authToken, (_req, res) => {
  res.status(200).json({ message: "Token succesfully validated" });
});
app.listen(process.env.PORT, (error) => {
  if (error) console.error(error.message);
});
