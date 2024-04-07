const bcryptjs = require('bcryptjs');
const reg = require('../models/user');
const access_token = require('../helpers/auth-tokens');
const cookieParser = require('cookie-parser');

const register = async (req, res, next) => {
  console.log(req.body);
  const user = new reg();
  
  const {business_name, firstname, lastname, email, phone, password, terms, account_type} = req.body;
  if(!firstname || !lastname || !email || !phone || !password || !account_type) {
    res.status(400).send({ msg: 'please ensure all fields are filled in correctly.' });
  }

  if(!terms) {
    res.status(400).send({ msg: 'kindly go over our terms of engagement and accept'});
  }

  user.buisness_name = business_name ? business_name : null;
  user.firstname = firstname;
  user.lastname = lastname;
  user.email = email;
  user.phone = phone;
  user.account_type = account_type;
  user.agreed_terms = terms;
  user.password = await bcryptjs.hash(password, 10);

  try{
    const new_user = await reg.create(user);
    res.status(201).send({ msg: 'congratulations! your account was created successfully', new_user });
  } catch(error) {
    console.log(error);
    res.status(400).send({ msg: 'account creation failed!' });
  }
}

const login = async (req, res, next) => {
  const {email, password} = req.body;

  if(!email || !password) {
    res.status(400).send({ msg: 'Kindly provide your email and password'});
  }

  try{
    const user = await reg.findOne({ email: email });
    if(!user) {
      res
        .status(404)
        .send({ 
          msg: 'Having trouble finding your account.'
        });
    }

    const password_match = bcryptjs.compare(password, user.password);
    if(!password_match) {
      res
        .status(400)
        .send({ 
          msg: 'provided email or password is incorrect.'
        });
    }

    const tokens = await access_token.generate_auth_tokens({id: user.id, email: user.email});
      res.cookie('access_token', tokens.access_token, {expires: new Date(Date.now() + 900000), httpOnly: true });
      res.cookie('refresh_token', tokens.refresh_token, {expires: new Date(Date.now() + 900000), httpOnly: true })
      res
      .status(200)
      .send({ 
        msg: `Welcome back, ${user.firstname}`, 
        access_token: tokens.access_token, 
        refresh_token: tokens.refresh_token 
      });

  } catch(err) {
    console.log(err);
    res.status(500).send({ msg: 'something went wrong with our internal system.' });
  }
  

  

  



  return res.status(200).send('congratulations! you have successfully signed in');
}

const account = async (req, res, next) => {
  return res.status(200).send('welcome back, Ochael!');
}

const logout = async (req, res, next) => {
  return res.status(200).send({ msg: 'logged out!' });
}

module.exports = {register, login, account, logout}