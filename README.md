Task Manager System

📌 Project Overview

Task Manager System is a MERN stack project that allows users to create, edit, update, delete, and manage tasks with status tracking. Users can also export tasks as PDF reports and utilize session-based authentication for secure access.

🚀 Features

User Authentication (Login, Register, Logout)

Task Management (Add, Edit, Delete, Update Status)

Task Status Tracking (Pending, In Progress, Completed)

Export Tasks as PDF

Session-based Authentication

Interactive Dashboard

Fully Responsive UI

🛠️ Tech Stack

Frontend: React.js, Bootstrap

Backend: Express.js, Node.js, EJS

Database: MongoDB

Authentication: Session-based (Express-Session, Connect-Mongo)

PDF Generation: PDFKit

📂 Project Structure

Task-Manager-System/
│── backend/                 # Backend (Node.js, Express, MongoDB)
│   ├── models/              # Database Models (User, Task)
│   ├── routes/              # API Routes (Auth, Task Management)
│   ├── views/               # EJS Views (Login, Dashboard, Tasks)
│   ├── public/              # Static Files (CSS, PDFs)
│   ├── config.js            # Database Configuration
│   ├── index.js             # Main Backend Entry Point
│── frontend/                # Frontend (React.js)
│   ├── src/
│   │   ├── components/      # Navbar, TaskForm, TaskList
│   │   ├── pages/           # Login, Register, Dashboard, Tasks
│   │   ├── App.js           # Main React App
│   ├── public/
│   ├── package.json
│── README.md                # Project Documentation

⚙️ Installation & Setup

🔹 Prerequisites

Node.js & npm

MongoDB (Local or Cloud - MongoDB Atlas)

🔹 Backend Setup

cd backend
npm install
npm start

🔹 Frontend Setup

cd frontend
npm install
npm start

🔹 Run MongoDB

Ensure MongoDB is running locally or use MongoDB Atlas with the correct connection string.

📌 Usage

Register/Login to access the system.

Create, Edit, and Delete tasks.

Update task status (Pending, In Progress, Completed).

Download task details as PDF.

🔥 API Endpoints

Method

Endpoint

Description

GET

/tasks

Fetch all tasks

POST

/tasks/add

Add a new task

POST

/tasks/edit/:id

Edit an existing task

POST

/tasks/update/:id

Update task status

POST

/tasks/delete/:id

Delete a task

GET

/tasks/export/pdf

Download all tasks as PDF

GET

/tasks/export/pdf/:id

Download a specific task as PDF

🎯 Future Enhancements

Email notifications for due tasks

Drag-and-drop task sorting

Task reminders & calendar integration

🤝 Contributors

Developer: Anish Sharma

