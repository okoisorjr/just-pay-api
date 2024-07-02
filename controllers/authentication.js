const bcryptjs = require('bcryptjs');
const reg = require('../models/user');
const invalid_tokens = require('../models/deleted-token');
const jwt = require('jsonwebtoken');
const access_token = require('../helpers/auth-tokens');
const { decodeAccessToken } = require('../middlewares/authorization');

/** *******************************************SIGN UP USER ************************************************ */
const register = async (req, res, next) => {
  //console.log(req.body);
  const user = new reg();
  
  const {buisnessName, firstname, lastname, email, phone, password, agreedTerms, /* accountType */} = req.body;
  if(!firstname || !lastname || !email || !phone || !password/*  || !accountType */) {
    return res.status(400).send({ status:400, errorMessage: 'please ensure all fields are filled in correctly.' });
  }

  if(!agreedTerms) {
    return res.status(400).send({ status: 400, errorMessage: 'kindly go over our terms of engagement and accept'});
  }

  /* if(accountType === 'PERSONAL' && buisnessName !== '') {
    return res.status(400).send({ status: 400, errorMessage: 'A personal account type should not have a buisness name'});
  } */

  /* if(accountType === 'BUISNESS' && !buisnessName) {
    return res.status(400).send({ status: 400, errorMessage: 'A business account type should have a buisness name'});
  } */

  user.buisness_name = buisnessName;
  user.firstname = firstname;
  user.lastname = lastname;
  user.email = email;
  user.phone = phone;
  //user.account_type = accountType;
  user.agreed_terms = agreedTerms;
  user.password = await bcryptjs.hash(password, 10);

  const existing_user = await reg.find({ email: email });

  if(existing_user.length > 0) {
    return res.status(409).send({ statusCode: 409, errorMessage: 'A user already exists with the same email address' });
  }

  try{
    const new_user = await reg.create(user);
    return res.status(201).send({ status: 201, msg: 'congratulations! your account was created successfully', new_user });
  } catch(error) {
    console.log(error);
    return res.status(400).send({ status: 201, msg: 'account creation failed!' });
  }
}

/** *******************************************LOG USER IN *************************************************** */
const login = async (req, res, next) => {
  const {email, password} = req.body;

  if(!email || !password) {
    return res.status(400).send({ msg: 'Kindly provide your email and password'});
  }

  try{
    const user = await reg.findOne({ email: email });
    if(!user) {
      return res
        .status(404)
        .send({ 
          msg: 'Having trouble finding your account.'
        });
    }

    const password_match = await bcryptjs.compare(password, user.password);
    if(!password_match) {
      return res
        .status(400)
        .send({ 
          msg: 'provided email or password is incorrect.'
        });
    }

    const tokens = await access_token.generate_auth_tokens({id: user.id, email: user.email})

    if(!tokens) {
      return res.status(500).send({ msg: 'Failure generating tokens' });
    }

    user.refresh_token = tokens.refresh_token;
    const result = await user.save(); //save users refresh token

    if(!result) {
      return res
              .status(402)
              .send({ 
                statusCode: 402, 
                errorMessage: 'something went terribly wrong with the token'
              });
    }

    /* res.setHeader('Authorization', `Bearer ${tokens.access_token}`);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin); */
    
    return res.status(200).send({ 
      access_token: tokens.access_token, 
      refresh_token: tokens.refresh_token,
      uid: user.id
    });
      
      /* res.cookie('access_token', tokens.access_token, {expires: new Date(Date.now() + 900000), httpOnly: true, secure: true, sameSite: 'none' });
      res.cookie('refresh_token', tokens.refresh_token, {expires: new Date(Date.now() + 900000), httpOnly: true }); */
  } catch(err) {
    console.log(err);
    res.status(500).send({ msg: 'something went wrong with our internal system.' });
  }
}

/* ********************************************** GOOGLE AUTHENTICATION ************************************* **/
/* const googleSignin = async (req, res, next) => {
  const token = req.body.token;

  if(!token) {
    return res.status(400).send({ status: '', errorMessage: '' });
  }

  try {
    const decoded = await jwt.decode(token);
    console.log('Google token decoded=================================================================>:', decoded);
    return res.status(200).send({ status: 'OK', data: decoded });
  } catch(error) {
    console.log(error);
    return res.status(500).send({ status: '', errorMessage: '' });
  }
} */



/** *********************************************GET LOGGED IN ACCOUNT ************************************** */
const account = async (req, res, next) => {
  const user_id = req.params['id'];
  
  try{    
    const current_user = await reg.findById(user_id)
                                  .select(`-_id firstname lastname email phone buisness_name account_type agreed_terms`);
    //console.log(current_user);
    if(!current_user){
      return res.status(404).send({ msg: 'user not found' });
    }
    
    return res.status(200).send({ msg: 'OK', user: current_user });
  }catch(error){
    console.log(error);
    return res.status(500).send({ msg: '' });
  }
}

/** *********************************************REFRESH TOKEN ********************************************** */
const refresh = async (req, res, next) => {

}

/** **********************************************LOG USER OUT ********************************************** */
const logout = async (req, res, next) => {
  const deleted = new invalid_tokens();  
  const token = req.headers['authorization'].split(' ')[1];
  const decoded = jwt.decode(token);
  //console.log(decoded);
  deleted.token = token; 
  deleted.user_id = decoded.id

  try {
    const invalid_token = await invalid_tokens.create(deleted); 
    const user = await reg.findOneAndUpdate(
      { email: decoded.email }, 
      { refresh_token: null}, 
      {upsert: true, new: true}
    );
    
    if(!user) {
      return res.status(401).send({ status: 402, errorMessage: ''});
    }

    return res.status(200).send({ msg: 'logged out!', id: invalid_token });
  } catch(error) {
    console.log(error);
    return res.status(500).send({ errorMessage: 'oops, something went terribly wrong!' });
  }
}

module.exports = {register, login, /* googleSignin, */ account, logout, refresh}