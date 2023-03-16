const mix = require('laravel-mix');
require('laravel-mix-eslint');

mix
  // Disable Notifications
  .disableNotifications()

  // JavaScript
  .js('./src/js/main.js', './assets')
  .extract()

  // CSS
  .postCss('./src/css/tailwind.css', './assets/style.css', [
    require('postcss-import'),
    require('tailwindcss/nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
  ])

  // Options
  .options({
    processCssUrls: false,
    terser: {
      extractComments: false, // Stop Mix from generating license file
    }
  })

  // Ignore node_modules when running the watcher
  .webpackConfig({
    watchOptions: {
      ignored: /node_modules/
    }
  })