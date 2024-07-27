const formData = require('form-data');
const Mailgun = require('mailgun.js');

const sendEmail = (toEmailAddress, emailSubject, emailHTMLBody) => {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});
    mg.messages.create(process.env.MAILGUN_EMAIL_DOMAIN, {
        from: process.env.FROM_EMAIL,
        to: toEmailAddress,
        subject: emailSubject,
        html: emailHTMLBody
      })
      .then(msg => console.log(msg)) // logs response data
      .catch(err => console.error(err)); // logs any error
}

module.exports ={
    sendEmail
} 


