const flw = require('../middlewares/flw-init');

const flw_charge_card = async (req, res, next) => {
  const payload = {enckey: process.env.FLW_ENCRYPTION_KEY, ...req.body};
  try{
    const response = await flw.Charge.card(payload);
    
    res.status(200).send({ data: {...payload, ...response.meta }});
  }catch(error) {
    console.log(error);
    return res.status(400).send({ status:error.statusCode, msg: 'Transaction failed!' });
  }
}

const flw_recall_charge = async (req, res, next) => {
  const payload = {enckey: process.env.FLW_ENCRYPTION_KEY, ...req.body}; 
  try {
    if (payload.authorization.mode === 'redirect') {
      var url = response.meta.authorization.redirect
      open(url)
    }

    if(payload.authorization.mode === 'pin') {
      const response = await flw.Charge.card(payload);
      return res.status(200).send({ status: 'OK', data: response });
    }
  } catch(error) {
    console.log(error);
  }
}

const flw_validate_otp = async (req, res, next) => {
  // Add the OTP to authorize the transaction
  const payload = req.body
  const callValidate = await flw.Charge.validate(payload)
  console.log(callValidate)
  return res.status(200).send({ data: callValidate });
}

const flwtransfer = () => {

}

module.exports = {
  flw_charge_card,
  flw_recall_charge,
  flw_validate_otp,
  flwtransfer
}