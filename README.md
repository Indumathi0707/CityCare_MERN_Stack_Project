                                                                      CityCare - Civic Issue Reporting System                                                                                      

<img width="1912" height="1012" alt="CityCare HomePage" src="https://github.com/user-attachments/assets/075aa605-a924-4e84-87d0-180ff1c9e38b" />

A full-stack MERN application that enables citizens to report civic issues and helps administrators manage and resolve them efficiently.

🚀 Live Demo
Frontend: http://localhost:5173
Backend API: http://localhost:5000

📋 Table of Contents
Features
Tech Stack
Screenshots
Installation
Environment Variables
API Endpoints
Usage
Project Structure
Contributing
License

✨ Features
👥 User Roles
Citizens: Report civic issues with images and track resolution status
Administrators: Manage all issues, update status, and analyze platform data

🔐 Authentication & Security
JWT-based authentication
Role-based access control (Citizen/Admin)
Secure admin registration with admin code
Password hashing with bcrypt

📱 Core Functionality
Issue Reporting: Report civic issues with categories (Road, Water, Electricity, etc.)
Image Upload: Drag & drop image upload with preview
Real-time Tracking: Track issue status from reported to resolved
Admin Dashboard: Comprehensive admin panel with analytics
Responsive Design: Mobile-first design that works on all devices

🛠️ Admin Features
View all reported issues with filtering
Update issue status (Reported → In Progress → Resolved → Closed)
Delete inappropriate issues
View platform statistics and analytics
Assign issues to team members

🛠️ Tech Stack

Frontend
React.js - UI framework
React Router - Client-side routing
Context API - State management
Axios - HTTP client
Tailwind CSS - Styling framework
Font Awesome - Icons

Backend
Node.js - Runtime environment
Express.js - Web framework
MongoDB - Database
Mongoose - ODM library
JWT - Authentication
bcryptjs - Password hashing
CORS - Cross-origin resource sharing

📸 Screenshots

Home Page

<img width="1912" height="1012" alt="CityCare HomePage" src="https://github.com/user-attachments/assets/2f008d2f-242d-444e-a1d5-e5e6890aa155" />

<img width="1918" height="910" alt="CityCare HomePage2" src="https://github.com/user-attachments/assets/633c4bf6-b7b7-42e4-9b9d-12a167c99ba7" />

<img width="1918" height="901" alt="CityCare HomePage3" src="https://github.com/user-attachments/assets/e4f93435-5f86-459e-91bc-033f206fbd41" />


Issue Reporting

<img width="1910" height="907" alt="CityCare IssuePage2" src="https://github.com/user-attachments/assets/782b0ef4-cbff-446a-9e15-abf9dd3f3538" />

<img width="1917" height="902" alt="CityCare IssuePage" src="https://github.com/user-attachments/assets/efec5e56-b33e-4ebd-bb52-a928c2a59cb8" />



Admin Dashboard

<img width="1908" height="928" alt="CityCare AdminPage" src="https://github.com/user-attachments/assets/63e23b39-521b-42a1-ba19-ea615adaf708" />

Login Page

<img width="1918" height="905" alt="CityCare LoginPage" src="https://github.com/user-attachments/assets/9270f0dd-7468-4f08-8c09-ae58dad48b20" />

Register Page

<img width="1917" height="912" alt="CityCare RegisterPage" src="https://github.com/user-attachments/assets/cab91f30-7895-4aed-9305-f17ae31e1776" />



🚀 Installation
Prerequisites
Node.js (v14 or higher)
MongoDB (local or Atlas)
npm or yarn

1. Clone the Repository
 
git clone https://github.com/your-username/citycare.git
cd citycare

2. Backend Setup
 
cd Backend
npm install

3. Frontend Setup

cd ../Frontend
npm install

4. Environment Configuration
 
Create .env file in Backend directory:

env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/citycare
JWT_SECRET=your_super_secret_jwt_key_here
ADMIN_REGISTRATION_CODE=ADMIN2024

⚙️ Environment Variables
Backend (.env)
Variable                  Description                    Default
NODE_ENV	                Environment mode	             development
PORT	                    Server port	                   5000
MONGODB_URI	              MongoDB connection string	     mongodb://localhost:27017/citycare
JWT_SECRET	              Secret key for JWT tokens	     -
ADMIN_REGISTRATION_CODE	  Code for admin registration	   ADMIN2024

🏃‍♂️ Running the Application
Start Backend Server

cd Backend
npm run dev
Server runs on: http://localhost:5000

Start Frontend Development Server

cd Frontend
npm run dev
Frontend runs on: http://localhost:5173

📡 API Endpoints

Authentication
Method	 Endpoint	            Description	             Access
POST	   /api/auth/register	  User registration	       Public
POST	   /api/auth/login	    User login	             Public
GET	     /api/auth/config	    Get auth configuration	 Public

Issues
Method	 Endpoint	                  Description	                 Access
POST	   /api/issues	              Create new issue	           Citizen
GET	     /api/issues/my-issues	    Get user's issues	           Citizen
GET	     /api/issues	              Get all issues	             Admin
GET	     /api/issues/stats	        Get platform statistics 	   Admin
PUT	     /api/issues/:id/status	    Update issue status	         Admin
PUT	     /api/issues/:id/assign	    Assign issue	               Admin
DELETE	 /api/issues/:id	          Delete issue	               Admin

📁 Project Structure

citycare/
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── issueController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Issue.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── issueRoutes.js
│   └── server.js
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md

🎯 Usage Guide

For Citizens:

Register/Login as a citizen
Report Issues using the report form with images
Track Progress in "My Issues" section
Receive Updates on issue resolution

For Administrators:

Register/Login as admin (requires admin code)
Access Dashboard to view all reported issues
Update Status of issues as they progress
Manage Issues with filtering and search
View Analytics for platform insights

🐛 Troubleshooting

Common Issues
MongoDB Connection Error
Ensure MongoDB is running
Check connection string in .env file
CORS Errors
Verify frontend URL is in CORS configuration
Check backend CORS settings
JWT Errors
Verify JWT secret in environment variables
Check token expiration
Image Upload Issues
Check file size limits
Verify image format support

👨‍💻 Developer

Indumathi Akula
Email: akula.indumathi13@gmail.com
GitHub: Indumathi0707

🙏 Acknowledgments

Icons by Font Awesome
UI components styled with Tailwind CSS
Built with MERN Stack

⭐ Star this repo if you found it helpful!
Last updated: November 2025
