'use strict';
const stripe = require('stripe')(process.env.STRIPE_SECRET)

module.exports.balanceHandler = (event, context, callback) => {

  stripe.balance.retrieve({
  }).then( bal => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'SUCCESS',
          balance: bal
        })
      }
      callback(null, response)
  }).catch ( e => {
      const response = {
        statusCode: 500,

        body: JSON.stringify({
          message: 'STRIPE ERROR',
          input: event,
          error: e
        })
      }
      callback(null, response)
  })
}
