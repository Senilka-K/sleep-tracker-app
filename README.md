# Sleep Tracker App
Welcome to the Sleep Tracker App, a mobile app that can track user's sleep pattern and generates statistics.


## Features

- **Sleep Quality Predictor**: Allows users to find the quality of there sleep.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following tools installed:
- Node.js
- npm (Node Package Manager)
- Expo CLI for running the mobile app

```
npm install -g expo-cli
```

### Installation

1. **Clone the Repository**

   Start by cloning the repository to your local machine:

   ```
   git clone <repository-url>
   cd sleep-tracker-app
   ```

   Replace `<repository-url>` with the actual URL of the repository.

2. **Backend Setup**

   Navigate to the Backend directory, copy the example environment file, and set up the environment:

   ```
   cd Backend
   cp .env.example .env
   nano .env  # Edit the .env file with the required secrets
   npm install
   node server.js
   ```
3. **Ngrok Setup**

   - Create an ngrok account using ngrok (website|https://ngrok.com)
   - Copy the static domain of your account
   - Run the following command in a terminal to initiate ngrok
      ```
      ngrok http -hostname=your-custom-subdomain.ngrok.io <PORT>
      ```
      Replace `<PORT>` with the actual port number your server is running on.

4. **Mobile App Setup**

   Prepare and run the mobile application:

   ```
   cd ../SleepTrackerApp
   cp .env.example .env
   npm install
   npx expo start
   ```

   Use Expo to access the app on your device or emulator.
