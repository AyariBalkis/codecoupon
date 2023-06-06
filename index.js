const mysql = require ('mysql');
const express = require('express');
const bodyparser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Use the appropriate username
  password: '', // Use the appropriate password
  database: 'coupon_codes',
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database!');
  }
});

// GET all coupons
app.get('/coupons', (req, res) => {
  connection.query('SELECT * FROM coupons', (error, results) => {
    if (error) {
      console.error('Error retrieving coupons:', error);
      res.status(500).send('Error retrieving coupons');
    } else {
      res.json(results);
    }
  });
});

// GET a specific coupon
app.get('/coupons/:id', (req, res) => {
  const couponId = req.params.id;
  connection.query('SELECT * FROM coupons WHERE id = ?', [couponId], (error, results) => {
    if (error) {
      console.error(`Error retrieving coupon with ID ${couponId}:`, error);
      res.status(500).send(`Error retrieving coupon with ID ${couponId}`);
    } else if (results.length === 0) {
      res.status(404).send(`Coupon with ID ${couponId} not found`);
    } else {
      res.json(results[0]);
    }
  });
});

// POST create a coupon
/*app.post('/coupons', (req, res) => {
  const couponData = req.body;
  connection.query('INSERT INTO coupons SET ?', couponData, (error, results) => {
    if (error) {
      console.error('Error creating coupon:', error);
      res.status(500).send('Error creating coupon');
    } else {
      const newCouponId = results.insertId;
      res.status(201).send(`New coupon created with ID: ${newCouponId}`);
    }
  });
});
*/
// PUT update a coupon
app.put('/coupons/:id', (req, res) => {
  const couponId = req.params.id;
  const couponData = req.body;
  connection.query('UPDATE coupons SET ? WHERE id = ?', [couponData, couponId], (error, results) => {
    if (error) {
      console.error('Error updating coupon:', error);
      res.status(500).send('Error updating coupon');
    } else {
      res.send(`Coupon with ID ${couponId} updated successfully`);
    }
  });
});

// DELETE a coupon
app.delete('/coupons/:id', (req, res) => {
  const couponId = req.params.id;
  connection.query('DELETE FROM coupons WHERE id = ?', couponId, (error, results) => {
    if (error) {
      console.error('Error deleting coupon:', error);
      res.status(500).send('Error deleting coupon');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Coupon not found');
    } else {
      res.send(`Coupon with ID ${couponId} deleted successfully`);
    }
  });
});
// POST create a coupon
app.post('/coupons', (req, res) => {
  const couponData = req.body;
  const couponCode = generateCouponCode(); // Generate a unique coupon code
  
  // Add the generated coupon code to the coupon data
  couponData.code = couponCode;
  
  connection.query('INSERT INTO coupons SET ?', couponData, (error, results) => {
    if (error) {
      console.error('Error creating coupon:', error);
      res.status(500).send('Error creating coupon');
    } else {
      const newCouponId = results.insertId;
      res.status(201).send(`New coupon created with ID: ${newCouponId}`);
    }
  });
});

// Function to generate a random coupon code
function generateCouponCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 10;
  let couponCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    couponCode += characters.charAt(randomIndex);
  }

  return couponCode;
}


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
