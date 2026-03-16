This repository will have the frontend and backend code for my
app for CSC 307.

# Project Blurb

Reflekt is a web-based journaling application designed to help
users capture and reflect on their daily experiences in a simple
and organized way. The app allows users to create, edit, and
manage personal journal entries while tracking moods and
attaching daily photos to better document their reflections.
Reflekt provides an intuitive interface for browsing entries
through both table and calendar views, making it easy for users
to revisit past thoughts and experiences. The application is
built using a React frontend, an Express/Node.js backend, and
MongoDB for data storage, following a RESTful API architecture
and modular code structure.

UI Prototype

<video src="CSC-307-TEAM-PIXELS/mid-fi_Prototype.mov" width="320" height="240" controls></video>

# Development Environment Setup

The following instructions describe how to set up the Reflekt
development environment locally.

## Prerequisites

Before starting, make sure the following software is installed:

Node.js (v18 or newer) https://nodejs.org

npm (comes with Node.js)

Git https://git-scm.com

MongoDB Atlas account (or local MongoDB instance)
https://www.mongodb.com

VS Code (recommended editor) https://code.visualstudio.com

## 1. Clone the Repository

## 2. Install Dependencies

Install backend dependencies:

cd backend npm install

Install frontend dependencies:

cd ../frontend npm install

## 3. Configure Environment Variables

Create a .env file inside the backend directory.

Example .env file:

MONGO_CONNECTION_STRING=your_mongodb_connection_string
TOKEN_SECRET=your_secret_key

These variables configure the backend server and database
connection.

## 4. Start the Backend Server

From the backend directory:

npm start

The backend API should start on:

http://localhost:8000

## 5. Start the Frontend

Open a new terminal and navigate to the frontend directory:

cd frontend npm start

The React development server will start on:

http://localhost:5173

## 6. Running the Application

Once both servers are running:

Backend API → http://localhost:8000

Frontend app → http://localhost:5173

Open the frontend URL in a browser to access the Reflekt journal application.

# Architecture Documentation

Project architecture documentation can be found in the `docs` folder.

- [Architecture Overview](docs/architecture.md)
- [UML Class Diagram](docs/uml-class-diagram.md)




https://www.websequencediagrams.com/?png=msc543954272&filename=Exported.png<img width="947" height="748" alt="image" src="https://github.com/user-attachments/assets/08d5dd5d-e90a-4fad-aad5-e26bf602a312" />

https://www.websequencediagrams.com/?png=msc1632674586&filename=Exported.png<img width="1040" height="687" alt="image" src="https://github.com/user-attachments/assets/5d8474c3-d1ea-4f30-8d25-94cee46e8e2a" />

https://www.websequencediagrams.com/?png=msc822311504&filename=Exported.png<img width="777" height="619" alt="image" src="https://github.com/user-attachments/assets/d6529aa1-ff61-42d1-a406-1adadfaafeb5" />
