# How to Run FarmerZ App in Visual Studio Code

This guide will help you set up and run the FarmerZ agricultural management platform on your local machine using Visual Studio Code after downloading the project as a zip file.

## Prerequisites

Before starting, you need to install the following software on your computer:

### 1. Download and Install Node.js
- Go to [https://nodejs.org/](https://nodejs.org/)
- Download the **LTS version** (recommended for most users)
- Run the installer and follow the installation steps
- **Important**: Make sure to check "Add to PATH" during installation

### 2. Download and Install Visual Studio Code
- Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
- Download the version for your operating system (Windows/Mac/Linux)
- Install Visual Studio Code with default settings

### 3. Download and Install Git (Optional but Recommended)
- Go to [https://git-scm.com/downloads](https://git-scm.com/downloads)
- Download and install Git for your operating system
- This helps with version control and future updates

## Step-by-Step Setup Instructions

### Step 1: Extract the Project Files
1. Download the FarmerZ project as a zip file
2. Right-click on the zip file and select "Extract All" (Windows) or double-click (Mac)
3. Choose a location on your computer (e.g., Desktop or Documents folder)
4. Remember the folder location for the next step

### Step 2: Open Project in Visual Studio Code
1. Open Visual Studio Code
2. Click on "File" → "Open Folder" (or press `Ctrl+K, Ctrl+O`)
3. Navigate to the extracted FarmerZ folder and select it
4. Click "Select Folder" to open the project

### Step 3: Open Terminal in VS Code
1. In Visual Studio Code, go to "Terminal" → "New Terminal" (or press `Ctrl+` )
2. A terminal window will open at the bottom of VS Code
3. Make sure you're in the project folder (you should see files like package.json)

### Step 4: Verify Node.js Installation
In the terminal, type these commands one by one and press Enter:

```bash
node --version
```
You should see something like `v18.17.0` or higher

```bash
npm --version
```
You should see something like `9.6.7` or higher

If you get "command not found" errors, restart VS Code and try again. If still not working, reinstall Node.js.

### Step 5: Install Project Dependencies
In the terminal, run this command:

```bash
npm install
```

**What this does**: Downloads all the required libraries and packages for the app
**Wait time**: This may take 2-5 minutes depending on your internet speed
**What you'll see**: Lots of text scrolling as packages are downloaded

### Step 6: Set Up Database (Optional - for basic testing)
The app can run with in-memory storage for testing. For production use, you'll need a PostgreSQL database.

**For Testing Only**: Skip this step - the app will use memory storage

**For Production Setup**:
1. Create a `.env` file in the project root
2. Add your database connection string:
```
DATABASE_URL=your_postgresql_connection_string_here
```

### Step 7: Start the Development Server
In the terminal, run:

```bash
npm run dev
```

**What this does**: Starts both the backend server and frontend development server
**Wait time**: 10-30 seconds
**Success message**: You should see "serving on port 5000"

### Step 8: Open the App in Your Browser
1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to: `http://localhost:5000`
3. You should see the FarmerZ app home page

## Troubleshooting Common Issues

### Issue 1: "npm command not found"
**Solution**: 
- Restart your computer after installing Node.js
- Make sure you installed Node.js correctly with "Add to PATH" checked

### Issue 2: "Port 5000 is already in use"
**Solution**:
- Close any other applications using port 5000
- Or change the port by setting `PORT=3000` in the terminal before running npm run dev

### Issue 3: "Module not found" errors
**Solution**:
- Delete the `node_modules` folder
- Run `npm install` again
- Make sure you have stable internet connection

### Issue 4: Browser shows "Cannot connect"
**Solution**:
- Make sure the terminal shows "serving on port 5000"
- Try `http://127.0.0.1:5000` instead
- Check if your firewall is blocking the connection

### Issue 5: App loads but features don't work
**Solution**:
- Clear your browser cache (Ctrl+F5)
- Make sure JavaScript is enabled in your browser
- Try a different browser

## Understanding the Project Structure

When you open the project in VS Code, you'll see these main folders:

```
farmerz/
├── client/                 # Frontend React application
│   ├── src/               # Source code for the web interface
│   └── public/            # Static files (images, icons)
├── server/                # Backend Express.js API
├── shared/                # Shared code between frontend and backend
├── node_modules/          # Installed dependencies (auto-generated)
├── package.json           # Project configuration and dependencies
└── README.md             # Project documentation
```

## Development Commands

Once the project is set up, you can use these commands in the terminal:

### Start Development Server
```bash
npm run dev
```
Starts the app in development mode with hot reloading

### Build for Production
```bash
npm run build
```
Creates an optimized production build

### Database Commands (if using PostgreSQL)
```bash
npm run db:generate    # Generate database migrations
npm run db:push        # Apply changes to database
npm run db:studio      # Open database management interface
```

## Recommended VS Code Extensions

Install these extensions to improve your development experience:

1. **ES7+ React/Redux/React-Native snippets** - React code snippets
2. **Prettier - Code formatter** - Auto-formats your code
3. **Auto Rename Tag** - Automatically renames HTML/JSX tags
4. **Bracket Pair Colorizer** - Makes matching brackets colorful
5. **GitLens** - Enhanced Git capabilities
6. **Thunder Client** - API testing tool

To install extensions:
1. Click the Extensions icon in VS Code sidebar (four squares)
2. Search for extension name
3. Click "Install"

## Making Changes to the Code

### Frontend Changes (User Interface)
- Edit files in `client/src/` folder
- Changes will automatically reload in the browser
- Main files:
  - `client/src/App.tsx` - Main application component
  - `client/src/pages/` - Different app pages
  - `client/src/components/` - Reusable UI components

### Backend Changes (Server Logic)
- Edit files in `server/` folder
- Server will automatically restart when you save changes
- Main files:
  - `server/index.ts` - Main server file
  - `server/routes.ts` - API endpoints
  - `server/storage.ts` - Database operations

### Adding New Features
1. For new pages: Add to `client/src/pages/`
2. For new API endpoints: Add to `server/routes.ts`
3. For database changes: Modify `shared/schema.ts`

## Stopping the Application

To stop the development server:
1. Go to the terminal in VS Code
2. Press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac)
3. Type `y` if prompted to confirm

## Next Steps After Setup

1. **Explore the App**: Navigate through all the features to understand the functionality
2. **Check the Code**: Look at the main files to understand the structure
3. **Read Documentation**: Review `README.md` and `RESEARCH_PAPER.md` for detailed information
4. **Start Developing**: Make small changes to see how the system works
5. **Test Features**: Try the voice assistant, language switching, and form submissions

## Getting Help

If you encounter issues not covered in this guide:

1. **Check the Console**: Press F12 in your browser to see error messages
2. **Check Terminal**: Look for error messages in the VS Code terminal
3. **Google the Error**: Copy exact error messages and search online
4. **Stack Overflow**: Great resource for specific programming questions
5. **GitHub Issues**: Check if others have had similar problems

## Important Notes

- **Internet Required**: Initial setup requires internet to download packages
- **Modern Browser**: Use Chrome, Firefox, Safari, or Edge (avoid Internet Explorer)
- **Computer Performance**: The app uses moderate system resources
- **File Changes**: Always save files (Ctrl+S) before testing changes
- **Database**: For production use, set up a proper PostgreSQL database

## Quick Start Checklist

- [ ] Node.js installed (v18 or higher)
- [ ] Visual Studio Code installed
- [ ] Project extracted from zip file
- [ ] Project opened in VS Code
- [ ] Terminal opened in VS Code
- [ ] `npm install` completed successfully
- [ ] `npm run dev` running without errors
- [ ] Browser shows app at localhost:5000
- [ ] All features working (language switch, voice assistant, navigation)

**Congratulations!** You now have the FarmerZ agricultural management platform running on your local machine. You can start exploring the code and adding new features.

---

**Support**: If you need help with specific agricultural features or technical implementation, refer to the RESEARCH_PAPER.md and README.md files for detailed documentation.