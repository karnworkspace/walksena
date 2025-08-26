"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const walkIn_1 = __importDefault(require("./routes/walkIn"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API routes
app.use('/api/walkin', walkIn_1.default);
// Serve React frontend static files
const frontendPath = path_1.default.join(__dirname, '../../walk-in-form/build');
app.use(express_1.default.static(frontendPath));
// API health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Walk-in Form API is running!' });
});
// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(frontendPath, 'index.html'));
});
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📁 Serving frontend from: ${frontendPath}`);
});
