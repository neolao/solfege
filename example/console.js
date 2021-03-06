const solfege = require("../lib");
const MyBundle = require("./Bundle");

// Create application instance
let application = solfege.factory(`${__dirname}/config/production.yml`);
application.addBundle(new MyBundle);


// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
