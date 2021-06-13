const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
require('dotenv').config()

class CreateSenderSendgrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    return await sgMail.send({ ...msg, from: 'a.rudkovskyy@gmail.com' })
  }
}

class CreateSenderNodemailer {
  async send(msg) {
    const options = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: 'goitnodejs@meta.ua',
        pass: process.env.PASSWORD,
      },
    }

    const transporter = nodemailer.createTransport(options)
    const emailOptions = {
      from: 'goitnodejs@meta.ua',
      ...msg,
    }

    return await transporter
      .sendMail(emailOptions)
  }
}

module.exports = { CreateSenderSendgrid, CreateSenderNodemailer }
