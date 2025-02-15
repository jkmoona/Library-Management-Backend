const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

// Load env variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test database connection
sequelize
    .authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Unable to connect to the database:", err));

// Sync models
sequelize
    .sync({ force: false })
    .then(() => {
        console.log("Database synced successfully!");
    })
    .catch((err) => {
        console.log("Error syncing database: ", err);
    });

// Routes
const routes = require("./routes");
app.use("/", routes);

// Error handling
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
    });
});

// Handle Uncaught Errors
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception: ", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection: ", reason);
});

// Start server
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application running on port ${port}`);
});

// Graceful Shutdown
process.on("SIGINT", () => {
    console.log("Shutting down gracefully...");
    app.close(closeGracefully());
});

process.on("SIGTERM", () => {
    console.log("Shutting down gracefully...");
    app.close(closeGracefully());
});

async function closeGracefully() {
    await sequelize.close();
    console.log("Database connection closed.");
    console.log("Server closed.");
    process.exit(0);
}
