'use strict'

const stripe = require('stripe')(process.env.STRIPE_SECRET)

module.exports.payoutsHandler = (event, context, callback) => {

  stripe.payouts.list({
  }).then( payouts => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'SUCCESS',
          payouts: payouts
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
