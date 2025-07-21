const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'Public'))); // Serve static files from the assets directory
const PORT = 4500;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/Public/uploads', express.static('uploads')); // To serve files

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Kamlesh@2004', // Update this
  database: 'login_page'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
  } else {
    console.log('✅ Connected to MySQL Database');
  }
});



// File Upload Setup (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Public/uploads/'); // Folder must exist
  },
  filename: (req, file, cb) => {
    // Extract user name from body (must be sent before files)
    const username = req.body.name?.replace(/\s+/g, '_') || 'unknown';
    const uniquename = req.body.newUserID?.replace(/\s+/g, '_') || 'unknown';
    const ext = path.extname(file.originalname); // .pdf
    const field = file.fieldname; // e.g. aadharPdf or panPdf

    cb(null, `${uniquename}_${username}_${field}${ext}`);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/Public/index.html");
});

// POST route to store form data and files
app.post('/submit', upload.fields([
  { name: 'aadharPdf' },
  { name: 'panPdf' },
  { name: 'photoFront' },
  { name: 'photoLeft' },
  { name: 'photoRight' }
]), (req, res) => {
  // First, query the latest userID
  db.query("SELECT userID FROM information ORDER BY id DESC LIMIT 1", (err, result) => {
    if (err) {
      console.error('Error fetching latest userID:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    let newUserID = 'JRCW1';
    if (result.length > 0) {
      const lastUserID = result[0].userID; // e.g., JRCW15
      const num = parseInt(lastUserID.replace('JRCW', '')) || 0;
      newUserID = 'JRCW' + (num + 1);
    }

    // Now extract form data
    const {
      name, fatherName, gender, dob: rawDob, doj: rawDoj, department, designation,
      site, mobileNumber, aadharNumber, accountNumber, ifsc, bankName, remarks
    } = req.body;

    const dob = rawDob?.trim() ? rawDob : null;
    const doj = rawDoj?.trim() ? rawDoj : null;

    const files = req.files;

    const sql = `
      INSERT INTO information (
        userID, name, fatherName, gender, dob, doj, department, designation, site,
        mobileNumber, aadharNumber, accountNumber, ifsc, bankName, remarks,
        aadharPdf, panPdf, photoFront, photoLeft, photoRight
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      newUserID, name, fatherName, gender, dob, doj, department, designation, site,
      mobileNumber, aadharNumber, accountNumber, ifsc, bankName, remarks,
      files?.aadharPdf?.[0]?.filename || null,
      files?.panPdf?.[0]?.filename || null,
      files?.photoFront?.[0]?.filename || null,
      files?.photoLeft?.[0]?.filename || null,
      files?.photoRight?.[0]?.filename || null
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('❌ Insert error:', err);
        return res.status(500).json({ success: false, message: 'Database insert failed.' });
      }
      res.json({ success: true, message: 'Data stored successfully!' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
