const express = require('express');
const router = express.Router();

router.get("/dashboard", (req, res) => {
  res.render("suhu");
});

module.exports = router;
