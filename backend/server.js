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
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;