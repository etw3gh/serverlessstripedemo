'use strict'
const AWS = require('aws-sdk')


const err = (error, msg, statusCode, body) => {
    const response = {
      statusCode: statusCode,
      body: {
        message: msg,
        error: error,
        body: body
      }
    }
    return response
}



module.exports.sendemailHandler = (event, context, callback) => {
  let ses = null
  let emailParams = {}

  const bodyData = event.body.bodyData
  const bodyCharset = 'UTF-8'
  const subjectData = event.body.subjectData
  const subjectCharset = bodyCharset
  const sourceEmail = process.env.SES_SENDER

  try {
    ses = new AWS.SES({region: process.env.REGION})
  }
  catch (e) {
    const response = err(e, 'SES INIT ERROR', 500, event.body)
    callback(null, response)
  }

  emailParams = {
    Destination: {
      BccAddresses: [],
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
        Data: subjectData,
        Charset: subjectCharset
      }
    },
    Source: sourceEmail,
    ReplyToAddresses: [process.env.SES_SENDER]
  }

  try {
    // obtain a promise
    const sesPromise = ses.sendEmail(emailParams).promise()

    // handle promise
    sesPromise.then( (sesResponse) => {
        const response = {
          statusCode: 200,
          body: {
            message: 'SUCCESS',
            sesesponse: sesResponse
          }
        }
        callback(null, response)
    }).catch( (e) => {
        const response = err(e, 'SES SENDING ERROR', 500, event.body)
        callback(null, response)
    })
  }
  catch (e) {
    const response = err(e, 'SES PROMISE ERROR', 500, event.body)
    callback(null, response)
  }
}
