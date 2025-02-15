const express = require("express");
const router = express.Router();

router.use("/users", require("./userRoutes"));
router.use("/books", require("./bookRoutes"));

module.exports = router;
