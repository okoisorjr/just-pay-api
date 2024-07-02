const Paystack = require('paystack-sdk').Paystack;
const sk = 'sk_test_b558e907b563e107a392745cae74a2e85f514989';
const paystack = new Paystack(`${sk}`);

const pstk_charge_card = async (req, res, next) => {
  const data = {
    email: "customer@email.com",
    amount: "10000",
    metadata: {
      custom_fields: [
        {
          value: "makurdi",
          display_name: "Donation for",
          variable_name: "donation_for"
        }
      ]
    },
    bank: {
      code: "057",
      account_number: "0000000000"
    },
    birthday: "1995-12-23"
  }

  const response = await paystack.charge.create(data);
  console.log('response:::::::::::::::::::::::::', response);
  res.status().send({ status: 200, data: response });
  
  paystack.charge.checkPending()
  paystack.charge.submitOTP()
}

module.exports = { 
  pstk_charge_card
}