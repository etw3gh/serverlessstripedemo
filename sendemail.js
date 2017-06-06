'use strict'
const AWS = require('aws-sdk')

module.exports.sendemailHandler = (event, context, callback) => {

  let ses = new AWS.SES({region: process.env.REGION})

  const bodyData = event.body.bodyData
  const bodyCharset = 'UTF-8'
  const subjectdata = event.body.subjectdata
  const subjectCharset = bodyCharset
  const sourceEmail = process.env.SES_SENDER

  let emailParams = {
    Destination: {
      BccAddresses: [process.env.SES_SENDER],
      CcAddresses: [],
      ToAddresses: [process.env.SES_SENDER]
    },
    Message: {
      Body: {
        Text: {
          Data: bodyData,
          Charset: bodyCharset
        }
      },
      Subject: {
        Data: subjectdata,
        Charset: subjectCharset
      }
    },
    Source: sourceEmail,
    ReplyToAddresses: process.env.SES_SENDER
  }

  // obtain a promise
  const sesPromise = ses.sendEmail(emailParams)


  // handle promise
  sesPromise.then( sesResponse => {
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'SUCCESS',
          sesResponse: sesResponse
        })
      }
      callback(null, response)
  }).catch( e => {
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'SES ERROR',
          input: event,
          error: e
        })
      }
      callback(null, response)
  })

}
