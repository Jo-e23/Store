const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://localhost:27017/Mark");

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api", require("../routes/routes"));
app.use("/admin", require("../routes/auth"));


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

// Server configured
