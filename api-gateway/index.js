const express = require('express');
const axios = require('axios');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Create Express app
const app = express();
app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Gateway',
      version: '1.0.0',
      description: 'API Gateway to route requests to Item and Order Services',
    },
    servers: [
      {
        url: 'http://localhost:5000', // The gateway server itself
      },
    ],
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Gateway Routes

// ITEM SERVICE ROUTES

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     responses:
 *       200:
 *         description: A list of items
 */
app.get('/items', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5001/getAllItems');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve items' });
  }
});

/**
 * @swagger
 * /item/{id}:
 *   get:
 *     summary: Get item by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item
 *     responses:
 *       200:
 *         description: A single item object
 */
app.get('/item/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5001/getById/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ message: 'Item not found' });
  }
});

/**
 * @swagger
 * /item:
 *   post:
 *     summary: Create a new item
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
 *       201:
 *         description: Item created successfully
 */
app.post('/item', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5001/items', req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create item' });
  }
});

/**
 * @swagger
 * /item/{id}:
 *   put:
 *     summary: Update an existing item
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item
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
 */
app.put('/item/:id', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:5001/update/${req.params.id}`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item' });
  }
});

/**
 * @swagger
 * /item/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the item
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */
app.delete('/item/:id', async (req, res) => {
  try {
    const response = await axios.delete(`http://localhost:5001/delete/${req.params.id}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
});

// ORDER SERVICE ROUTES

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     responses:
 *       200:
 *         description: A list of orders
 */
app.get('/orders', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5002/orders');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve orders' });
  }
});

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Get order by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: A single order object
 */
app.get('/order/:id', async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5002/orders/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ message: 'Order not found' });
  }
});

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               quantity:
 *                 type: number
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */
app.post('/order', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:5002/orders', req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order' });
  }
});

/**
 * @swagger
 * /order/{id}:
 *   put:
 *     summary: Update an existing order
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *               quantity:
 *                 type: number
 *               totalPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order updated successfully
 */
app.put('/order/:id', async (req, res) => {
  try {
    const response = await axios.put(`http://localhost:5002/orders/${req.params.id}`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order' });
  }
});

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Order deleted successfully
 */
app.delete('/order/:id', async (req, res) => {
  try {
    const response = await axios.delete(`http://localhost:5002/orders/${req.params.id}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete order' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
