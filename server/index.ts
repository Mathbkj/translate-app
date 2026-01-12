import "./envLoader.ts";
import express from "express";
import cors from "cors";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcrypt";
import { supabase } from "./db/client.ts";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: [process.env.FRONTEND_URL!] }));

const textEncoder = new TextEncoder();
const secret = textEncoder.encode(process.env.JWT_SECRET!);

/* Middleware Function -> Check whether the user is allowed to access protected routes, in
 other wors, verify if the user is authenticated to access the protected resource*/
async function authToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
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
app.post(
  "/register",
  async (
    req: express.Request<
      never,
      never,
      { username: string; password: string },
      never
    >,
    res: express.Response
  ) => {
    const { username, password } = req.body;
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // Store the new user in the database
    const { error } = await supabase
      .from("users")
      .insert({ username, hashed_pass: hashedPassword });
    // If there's an error during registration, return an error message
    if (error) {
      return res.status(500).json({
        message: "Error registering user",
        error: "User already exists or another error ocurred.",
      });
    }
    res.status(201).json({ message: "User registered successfully" });
  }
);
// POST /login
app.post(
  "/login",
  async (
    req: express.Request<
      never,
      never,
      { username: string; password: string },
      never
    >,
    res: express.Response
  ) => {
    // Get the user login information
    const { username, password } = req.body;

    // Check whether the user exists in the database
    const { data: user } = await supabase
      .from("users")
      .select("username, hashed_pass")
      .eq("username", username.trim());
    // If the user does not exist, return an error with unauthorized status
    if (
      user?.length === 0 ||
      bcrypt.compareSync(password, user?.[0].hashed_pass.trim()) === false
    )
      return res.status(401).json({ message: "Invalid credentials" });
    // Generate a session token for the user, which expires in 15 minutes

    const token = await new SignJWT({ username })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(secret);

    res.json({ token });
  }
);
// GET /app
app.get("/app", authToken, (req, res) => {
  res.json({ message: "You have accessed a protected route" });
});
app.listen(process.env.PORT, (error) => {
  if (error) console.error(error.message);
});
