# Framework7 Webpack App Werewolf Helper

A full-featured Framework7 with Webpack setup with hot-reload.

## Usage

### 1. Instal dependencies

Go to the downloaded repository folder and run:
```
npm install
```

This will download latest version of Framework7 and required icon fonts (to `/src/fonts/`)

### 2. Run the app

```
npm run dev
```

App will be opened in browser at `http://localhost:8080/`

### 3. Build app for production

```
npm run build-prod
```

The output will be at `www/` folder

## Use with cordova
Cordova is not enabled by default, so make sure to remove the comment tags around the `<script src="cordova.js"></script>` line in [projectroot]/src/index.html
```
<body>
  <div id="app"></div>

  <!-- Cordova -->

  <script src="cordova.js"></script>

  <!-- built script files will be auto injected -->
</body>
```
It will be added during the build process to Android/iOS.

Just put the contents of `www` folder in your cordova's project root `www` folder

## Project Structure

* `src/index.html` - main app HTML
* `src/assets` - folder with static assets (images)
* `src/css` - put custom app CSS styles here. Don't forget to import them in `main.js`
* `src/pages` - app `.f7.html` pages
* `src/app.js` - main app file where you include/import all required libs and init app
* `src/routes.js` - app routes
* `/static/` - folder with extra static assets that will be copied into output folder
