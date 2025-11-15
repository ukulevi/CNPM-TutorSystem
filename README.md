# Tutor Support System Design

This is the source code repository for the **Tutor Support System** project. The system is designed to connect students with tutors (lecturers), making it easy for students to find academic support, book appointments, and manage learning materials.

The original UI design for the project is available on [Figma](https://www.figma.com/design/aPIXof5yJhs8YjZABkDoVs/Tutor-Support-System-Design).

## ✨ Key Features

Based on the sample data, the system includes the following features:
-   **Profile Management:** Students and tutors can create and manage their personal profiles.
-   **Tutor Search:** Students can search for tutors by department and specialization.
-   **Appointment Booking:** Students can view schedules and book appointments (online/offline) with tutors.
-   **Document Management:** Users can upload and share learning materials.
-   **Tutor Evaluation:** Students can rate and leave feedback after an appointment.

## 🛠️ Tech Stack

### Frontend
-   **Framework:** React
-   **Routing:** React Router
-   **Styling:** CSS Modules, Tailwind CSS

### Backend
-   **Mock API:** json-server

### Development
-   **Package Manager:** npm
-   **Build Tool:** Vite
-   **Linting:** ESLint

## 🚀 Getting Started

### Prerequisites

-   Node.js (version 16.x or later)
-   `npm`

### Installation

1.  Clone this repository to your local machine:
    ```sh
    git clone https://github.com/ukulevi/CNPM-TutorSystem.git
    ```
2.  Navigate to the project directory and install the dependencies:
    ```sh
    cd CNPM-TutorSystem
    npm i
    ```

### Running the Project

1.  **Start the Backend (API Server):**
    Open a terminal and run the following command in the `backend` directory to start `json-server`.
    ```sh
    npm run dev
    ```
    The API will be available at `http://localhost:3001` (or the configured port).

2.  **Start the Frontend (User Interface):**
    Open another terminal and run the following command in the `frontend` directory.
    ```sh
    npm run dev
    ```
    Then, open your browser and navigate to the provided address (usually `http://localhost:3000` or similar).
