const express = require("express");
const router = express.Router();
const connection = require("../config/database");

// GET /api/select
router.get("/", (req, res) => {
  connection.query("SELECT id_sensor, Temperature, Humidity FROM data", (err, rows) => {
    if (!err) {
      return res.status(200).json({
        success: true,
        data: rows,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Database query error",
        error: err.message,
      });
    }
  });
});

module.exports = router;
