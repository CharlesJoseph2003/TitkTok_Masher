# URL Sender Application

A simple full-stack application with a Python Flask backend and React frontend that allows users to submit URLs.

## Project Structure
```
.
├── backend/
│   ├── app.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── App.css
    └── package.json
```

## Setup Instructions

### Backend Setup
1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Run the Flask server:
   ```bash
   python app.py
   ```
   The server will run on http://localhost:5000

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

## Usage
1. Enter a URL in the input field
2. Click "Send URL"
3. The response from the server will be displayed below the form
