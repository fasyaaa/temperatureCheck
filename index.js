const express = require("express");
const app = express();
const port = 3000;
const cron = require("node-cron");
const connection = require("./config/database");

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

// delete data every 24h 
cron.schedule("0 0 * * *", () => {
  const query = `
    DELETE FROM sensor_suhu 
    WHERE waktu < NOW() - INTERVAL 1 DAY
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Gagal menghapus data lama:", err);
    } else {
      console.log(`Berhasil menghapus ${results.affectedRows} data yang lebih dari 24 jam`);
    }
  });
});
