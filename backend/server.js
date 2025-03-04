const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');


dotenv.config();
const app = express();

app.use(express.json());

const mysql = require('mysql2/promise');
app.use(bodyParser.json());

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',  // Frontend URL
    credentials: true,  // Allow cookies to be sent
  }));




app.use('/auth', authRoutes);
app.use('/auth',projectRoutes);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
