"use strict";
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../types/user"));
const token_1 = require("../helpers/token");
const authUtils_1 = require("../helpers/authUtils");
const middleware_1 = require("./middleware");
const router = express_1.default.Router();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        // Finding user by username since it is unique
        const user = yield user_1.default.findOne({ username });
        console.log("user" + user);
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Comparing the provided password with the stored password
        const isMatch = yield (0, authUtils_1.comparePassword)(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate JWT token
        const token = yield (0, token_1.encodeAuthToken)(user.userId);
        console.log("token" + token);
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
        console.log(err);
    }
}));
router.get('/me', middleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield user_1.default.findOne({ userId }).select('-password');
        console.log(user);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.default = router;
