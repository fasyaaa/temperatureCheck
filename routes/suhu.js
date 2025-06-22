const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const connection = require("../config/database");

router.get("/", (req, res) => {
connection.query("SELECT * FROM sensor_suhu ORDER BY id DESC", (err, rows) => {
    if (!err) {
      return res.status(200).json({
        status: true,
        message: "Success",
        data: rows,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  });
});

router.post("/suhu",
    [
        body("id_sensor").notEmpty(),
        body("temperature").notEmpty(),
        body("humidity").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({
                status: false,
                message: errors.array(),
            });
        }
        let formData = {
            id_sensor: req.body.id_sensor,
            temperature: req.body.temperature,
            humidity: req.body.humidity,
        };
        connection.query("INSERT INTO sensor_suhu SET ?", formData, (err, rows) => {
            if(err){
                return res.status(500).json({
                    status: false,
                    message: "Internal Error",
                    errors: err
                });
            } else {
                return res.status(201).json({
                    status: true,
                    message: "Data sensor suhu Created",
                    data: formData
                });
            }
        });
    }
);

router.get("/:id", (req, res) => {
    let idSuhu = req.params.id;
    connection.query(
        "SELECT * FROM sensor_suhu WHERE id = ?",
        idSuhu,
        (err, rows) => {
            if (err) {
                return res.status(500).json({
            status: false,
            message: "Internal Server Error",
        });
    } else {
        if (rows.length > 0) {
            return res.status(200).json({
                status: true,
                message: "Success",
                data: rows[0],
            });
        } else {
            return res.status(404).json({
                status: false,
                message: "Sensor suhu not found",
            });
        }
    }
}
);
});

router.put(
    "/:id",
    [
        body("id_sensor").notEmpty(),
        body("temperature").notEmpty(),
        body("humidity").notEmpty(),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: errors.array(),
            });
        }
        let idSuhu = req.params.id;
        let formData = {
            id_sensor: req.body.id_sensor,
            temperature: req.body.temperature,
            humidity: req.body.humidity,
        };
        connection.query(
            "UPDATE sensor_suhu SET ? WHERE id = ?",
            [formData, idSuhu],
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: "Internal Server Error",
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: "Post updated",
                        data: formData,
                    });
                }
            }
        );
    }
);

router.delete("/:id", (req, res) => {
    let idSuhu = req.params.id;
    connection.query("DELETE FROM sensor_suhu WHERE id = ?", idSuhu, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: "Internal Server Error",
            });
    } else {
        return res.status(200).json({
            status: true,
            message: "Sensor suhu data deleted",
        });
    }
});
});

module.exports = router;
