const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const socketManager = require('./sockets/socketManager');
const errorMiddleware = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:5178',
    process.env.FRONTEND_URL
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV !== 'production') {
            return callback(null, true); // Allow all in dev if not in list
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

// Main Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/channels', require('./routes/channelRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f8fafc;">
            <h1 style="color: #2563eb;">CollabSphere API</h1>
            <p style="color: #64748b;">The backend server is running successfully in <b>${process.env.NODE_ENV}</b> mode.</p>
            <a href="/api/health" style="color: #2563eb; text-decoration: none; border: 1px solid #2563eb; padding: 10px 20px; border-radius: 8px;">Check Health Status</a>
        </div>
    `);
});

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Platform is up and running' });
});

// Socket.io initialization
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? 'https://collabsphere.example.com' : 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});
socketManager(io);

// Error Handling Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
