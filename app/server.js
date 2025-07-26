import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { PORT, URI } from "./config/index.js";
import Router from "./routes/index.js";

// === 1 - CREATE SERVER ===
const server = express();

// CONFIGURE HEADER INFORMATION
// Allow request from any source. In real production, this should be limited to allowed origins only
server.use(cors({
    origin: ['http://localhost:4200/'], // Replace with your frontend domain
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
server.disable("x-powered-by"); // Reduce fingerprinting
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// Middleware to set Access-Control-Expose-Headers
server.use((req, res, next) => {
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
    next();
});

// === 2 - CONNECT DATABASE ===
// Set up mongoose's promise to global promise
mongoose.promise = global.Promise;
mongoose.set("strictQuery", false);
mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log("Connected to database"))
    .catch((err) => console.log(err));

// === 3 - CONFIGURE ROUTES ===
// Connect Route handler to server
Router(server);

// === 4 - START UP SERVER ===
server.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);