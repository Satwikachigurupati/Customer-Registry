const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

/* Create Customer */
router.post("/", async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json(error);
    }
});

/* Get All Customers */
router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json(error);
    }
});

/* Update Customer Status */
router.put("/:id", async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(customer);
    } catch (error) {
        res.status(500).json(error);
    }
});

/* Delete Customer */
router.delete("/:id", async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);

        res.json({
            message: "Customer deleted successfully"
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
