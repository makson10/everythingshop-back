require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const app = express();


const customersRouter = require("./routes/customers");
const googleCustomersRouter = require("./routes/googleCustomers");
const productsRouter = require("./routes/products");
const adminsRouter = require("./routes/admins");
const feedbacksRouter = require("./routes/feedbacks");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/customers', customersRouter);
app.use('/googleCustomers', googleCustomersRouter);
app.use("/products", productsRouter);
app.use("/admins", adminsRouter);
app.use("/feedbacks", feedbacksRouter);

// make later check authorization header
app.post('/getDropboxToken', (req, res) => {
    res.status(200).send(process.env.DROPBOX_TOKEN);
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on ${process.env.PORT} port`);
});



// Require the fastify framework and instantiate it
// const fastify = require("fastify")({
    // logger: false,
// });

// Setup our static files
// fastify.register(require("@fastify/static"), {
//     root: path.join(__dirname, "public"),
//     prefix: "/", // optional: default '/'
// });

// Formbody lets us parse incoming forms
// fastify.register(require("@fastify/formbody"));

// View is a templating manager for fastify
// fastify.register(require("@fastify/view"), {
//     engine: {
//         handlebars: require("handlebars"),
//     },
// });

// Load and parse SEO data
// const seo = require("./seo.json");
// if (seo.url === "glitch-default") {
//     seo.url = `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
// }

// We use a module for handling database operations in /src
// const db = require("./sqlite");

/**
 * Home route for the app
 *
 * Return the poll options from the database helper script
 * The home route may be called on remix in which case the db needs setup
 *
 * Client can request raw data using a query parameter
 */
// fastify.get("/", async (request, reply) => {
    /* 
    Params is the data we pass to the client
    - SEO values for front-end UI but not for raw data
    */
    // let params = request.query.raw ? {} : { seo: seo };

    // Get the available choices from the database
    // const options = await db.getAllCustomers();
    // if (options) {
    //     params.customers = options.map((customers) => customers.name);
        // params.optionCounts = options.map((choice) => choice.picks);
    // }
    // Let the user know if there was a db error
    // else params.error = data.errorMessage;

    // Check in case the data is empty or not setup yet
    // if (options && params.optionNames.length < 1)
    //     params.setup = data.setupMessage;

    // ADD PARAMS FROM TODO HERE

    // Send the page options or raw JSON data if the client requested it
    // return request.query.raw
    //     ? reply.send(params)
    //     : reply.view("/src/pages/index.hbs", params);
// });

/**
 * Post route to process user vote
 *
 * Retrieve vote from body data
 * Send vote to database helper
 * Return updated list of votes
 */
// fastify.post("/", async (request, reply) => {
    // We only send seo if the client is requesting the front-end ui
    // let params = request.query.raw ? {} : { seo: seo };

    // Flag to indicate we want to show the poll results instead of the poll form
    // params.results = true;
    // let options;

    // We have a vote - send to the db helper to process and return results
    // if (request.body.language) {
        // options = await db.processVote(request.body.language);
        // if (options) {
            // We send the choices and numbers in parallel arrays
            // params.optionNames = options.map((choice) => choice.language);
            // params.optionCounts = options.map((choice) => choice.picks);
        // }
    // }
    // params.error = options ? null : data.errorMessage;

    // Return the info to the client
    // return request.query.raw
        // ? reply.send(params)
        // : reply.view("/src/pages/index.hbs", params);
// });

/**
 * Admin endpoint returns log of votes
 *
 * Send raw json or the admin handlebars page
 */
// fastify.get("/logs", async (request, reply) => {
    // let params = request.query.raw ? {} : { seo: seo };

    // Get the log history from the db
    // params.optionHistory = await db.getLogs();

    // Let the user know if there's an error
    // params.error = params.optionHistory ? null : data.errorMessage;

    // Send the log list
//     return request.query.raw
//         ? reply.send(params)
//         : reply.view("/src/pages/admin.hbs", params);
// });

/**
 * Admin endpoint to empty all logs
 *
 * Requires authorization (see setup instructions in README)
 * If auth fails, return a 401 and the log list
 * If auth is successful, empty the history
 */
// fastify.post("/reset", async (request, reply) => {
    // let params = request.query.raw ? {} : { seo: seo };

    /* 
    Authenticate the user request by checking against the env key variable
    - make sure we have a key in the env and body, and that they match
    */
    // if (
    //     !request.body.key ||
    //     request.body.key.length < 1 ||
    //     !process.env.ADMIN_KEY ||
    //     request.body.key !== process.env.ADMIN_KEY
    // ) {
    //     console.error("Auth fail");

        // Auth failed, return the log data plus a failed flag
        // params.failed = "You entered invalid credentials!";

        // Get the log list
        // params.optionHistory = await db.getLogs();
    // } else {
        // We have a valid key and can clear the log
        // params.optionHistory = await db.clearHistory();

        // Check for errors - method would return false value
        // params.error = params.optionHistory ? null : data.errorMessage;
    // }

    // Send a 401 if auth failed, 200 otherwise
    // const status = params.failed ? 401 : 200;
    // Send an unauthorized status code if the user credentials failed
    // return request.query.raw
        // ? reply.status(status).send(params)
        // : reply.status(status).view("/src/pages/admin.hbs", params);
// });

// Run the server and report out to the logs
// fastify.listen(
    // { port: process.env.PORT, host: "0.0.0.0" },
    // function (err, address) {
        // if (err) {
            // console.error(err);
            // process.exit(1);
        // }
        // console.log(`Your app is listening on ${address}`);
    // }
// );
