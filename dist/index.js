"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./services/db"));
const app = (0, express_1.default)();
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' ? 'https://your-frontend-app.herokuapp.com' : 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.urlencoded({ extended: true }))
app.use((0, cors_1.default)({ origin: true, credentials: true }));
const authRoute_1 = __importDefault(require("./auth/authRoute"));
dotenv_1.default.config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
});
const port = parseInt(process.env.PORT, 10); // Type assertion for safe conversion
// MongoDB Connection
(0, db_1.default)();
// Use the authRoutes for requests starting with /auth
app.use('/auth', authRoute_1.default); // Mount the authRoutes at /auth
// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong on the server' });
});
// Starting the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
