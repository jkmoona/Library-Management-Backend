const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

// Load env variables
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test database connection
sequelize
    .authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Unable to connect to the database:", err));

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Application running on port ${port}`);
});
