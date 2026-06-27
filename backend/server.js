const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // allow large base64 files

// ─── Routes ──────────────────────────────────────────
app.use('/bfhl', require('./routes/bfhl'));

// ─── Health check ────────────────────────────────────
app.get('/', (req, res) => {
    res.json({ status: 'BFHL API running', port: PORT });
});

// ─── Start ───────────────────────────────────────────
const server = app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`   POST http://localhost:${PORT}/bfhl`);
    console.log(`   GET  http://localhost:${PORT}/bfhl`);
    console.log('   Press Ctrl+C to stop.\n');
});

// Handle port-in-use error clearly
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ Port ${PORT} is already in use.`);
        console.error(`   Run this to free it: npx kill-port ${PORT}`);
        console.error(`   Or set a different port: PORT=3001 npm start\n`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

module.exports = app;