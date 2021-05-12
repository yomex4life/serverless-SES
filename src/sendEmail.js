const Responses = require('../common/responseBuilder')
const AWS = require('aws-sdk')

const SES = new AWS.SES()

exports.handler  = async event =>{
    console.log('event', event)

    const body = JSON.parse(event.body);

    if(!body || !body.to || !body.subject || !body.text || !body.from){
        return Responses.buildResponse(400, {
            message: 'Missing details. All fields are required'
        })
    }

    const params = {
        Message: {
            Body: {
                Text: {Data: body.text}
            },
            Subject: {Data: body.subject}
        },
        
        Destination: {
            ToAddresses: [body.to]
        },
        Source: body.from
    }

    try {
        //await SNS.setSMSAttributes(AttributeParams).promise()
        await SES.sendEmail(params).promise()

        return Responses.buildResponse(200, {
            message: 'Email has been sent '
        })
    } catch (error) {
        console.log('error', error)
        return Responses.buildResponse(400, {
            message: 'Unable to send message'
        })
    }
}