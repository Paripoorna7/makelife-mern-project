MakeLife - NGO Management System
Welcome to the MakeLife repository! This is a comprehensive MERN (MongoDB, Express, React, Node.js) stack project designed to streamline and manage the operations of a Non-Governmental Organization (NGO).

🌍 About MakeLife
MakeLife is a platform dedicated to making NGO processes more efficient, transparent, and user-friendly. Focus areas include:

Child Profiles: Add, update, and manage children available for sponsorship or adoption.
Volunteer Management: Easy registration and management for people willing to donate their time and skills.
Donation Processing: Secure and straightforward tracking of monetary and goods donations.
Adoption Requests: Submit and manage adoption applications with status tracking.
Team Members: Manage NGO team profiles with photos.
Founder Story: Editable founder story section for the public website.
Slideshow: Upload and manage homepage slideshow images.
Contact Messages: Receive and manage public contact form submissions.
Admin Dashboard: Secure admin panel to manage all data in one place.
Data Persistence: Robust backend with MongoDB Atlas ensuring all data persists across sessions.
🚀 Technologies Used
Frontend
React.js - Dynamic and responsive user interfaces.
Lucide-React - Beautiful, consistent iconography.
CSS / Custom Styling - Clean, professional, and accessible design.
Backend
Node.js & Express.js - Scalable server-side operations and API creation.
MongoDB Atlas - Cloud-hosted NoSQL database for flexible data modeling and persistence.
Mongoose - Elegant MongoDB object modeling for Node.js.
Cloudinary - Cloud image storage for all uploaded photos.
Multer + multer-storage-cloudinary - Multipart file upload handling.
bcryptjs + JWT - Secure authentication.
📁 Project Structure
MakeLife/
├── backend/
│   ├── config/         # Cloudinary configuration
│   ├── models/         # Mongoose models
│   ├── routes/         # Express API routes
│   ├── uploads/        # Temporary local upload folder
│   ├── server.js       # Express app entry point
│   └── .env            # Environment variables (not committed)
├── frontend/
│   ├── src/
│   │   └── App.js      # Full React single-page application
│   └── public/
└── README.md
🛠️ Running Locally
Prerequisites
Node.js v16+
A MongoDB Atlas account
A Cloudinary account
1. Clone the repository
git clone https://github.com/Paripoorna7/makelife-mern-project.git
cd makelife-mern-project
2. Backend Setup
cd backend
npm install
Create a .env file inside the backend/ folder:

PORT=3001
MONGO_URI=your_mongodb_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
Start the backend:

npm start
Backend runs on http://localhost:3001

3. Frontend Setup
cd ../frontend
npm install
Create a .env file inside the frontend/ folder:

REACT_APP_API_URL=http://localhost:3001
Start the frontend:

npm start
Frontend runs on http://localhost:3000

🔐 Admin Access
Navigate to http://localhost:3000 → click Admin in the navbar.

Default credentials:

Username: admin
Password: admin123
🤝 Contributing
Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
