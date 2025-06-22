const express = require("express");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(cors());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static("public"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

const viewRouter = require("./routes/view");
app.use("/jenengapk/", viewRouter); // website

const suhuRouter = require("./routes/suhu");
app.use("/api/suhu", suhuRouter);

const selectRouter = require("./routes/select");
app.use("/api/select", selectRouter);

app.get("/", (req, res) => {
  res.redirect("/jenengapk/dashboard");
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
