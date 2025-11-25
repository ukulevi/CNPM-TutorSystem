# Tutor Support System

The Tutor Support System is a comprehensive platform designed to connect students with tutors (lecturers), enabling them to easily find academic support, schedule appointments, and manage learning materials.

The initial UI/UX design for the project is available on [Figma](https://www.figma.com/design/aPIXof5yJhs8YjZABkDoVs/Tutor-Support-System-Design).

## ✨ Key Features

-   **Profile Management:** Students and tutors can create and manage their personal profiles.
-   **Tutor Search:** Students can search for tutors by faculty and major.
-   **Appointment Scheduling:** Students can view tutor schedules and book appointments (online/offline).
-   **Document Management:** Users can upload and share educational materials.
-   **Tutor Evaluation:** Students can rate and leave feedback after a session.

## 🛠️ Tech Stack

The system is built with a decoupled client-server architecture.

### Frontend (`/frontend`)
-   **Library:** React
-   **Language:** TypeScript
-   **Build Tool:** Vite
-   **State Management:** React State & Context
-   **Styling:** Tailwind CSS & shadcn/ui

### Backend (`/backend`)
-   **Framework:** Node.js & Express
-   **Language:** TypeScript
-   **Database:** (Not yet integrated - have Prisma ORM which adaptable for future improvements with MongoDB, PostgreSQL, etc.)

## 📂 Project Structure

The project is organized as a monorepo with two primary components:

-   `TutorSupportSystem/`
    -   `backend/`: Contains the server-side source code, handling business logic and APIs.
    -   `frontend/`: Contains the source code for the client-side user interface.

Each directory (`frontend` and `backend`) is an independent Node.js project with its own dependencies and scripts.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18.x or later recommended)
-   `npm` (typically included with Node.js)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ukulevi/CNPM-TutorSystem.git
    cd CNPM-TutorSystem
    ```

2.  **Set up the Backend:**
    Navigate to the `backend` directory and install the required dependencies.
    ```sh
    cd backend
    npm install
    ```

3.  **Set up the Frontend:**
    Return to the root directory, then navigate to the `frontend` directory and install its dependencies.
    ```sh
    cd ../frontend
    npm install
    ```

### Running the Application

You will need two separate terminal windows to run both the backend and frontend servers concurrently.

1.  **Start the Backend Server:**
    In the `backend` directory, run the following command to start the API server. The server will automatically restart on code changes.
    ```sh
    cd backend
    npm run dev
    ```
    The server will be available at `http://localhost:3001`.

2.  **Start the Frontend Application:**
    In the `frontend` directory, run the following command to launch the user interface.
    ```sh
    cd frontend
    npm run dev
    ```
    Open your browser and navigate to the address provided (usually `http://localhost:3000`).
