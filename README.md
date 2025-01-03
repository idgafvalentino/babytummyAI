# Pregnancy Nutrition Tracker

A private, mobile-friendly web application for tracking pregnancy nutrition.

## Setup Instructions

### 1. Create a GitHub Repository

1. Create a new private repository on GitHub
2. Push this code to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-repo-url
   git push -u origin main
   ```

### 2. Configure Access Code

The app is protected by an access code. The default code is "admin" - you should change this:

1. Visit [SHA-256 Hash Generator](https://emn178.github.io/online-tools/sha256.html)
2. Enter your desired access code
3. Copy the generated hash
4. Replace the `correctHash` value in `login.html` with your new hash

### 3. Set Up API Credentials

The app uses Imagga API for food image recognition. To set this up:

1. Sign up for an [Imagga account](https://imagga.com/)
2. Get your API key and secret from the dashboard
3. Create a new file called `config.js` based on `config.template.js`
4. Add your Imagga credentials to `config.js`

### 4. Enable GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Enable GitHub Pages from the main branch
4. Set the visibility to "Private"

### 5. Access the App

1. Once GitHub Pages is enabled, you'll get a URL like: `https://username.github.io/repo-name`
2. Share this URL with your sister
3. She can access it through her iPhone's browser using the access code you created

### 6. Add to iPhone Home Screen

To make it feel more like a native app:

1. Open the site in Safari
2. Tap the share button (box with arrow)
3. Select "Add to Home Screen"
4. Give it a name and tap "Add"

Now there will be an app icon on the home screen that opens the tracker directly!

## Security Notes

- Keep your repository private
- Don't commit the actual `config.js` file with API credentials
- Change the access code from the default
- Only share the access code with intended users

## Development Notes

To make changes or improvements:

1. Clone the repository
2. Create `config.js` from the template
3. Make your changes
4. Test locally by opening `index.html`
5. Commit and push to deploy to GitHub Pages

## Backup

The app currently stores data in the browser. To prevent data loss:

1. Take regular screenshots of important data
2. Consider implementing data export feature in future updates

## Future Improvements

- Data persistence with a backend database
- Offline support
- Data export/backup feature
- Multiple user support
- Progress tracking and charts
