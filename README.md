# Lunar Observation Journal

## Setup Guide

1. **Instal Node.js**

   - Download and install from [nodejs.org](https://nodejs.org/)
   - Verify installation with `node --version` in your terminal

2. **Instal dependencies**:

   ```bash
   npm install
   ```

3. **Aquire OpenWeather API key**

   - Go to [openweathermap.org](https://home.openweathermap.org/)
   - Sign up for a free account and obtain an API key
   - Create `.env` file in the root folder
   - Inside the file insert the following line:

   ```bash
   OPENWEATHER_API_KEY=your_key
   ```

4. **Run the application**:

   ```bash
   npm start
   ```

5. **Access the app**:
   - Open `http://localhost:3000` in your browser
   - The database will be created automatically on first run.
