const nodemailer = require("nodemailer");
const { smtpUser, smtpPass } = require("../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: smtpUser,
    pass: smtpPass,
  },
});

const emailWithNodeMailer = async (emailData) => {
  try {
    const emailOptions = {
      from: smtpUser, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    const info = await transporter.sendMail(emailOptions);
    console.log("Message sent: %s", info.response);
  } catch (error) {
    console.error("Sending email error: ", error);
    throw error;
  }
};

module.exports = { emailWithNodeMailer };
