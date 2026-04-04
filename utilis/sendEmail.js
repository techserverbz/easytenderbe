const nodemailer = require('nodemailer')

const sendEmail = async options => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: 'pmc.neomodernarch@gmail.com',
            pass: 'zfsm pjmq nrme kbvj'
        }
    });
    // ////console.log(transporter)
    const message = {
        from: `${process.env.SMTP_FROM_NAME} ${process.env.SMTP_FROM_EMAIL}`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(message)
}

module.exports = sendEmail