const express = require('express');
const router = express.Router();
const Tree = require('../models/treeMode');
const db = require('../models/database');

const tree = new Tree(db);

// CREATE - Add a new tree
router.post("/add", async (req, res) => {
    try {
        const { name } = req.body;
        await tree.createTree(name);
        res.status(201).json({ message: "Tree created successfully" });
    } catch (error) {
        console.error("Error creating tree:", error);
        res.status(500).json({ message: "Error creating tree" });
    }
});

// READ - Get all trees
router.get("/all", async (req, res) => {
    try {
        const trees = await tree.getAllTree();
        res.json(trees);
    } catch (error) {
        console.error("Error fetching trees:", error);
        res.status(500).json({ message: "Error fetching trees" });
    }
});

// UPDATE - Update a tree by id
router.put("/update/:id", async (req, res) => {
    try {
        const treeId = req.params.id;
        const updateData = req.body;
        // Assumes you have implemented updateTree in your model.
        await tree.updateTree(treeId, updateData);
        res.json({ message: "Tree updated successfully" });
    } catch (error) {
        console.error("Error updating tree:", error);
        res.status(500).json({ message: "Error updating tree" });
    }
});

// DELETE - Delete a tree by id
router.delete("/delete/:id", async (req, res) => {
    try {
        const treeId = req.params.id;
        // Assumes you have implemented deleteTree in your model.
        await tree.deleteTree(treeId);
        res.json({ message: "Tree deleted successfully" });
    } catch (error) {
        console.error("Error deleting tree:", error);
        res.status(500).json({ message: "Error deleting tree" });
    }
});

module.exports = router;
