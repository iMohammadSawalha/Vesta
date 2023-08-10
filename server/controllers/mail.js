const nodemailer = require("nodemailer");
const { emailTemplate } = require("../assets/emailTemplates/verificationCode");
let transporter = nodemailer.createTransport({
  host: process.env.HOST,
  secure: true,
  port: process.env.HOST,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
const delay = 1000 * 60;
const sentEmails = [];
function removeFromSent(email) {
  const index = sentEmails.indexOf(email);
  if (index > -1) sentEmails.splice(index, 1);
}
const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Confirm your email address",
    html: emailTemplate.replace("{{CODE}}", code),
  };
  if (!sentEmails.includes(email)) {
    sentEmails.push(email);
    transporter.sendMail(mailOptions, () => {
      setTimeout(removeFromSent, delay, email);
    });
  }
};
module.exports = { sendVerificationEmail };
