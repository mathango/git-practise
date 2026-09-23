# Product Trac

A simple product inventory management application.

## Project Structure

- `backend/` - FastAPI API and SQLite database
- `frontend/` - React and Vite user interface

## Run the Backend

From the project root:

```bash
cd backend
pip install fastapi uvicorn sqlalchemy pydantic
uvicorn main:app --reload
```

The API runs at `http://localhost:8000`.

## Run the Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Features

- Add products
- View products
- Edit products
- Delete products
- Store product data in SQLite
