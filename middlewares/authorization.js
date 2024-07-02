const jwt = require('jsonwebtoken');
const dotenv =  require('dotenv')
dotenv.config();

const decodeAccessToken = async (token) => {
  try{
    const decoded = await jwt.decode(token);
    return decoded;
  } catch(error) {
    console.log(error);
    return res.status(401).send({ errorMsg: "invalid access token" })
  }
}

const verifyAccessToken = async (req, res, next) => {
  const ACCESS_SECRET_KEY = '624ac98b6f02437febfc3ddfab8d1d61ec5440f05bd17db7ee5e0c85a5ff93e9';
  
  const token = req.headers['authorization'].split(' ')[1];
  try{
    const validToken = jwt.verify(token, ACCESS_SECRET_KEY);
    if(validToken) {
      return next();
    }  
  } catch(error) {
    console.log('My Error goes here =>', error);
    return res.status(401).send({ errorMessage: 'expired token' });
  }
}

const decodeRefreshToken = async (token) => {
  try{
    const decoded = await jwt.decode(token);
    //console.log(decoded);
    next();
  } catch(error) {
    //console.log(error);
    return res.status(401).send({ errorMsg: "invalid refresh token" })
  }
}

const verifyRefreshToken = async (req, res, next) => {
  const REFRESH_SECRET_KEY = '8752a24fa541b40c4d2cb876b6fb1bdf48b3382f929282897a8be4345420d1f8';
  const token = req.header['authorization'];
  try{
    const verified = await jwt.verify(token, REFRESH_SECRET_KEY);
    //console.log(verified);
    next();
  } catch(error) {
    //console.log(error);
    return res.status(401).send({ errorMessage: 'expired token' });
  }
}

module.exports = { 
  decodeAccessToken, 
  verifyAccessToken, 
  decodeRefreshToken, 
  verifyRefreshToken 
};