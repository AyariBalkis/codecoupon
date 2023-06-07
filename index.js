//const mysql = require ('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const axios =require('axios');
const{PrismaClient} = require('@prisma/client')

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
//app.use(bodyParser.json());
app.use(express.json());

//prisma!!!!!
const prisma = new PrismaClient();
// Example usage of Prisma client
async function getCoupons() {
  const coupons = await prisma.coupon.findMany();
  console.log(coupons);
}

// Call the function to fetch coupons
getCoupons()
  .catch((error) => {
    console.error('Error retrieving coupons:', error);
  })
  .finally(async () => {
    // Disconnect Prisma client
    await prisma.$disconnect();
  });
// MySQL connection setup
//const dbUrl = 'http://localhost:3306'; // 
/*const connection = mysql.createConnection({
  host:'localhost', // Replace with the IP address or hostname of the remote MySQL server
  user: 'root', // Use the appropriate username
  password: '', // Use the appropriate password
  database: 'coupon_codes',
  multipleStatements: true,
});

*/
/*
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database!');
  }
});
*/
// GET all coupons
//axios.get
/*app.get('/coupons', (req, res) => {
  connection.query('SELECT * FROM coupons', (error, results) => {
    if (error) {
      console.error('Error retrieving coupons:', error);
      res.status(500).send('Error retrieving coupons');
    } else {
      res.json(results);
    }
  });
});
*/
// GET all coupons
app.get('/coupons', async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany();
    res.json(coupons);
  } catch (error) {
    console.error('Error retrieving coupons:', error);
    res.status(500).send('Error retrieving coupons');
  }
});
/*
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
*/
// GET a specific coupon
app.get('/coupons/:id', async (req, res) => {
  const couponId = parseInt(req.params.id);
  try {
    const coupon = await prisma.coupon.findUnique({
      where: {
        id: parseInt(couponId),
      },
    });
    if (!coupon) {
      res.status(404).send(`Coupon with ID ${couponId} not found`);
    } else {
      res.json(coupon);
    }
  } catch (error) {
    console.error(`Error retrieving coupon with ID ${couponId}:`, error);
    res.status(500).send(`Error retrieving coupon with ID ${couponId}`);
  }
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
/*
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
*/
// PUT update a coupon
app.put('/coupons/:id', async (req, res) => {
  const couponId = parseInt(req.params.id);
  const couponData = req.body;
  try {
    const updatedCoupon = await prisma.coupon.update({
      where: {
        id: parseInt(couponId),
      },
      data: couponData,
    });
    res.send(`Coupon with ID ${couponId} updated successfully`);
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).send('Error updating coupon');
  }
});
/*
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
});*/
// DELETE a coupon
app.delete('/coupons/:id', async (req, res) => {
  const couponId = parseInt(req.params.id);
  try {
    const deletedCoupon = await prisma.coupon.delete({
      where: {
        id: parseInt(couponId),
      },
    });
    res.send(`Coupon with ID ${couponId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).send('Error deleting coupon');
  }
});

/*
// POST create a coupon
app.post('/coupons', (req, res) => {
  const couponData = req.body;
  const couponCode = generateCouponCode(); // Generate a unique coupon code
  console.log(couponCode)
  // Add the generated coupon code to the coupon data
  couponData.code = couponCode;
  
  connection.query('INSERT INTO coupons SET ?', couponData, (error, results) => {
    if (error) {
      console.error('Error creating coupon:', error.message);
      res.status(500).send('Error creating coupon');
    } else {
      const newCouponId = results.insertId;
      res.status(201).send(`New coupon created with ID: ${newCouponId}`);
    }
  });
});
*/
// POST create a coupon
app.post('/coupons', async (req, res) => {
  const couponData = req.body;
  const couponCode = generateCouponCode(); // Generate a unique coupon code
  console.log(couponCode);
  // Add the generated coupon code to the coupon data
  couponData.code = couponCode;

  try {
    const createdCoupon = await prisma.coupon.create({
      data: couponData,
    });
    const newCouponId = createdCoupon.id;
    res.status(201).send(`New coupon created with ID: ${newCouponId}`);
  } catch (error) {
    console.error('Error creating coupon:', error.message);
    res.status(500).send('Error creating coupon');
  }
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
