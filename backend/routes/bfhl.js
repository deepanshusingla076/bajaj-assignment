const express = require('express');
const router = express.Router();

const USER_ID = "deepanshu_singla_07062006";
const EMAIL = "deepanshusingla076@gmail.com";
const ROLL_NUMBER = "2310991645";

router.post('/', (req, res) => {
    try {
        const { data, file_b64 } = req.body;

        // ── Validate ─────────────────────────────────
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                user_id: USER_ID,
                error: "Invalid input: 'data' must be a non-empty array"
            });
        }

        // ── Separate numbers & alphabets ─────────────
        const numbers = [];
        const alphabets = [];

        for (const item of data) {
            const s = String(item).trim();
            if (/^\d+$/.test(s)) {
                numbers.push(s);
            } else if (/^[a-zA-Z]$/.test(s)) {
                alphabets.push(s);
            }
        }

        // ── Highest alphabet (case-insensitive) ──────
        let highest_lowercase_alphabet = [];
        if (alphabets.length > 0) {
            const highest = alphabets.reduce((best, curr) =>
                curr.toLowerCase() > best.toLowerCase() ? curr : best
            );
            highest_lowercase_alphabet = [highest];
        }

        const is_prime_found = numbers.some(n => isPrime(parseInt(n, 10)));

        // ── File handling (optional) ─────────────────
        let file_valid = false;
        let file_mime_type = null;
        let file_size_kb = null;

        if (file_b64 && typeof file_b64 === 'string' && file_b64.length > 0) {
            try {
                const buffer = Buffer.from(file_b64, 'base64');
                if (buffer.length > 0) {
                    file_valid = true;
                    file_size_kb = (buffer.length / 1024).toFixed(2);

                    // Detect MIME via magic bytes
                    const hex = buffer.slice(0, 8).toString('hex');
                    if (hex.startsWith('89504e47')) file_mime_type = 'image/png';
                    else if (hex.startsWith('ffd8ff')) file_mime_type = 'image/jpeg';
                    else if (hex.startsWith('25504446')) file_mime_type = 'application/pdf';
                    else if (hex.startsWith('504b0304')) file_mime_type = 'application/zip';
                    else if (hex.startsWith('47494638')) file_mime_type = 'image/gif';
                    else if (hex.startsWith('52494646')) file_mime_type = 'image/webp';
                    else file_mime_type = 'text/plain';
                }
            } catch (_) {
                file_valid = false;
            }
        }

        return res.status(200).json({
            is_success: true,
            user_id: USER_ID,
            email: EMAIL,
            roll_number: ROLL_NUMBER,
            numbers,
            alphabets,
            highest_lowercase_alphabet,
            is_prime_found,
            file_valid,
            file_mime_type,
            file_size_kb
        });

    } catch (err) {
        console.error('[POST /bfhl] Error:', err.message);
        return res.status(500).json({
            is_success: false,
            user_id: USER_ID,
            error: 'Internal server error'
        });
    }
});

router.get('/', (_req, res) => {
    return res.status(200).json({ operation_code: 1 });
});


function isPrime(n) {
    if (!Number.isInteger(n) || n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

module.exports = router;
