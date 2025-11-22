# Setup Instructions for CEM Event Management

## Prerequisites
- Node.js (v18 or higher) installed
- Git installed
- MongoDB Compass installed
- Code editor (VS Code recommended)

---

## Step 1: Clone the Project

1. Open Command Prompt or PowerShell
2. Navigate to where you want the project:
   ```bash
   cd C:\Projects
   ```
3. Clone the repository:
   ```bash
   git clone https://github.com/Mufaris32/cem_event_management.git
   cd cem_event_management
   ```

---

## Step 2: Install Dependencies

In the project folder, run:
```bash
npm install
```

This will install all required packages (React, Express, MongoDB drivers, etc.)

---

## Step 3: Set Up MongoDB Compass

### A. Install MongoDB Compass
1. Download from: https://www.mongodb.com/try/download/compass
2. Install the application
3. Open MongoDB Compass

### B. Get MongoDB Connection String
Your friend will receive the MongoDB connection string from you via WhatsApp/Email (NEVER commit it to git).

The connection string looks like:
```
mongodb+srv://username:password@cluster.mongodb.net/cem_events?retryWrites=true&w=majority
```

### C. Connect to Database
1. Open MongoDB Compass
2. Click "New Connection"
3. Paste the connection string you received
4. Click "Connect"
5. You should see the `cem_events` database with collections:
   - `events`
   - `carousels`
   - `users`

### D. Browse Your Data
- Click on `events` collection to see all events
- You can view, edit, and search data using the GUI
- Use the filter bar to search: `{"title": "Demo Event"}`

---

## Step 4: Set Up Cloudinary

### A. Create Cloudinary Account
1. Go to: https://cloudinary.com/users/register_free
2. Sign up with email (or use Google/GitHub login)
3. Verify your email address
4. Log in to your dashboard

### B. Get Your Credentials
1. On the Cloudinary Dashboard homepage
2. You'll see a box titled "Account Details" or "Product Environment Credentials"
3. Note down these three values:
   - **Cloud Name**: (e.g., `dxxxxxxxx`)
   - **API Key**: (e.g., `123456789012345`)
   - **API Secret**: (e.g., `abcdefghijklmnopqrst`) - Click "Reveal" to see it

### C. Configure Upload Settings (Optional but Recommended)
1. Go to Settings → Upload
2. Enable "Unsigned uploading" if you want to upload without authentication
3. Create an upload preset:
   - Go to Settings → Upload → Upload presets
   - Click "Add upload preset"
   - Name it: `cem_events_preset`
   - Mode: Unsigned
   - Folder: `cem_events`
   - Save

---

## Step 5: Create Environment File

1. In the project root folder, create a new file named `.env`
2. Add the following content (replace with actual values):

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cem_events?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# JWT Secret (for admin authentication)
JWT_SECRET=your-secret-key-here-can-be-any-random-string

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Important Notes:
- Replace `username:password@cluster` with the actual MongoDB credentials
- Replace Cloudinary values with your dashboard credentials
- For `JWT_SECRET`, use any random long string (e.g., `mySecretKey123!@#`)
- **NEVER commit this .env file to git** (it's already in .gitignore)

---

## Step 6: Run the Project

You need to run TWO terminals simultaneously:

### Terminal 1 - Backend Server
```bash
npm run server
```

You should see:
```
Server is running on port 5000
MongoDB Connected Successfully
```

### Terminal 2 - Frontend Development Server
Open a NEW terminal in the same folder:
```bash
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

---

## Step 7: Access the Application

1. Open your browser
2. Go to: http://localhost:5173
3. You should see the CEM Event Management homepage

### Admin Access:
- URL: http://localhost:5173/admin/login
- Username: Check with the project owner
- Password: Check with the project owner

---

## Step 8: Test Everything

### Test 1: View Events
1. Go to Events page
2. You should see existing events from the database

### Test 2: View Gallery
1. Click on any past event
2. Gallery should load with images from Cloudinary

### Test 3: Admin Upload (If you have admin access)
1. Log in to admin dashboard
2. Create a new test event
3. Upload an image
4. Check if it appears in Cloudinary dashboard
5. Check if it appears on the website

---

## Troubleshooting

### MongoDB Compass won't connect
- Check if the connection string is correct
- Ensure your IP address is whitelisted in MongoDB Atlas
  - Go to: cloud.mongodb.com → Network Access
  - Add your IP or use `0.0.0.0/0` (allow from anywhere)

### Cloudinary uploads fail
- Verify all three credentials (Cloud Name, API Key, API Secret)
- Check if the API Secret is copied correctly (no extra spaces)
- Ensure your Cloudinary account is active

### Port 5000 or 5173 already in use
- Close any other applications using these ports
- Or change the PORT in .env file

### Module not found errors
- Run `npm install` again
- Delete `node_modules` folder and `package-lock.json`
- Run `npm install` fresh

---

## Project Structure Reference

```
cem_event_management/
├── src/                    # Frontend React code
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   ├── services/          # API calls
│   └── utils/             # Helper functions
├── routes/                # Backend API routes
├── models/                # MongoDB schemas
├── scripts/               # Utility scripts
├── .env                   # Environment variables (CREATE THIS)
├── server.js              # Backend server
└── package.json           # Dependencies
```

---

## Need Help?

Contact the project owner if you encounter:
- MongoDB connection issues
- Cloudinary credential problems
- Any errors during installation or running

---

## Security Reminders

✅ **DO:**
- Keep your `.env` file private
- Use MongoDB Compass to view data safely
- Rotate credentials periodically

❌ **DON'T:**
- Commit `.env` to git
- Share credentials publicly
- Use the same password everywhere
