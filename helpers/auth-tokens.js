//const bcrypt = require('bcryptjs');
require('dotenv').config();

const jwt = require('jsonwebtoken');

exports.generate_auth_tokens = async (payload) => {
  const ACCESS_SECRET_KEY = '624ac98b6f02437febfc3ddfab8d1d61ec5440f05bd17db7ee5e0c85a5ff93e9';
  const REFRESH_SECRET_KEY = '8752a24fa541b40c4d2cb876b6fb1bdf48b3382f929282897a8be4345420d1f8';

  const access_token = await jwt.sign(payload, ACCESS_SECRET_KEY, {expiresIn: '1m', algorithm: 'HS256'});
  const refresh_token = await jwt.sign(payload, REFRESH_SECRET_KEY, {expiresIn: '1m', algorithm: 'HS256'});
  
  return { access_token: access_token, refresh_token: refresh_token }
}