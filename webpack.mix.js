let mix = require("laravel-mix");

mix.js('assets/javascripts/app.js', 'public/javascripts')
    .js('assets/javascripts/clipping/polygon.js', 'public/javascripts/clipping')
    .js('assets/javascripts/clipping/line.js', 'public/javascripts/clipping')
    .js('assets/javascripts/scan/line.js', 'public/javascripts/scan')
    .js('assets/javascripts/scan/circle.js', 'public/javascripts/scan')
    .js('assets/javascripts/transformation/lab-work.js', 'public/javascripts/transformation')
    .js('assets/javascripts/transformation/rotation.js', 'public/javascripts/transformation')
    .sass('assets/sass/app.scss', 'public/stylesheets')
    .setPublicPath('public');