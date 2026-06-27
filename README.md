# 🏥 Bajaj Finserv Health — Full Stack Challenge

A full-stack submission for the **Bajaj Finserv Health Dev Challenge**, consisting of a Node.js/Express REST API backend and a vanilla HTML/CSS/JS frontend.

---

## 📁 Project Structure

```
bajaj/
├── backend/
│   ├── routes/
│   │   └── bfhl.js        # POST & GET /bfhl route handler
│   ├── server.js           # Express app entry point
│   ├── package.json
│   └── .gitignore
└── frontend/
    ├── index.html          # Single-page UI
    ├── style.css           # Premium dark-mode design
    └── app.js              # API calls, filtering, rendering
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v14+
- npm

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Start the backend server

```bash
npm start
```

The server will start at **http://localhost:5000**

```
✅ Server running on http://localhost:5000
   POST http://localhost:5000/bfhl
   GET  http://localhost:5000/bfhl
   Press Ctrl+C to stop.
```

### 3. Open the frontend

Open `frontend/index.html` directly in your browser — no build step needed.

> If you get a CORS error, make sure the backend is running first.

---

## 🔌 API Reference

### `POST /bfhl`

Processes an array of mixed data and separates numbers, alphabets, and finds the highest alphabet.

**Request Body:**
```json
{
  "data": ["A", "C", "z", "1", "2", "3"],
  "file_b64": "<optional base64 encoded file string>"
}
```

**Success Response (`200 OK`):**
```json
{
  "is_success": true,
  "user_id": "deepanshu_singla_07062006",
  "email": "deepanshusingla076@gmail.com",
  "roll_number": "2310991645",
  "numbers": ["1", "2", "3"],
  "alphabets": ["A", "C", "z"],
  "highest_lowercase_alphabet": ["z"],
  "is_prime_found": true,
  "file_valid": false,
  "file_mime_type": null,
  "file_size_kb": null
}
```

**Error Response (`400 Bad Request`):**
```json
{
  "is_success": false,
  "user_id": "deepanshu_singla_07062006",
  "error": "Invalid input: 'data' must be a non-empty array"
}
```

---

### `GET /bfhl`

Returns the operation code.

**Response (`200 OK`):**
```json
{
  "operation_code": 1
}
```

---

## 💡 Processing Rules

| Input Type | Condition | Example |
|---|---|---|
| **Number** | String matches `/^\d+$/` | `"1"`, `"23"` |
| **Alphabet** | Single character `[a-zA-Z]` | `"A"`, `"z"` |
| **Highest alphabet** | Lexicographically greatest (case-insensitive) | From `["A","C","z"]` → `["z"]` |
| **Prime found** | Any number in array is prime | `"2"`, `"3"`, `"7"` → `true` |

---

## 🗂️ File Upload (Base64)

If `file_b64` is provided in the request body:

| Field | Description |
|---|---|
| `file_valid` | `true` if file decoded successfully |
| `file_mime_type` | Detected from magic bytes (`image/png`, `image/jpeg`, `application/pdf`, etc.) |
| `file_size_kb` | Size of the decoded file in KB |

---

## 🎨 Frontend Features

- **JSON Input** — paste any valid `{ "data": [...] }` JSON
- **File Attach** — drag & drop or click to attach a file (sent as base64)
- **Multi-select Filter** — `<select multiple>` dropdown to choose which fields to display:
  - Numbers
  - Alphabets
  - Highest Alphabet
  - Prime Found
  - File Info
- **Keyboard shortcut** — `Ctrl+Enter` to submit
- **Dark mode** premium UI with smooth animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express 5, CORS |
| Frontend | HTML5, Vanilla CSS, Vanilla JS |
| API | REST, JSON |

---

## ✅ Checklist

- [x] `POST /bfhl` returns all required fields
- [x] `GET /bfhl` returns `{ operation_code: 1 }`
- [x] CORS enabled on backend
- [x] File base64 handling with MIME detection
- [x] Frontend multi-select filter (dropdown)
- [x] Input validation with error messages
- [x] GitHub repository is public

---

## 👤 Author

**Deepanshu Singla**  
Roll No: `2310991645`  
Email: `deepanshusingla076@gmail.com`
