# Reflekt Architecture Overview

*Last updated: March 15, 2026*

## Overview

Reflekt is a full-stack journaling web application organized as a monorepo. The repository contains a React frontend for the user interface and an Express/Node.js backend for authentication, data access, and business logic. MongoDB is used for persistent storage through Mongoose models.

The implementation follows a modular architecture with clear separation between frontend presentation, backend services, and database models. This structure makes the project easier to understand, maintain, and extend.

---

# Monorepo Structure

```
.
├── docs/
│   ├── architecture.md
│   ├── uml-class-diagram.md
│   ├── images/
│   └── diagrams/
├── packages/
│   ├── express-backend/
│   │   ├── models/
│   │   │   ├── journal-entry.js
│   │   │   └── user.js
│   │   ├── services/
│   │   │   └── journal-service.js
│   │   ├── .env
│   │   ├── auth.js
│   │   ├── backend.js
│   │   ├── eslint.config.js
│   │   └── package.json
│   └── react-frontend/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── Calendar.jsx
│       │   ├── DailyPhotos.jsx
│       │   ├── EntryDetailsPage.jsx
│       │   ├── EntryModal.jsx
│       │   ├── HomeEditor.jsx
│       │   ├── Login.jsx
│       │   ├── MoodSelector.jsx
│       │   ├── MyApp.jsx
│       │   ├── NewEntryForm.jsx
│       │   ├── QuoteOfDay.jsx
│       │   ├── Table.jsx
│       │   └── main.jsx
│       ├── dist/
│       ├── node_modules/
│       └── package.json
└── README.md
```

### Module Organization

The project uses JavaScript ES module `import` and `export` statements to organize functionality across files. This allows different parts of the system (models, services, frontend components, and backend routes) to be developed and maintained independently while keeping clear module boundaries.

---


# Package Responsibilities

## packages/react-frontend

This package contains the client-side application built with React. It is responsible for rendering the user interface and handling user interaction.

### Key responsibilities

* displaying the journal interface
* handling login and authentication state
* rendering journal entries in different views
* allowing users to create, open, and edit entries
* supporting features such as mood selection and daily photos

### Important files and components

* **MyApp.jsx** : main application component and routing/state coordination
* **Login.jsx** : login interface
* **NewEntryForm.jsx** : entry creation form
* **EntryModal.jsx** and **EntryDetailsPage.jsx** : viewing/editing entry content
* **Calendar.jsx** and **Table.jsx** : alternative views for browsing entries
* **MoodSelector.jsx** : mood-related entry interaction
* **DailyPhotos.jsx** : photo-related journaling support

---

## packages/express-backend

This package contains the server-side application built with Express and Node.js. It exposes the backend functionality used by the frontend and manages authentication, request handling, and persistence.

### Key responsibilities

* processing authentication requests
* handling journal entry operations
* communicating with MongoDB
* validating and organizing business logic

### Important files

* **backend.js** : backend server setup and API entry point
* **auth.js** : authentication-related backend logic
* **models/user.js** : Mongoose model for user data
* **models/journal-entry.js** : Mongoose model for journal entry data
* **services/journal-service.js** : service logic related to entries

---

# Architectural Style

The final implementation follows an MVC-inspired structure.

### Model

The model layer is implemented through Mongoose schemas in the backend:

* user.js
* journal-entry.js

These define the structure of persisted application data.

### View

The view layer is implemented through React components in `packages/react-frontend/src`. These components display the interface and collect user input.

### Controller / Service Logic

The controller and service responsibilities are handled in the Express backend through files such as:

* backend.js
* auth.js
* services/journal-service.js

These modules receive requests, perform application logic, and interact with the models.

---

# Separation of Concerns

The project separates concerns across layers:

* the frontend is responsible for presentation and interaction
* the backend is responsible for request handling and application behavior
* the models are responsible for data definition and persistence

This organization improves readability and makes the codebase easier to maintain.

---

# API Design

The backend follows REST-style API design for core resources such as users and journal entries. The frontend communicates with the backend over HTTP and relies on the backend for authentication and entry management.

At a high level, the API supports:

* user registration and login
* creating journal entries
* retrieving entries
* updating entries
* deleting entries

---

### RESTful API Design

The backend follows RESTful API design principles where endpoints represent resources (nouns) rather than actions (verbs). HTTP methods are used to indicate the operation performed on each resource.

Example API endpoints include:

- `POST /users/register` – create a new user
- `POST /users/login` – authenticate a user
- `GET /entries` – retrieve journal entries
- `POST /entries` – create a new journal entry
- `PUT /entries/:id` – update an existing entry
- `DELETE /entries/:id` – delete an entry

This structure keeps the API consistent and easy to understand.

# Design Evolution

The original design for Reflekt included additional entities such as events, to-do lists, tasks, and activity tracking. During implementation, the project was narrowed to focus on the core journaling experience.

The final architecture centers on:

* **User**
* **Entry**

This change allowed the team to complete a more polished and functional implementation of the main journaling workflow within the project timeline.

---

# Summary

The Reflekt monorepo is organized into separate frontend and backend packages with clear responsibilities. The final implementation reflects a sound modular architecture, with a React view layer, an Express backend, and Mongoose data models. The codebase structure aligns with the implemented functionality and supports future extension if additional journaling features are added later.
