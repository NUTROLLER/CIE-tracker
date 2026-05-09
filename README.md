# CIE Tracking System

A full-stack Continuous Internal Evaluation (CIE) Tracking System for managing student academic records. 

## Features
- **Student Dashboard**: A dark-mode responsive UI to view subjects, CIE marks, and LA marks using visually appealing progress bars.
- **Admin Panel**: A management page to add, update, and delete student records.
- **REST API**: A robust Node.js and Express backend.
- **MySQL Database**: Persistent storage for students, subjects, and their corresponding marks.

## Tech Stack
- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) installed and running

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Database Setup
1. Open MySQL and create the database and tables using the provided `dbSetup.js` script. You will need to edit the script to match your local MySQL credentials if they differ from the default.
```bash
node dbSetup.js
```

### 4. Environment Variables
Create a `.env` file in the root directory and add your MySQL connection details:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cie_tracker
PORT=3000
```

### 5. Running the Application
Start the Express server:
```bash
node server.js
```
The application will be available at:
- **Dashboard**: `http://localhost:3000/`
- **Admin Panel**: `http://localhost:3000/admin.html`
