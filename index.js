const dotenv = require('dotenv');
dotenv.config({ path: './.env'});
const express = require("express");

const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const config = {
  origin: [
    '*',
    'http://127.0.0.1:5173', 
    'http://localhost:5173',
    'http://localhost:3000',
    'http://172.20.10.5:5173'
  ]
}
const port = process.env.PORT;

/** Routes */
const authRoutes = require('./routes/authentication');
const flwRoutes = require('./routes/flw-payments');
const pstkRoutes = require('./routes/pstk-payments');
const apiKeysRoutes = require('./routes/api-keys');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(config));


app.use('/api/v1/pay-only/auth', authRoutes);
app.use('/api/v1/pay-only/flw', flwRoutes);
app.use('/api/v1/pay-only/pstk', pstkRoutes);
app.use('/api/v1/pay-only/keys', apiKeysRoutes);

app.get('/', (req, res) => {
  res.send('Hey, welcome to pay-only REST API');
})

mongoose.connect(process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(res => {
  if(res)
    console.log('database connection successful:', process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`pay-only rest API is currently running on port ${port}`);
    });
})
.catch(error => {
  console.log(error);
  process.exit(1);
});
module.exports = app;
