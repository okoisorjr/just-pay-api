const express = require("express");

require('dotenv').config();

const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const config = {
  origin: '*'
}
const port = process.env.PORT;

/** Routes */
const authRoutes = require('./routes/authentication');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(config));


app.use('/api/v1/pay-only/auth', authRoutes);

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
