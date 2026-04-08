# MakeLife - NGO Management System

Welcome to the **MakeLife** repository! This is a comprehensive MERN (MongoDB, Express, React, Node.js) stack project designed to streamline and manage the operations of a Non-Governmental Organization (NGO).

## 🌍 About MakeLife

MakeLife is a platform dedicated to making NGO processes more efficient, transparent, and user-friendly. Focus areas include:

- **Volunteer Management:** Easy registration and management for people willing to donate their time and skills.
- **Donation Processing:** Secure and straightforward tracking of monetary and resource donations.
- **Data Persistence:** Robust backend data validation and storage ensuring all form submissions are consistently saved to the database without redundant data or empty fields.

## 🚀 Technologies Used

This project utilizes modern web technologies:

### Frontend
- **React.js** - Dynamic and responsive user interfaces.
- **Lucide-React** - Beautiful, consistent iconography.
- **CSS / Custom Styling** - Clean, professional, and accessible design.

### Backend
- **Node.js & Express.js** - Scalable server-side operations and API creation.
- **MongoDB** - NoSQL database for flexible data modeling and persistence.
- **Mongoose** - Elegant MongoDB object modeling for Node.js.

## 📁 Project Structure

The repository is modularized into `frontend` and `backend` directories to keep the separation of concerns clear and the codebase maintainable.

```
MakeLife/
├── backend/            # Express server, MongoDB models, and API routes
├── frontend/           # React application, components, and UI assets
└── README.md           # Project documentation
```

## 🛠️ Getting Started

To get a local copy up and running, follow these simple steps:

### Prerequisites

Ensure you have Node.js and MongoDB installed on your local machine.
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Paripoorna7/makelife-mern-project.git
   ```
2. Navigate into the project directory:
   ```sh
   cd makelife-mern-project
   ```

### Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```sh
   cd backend
   ```
2. Install the backend dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `backend` directory and add your connection strings (e.g., `MONGO_URI`).
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Open a new terminal instance and navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install the frontend dependencies:
   ```sh
   npm install
   ```
3. Start the application:
   ```sh
   npm start
   ```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
