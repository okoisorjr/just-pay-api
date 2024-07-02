const Crypto = require('crypto');
const key = require('../models/api-keys');

const generateApiKey = async (req, res, next) => {
    const pub_key = `1PPK-${await Crypto.randomBytes(32).toString('hex')}-X`;
    const api_key = new key();
    
    api_key.publicKey = pub_key;
    api_key.user_id = req.params.user_id;

    const new_key = await key.create(api_key);

    if(!new_key) {
      return res.status('500').send({ status: 'Failed', errorMessage: '' });
    }

    return res.status(200).send({ status: 'OK', msg: 'API key generated successfully' });
}

const getKeys = async (req, res, next) => {
  try {
    const apiKeys = await key.find({ user_id: req.params.user_id });

    if(apiKeys.length === 0) {
      return res.status(404).send({status: 'OK', message: 'No available API Keys' });
    }

    return res.status(200).send({ status: 'OK', keys: apiKeys });

  } catch(error) {
    
    return res.status(500).send({ status: 'error', errorMessage: 'failed to generate API-KEY' });
  }
}

const retrieveUserKeys = async (user_id) => {
  const keys = await key.find({ user_id: user_id });
  return keys;
}

const revokeApiKey = async (req, res, next) => {
  console.log(req.params);
  const deleted_key = await key.findByIdAndDelete(req.params.token_id); //findOneByIdAndDelete(req.params.token_id);

  if(!deleted_key) {
    return res.status(500).send({ status: 'Failed', errorMessage: 'Failed to Revoke Token!' });
  }

  const keys = await retrieveUserKeys(req.params.user_id);
  return await res.status(200).send({ status: 'OK', keys: keys });
}

module.exports = { generateApiKey, revokeApiKey, getKeys }