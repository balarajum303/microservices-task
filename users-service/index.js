const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Item = require("./models/item");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.log("Error connecting to MongoDB:", error));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Item Management API",
      version: "1.0.0",
      description: "A simple API to manage items in the inventory",
    },
    servers: [
      {
        url: "http://localhost:5001", // Update if using a different server
      },
    ],
  },
  apis: ["./index.js"], // Path to the API file
};

// Initialize SwaggerJSDoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Add a new item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *             required:
 *               - name
 *               - description
 *               - price
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Error creating item
 */
app.post("/items", async (req, res) => {
  const { name, description, price } = req.body;
  const data = new Item({ name, description, price });

  try {
    const savedItem = await data.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(400).json({ message: "Error creating item", error });
  }
});

/**
 * @swagger
 * /getAllItems:
 *   get:
 *     summary: Get all items
 *     responses:
 *       200:
 *         description: List of all items
 *       400:
 *         description: Error fetching items
 */
app.get("/getAllItems", async (req, res) => {
  try {
    const allData = await Item.find();
    res.status(200).json(allData);
  } catch (error) {
    res.status(400).json({ message: "Internal server error", error });
  }
});

/**
 * @swagger
 * /getById/{id}:
 *   get:
 *     summary: Get an item by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item retrieved successfully
 *       400:
 *         description: Error getting item
 */
app.get("/getById/:id", async (req, res) => {
  try {
    const getDataById = await Item.findById(req.params.id);
    res.status(200).json(getDataById);
  } catch (error) {
    res.status(400).json({ message: "Error to get data", error });
  }
});

/**
 * @swagger
 * /update/{id}:
 *   put:
 *     summary: Update an item by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Error updating item
 *       404:
 *         description: Item not found
 */
app.put("/update/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedItem) {
      res.status(200).json(updatedItem);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Item not updated", error });
  }
});

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     summary: Delete an item by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       400:
 *         description: Error deleting item
 */
app.delete("/delete/:id", async (req, res) => {
  try {
    const deletedId = await Item.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedId);
  } catch (error) {
    res.status(400).json({ message: "Unable to delete", error });
  }
});

// Server
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`UserService running on port ${port}`));
