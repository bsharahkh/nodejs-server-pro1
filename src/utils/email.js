const nodemailer = require("nodemailer");
const { EMAIL } = require("../config");

let transporter;
if (EMAIL.host && EMAIL.user && EMAIL.pass) {
  transporter = nodemailer.createTransport({
    host: EMAIL.host,
    port: EMAIL.port,
    secure: false,
    auth: { user: EMAIL.user, pass: EMAIL.pass },
  });
}

exports.send = async ({ to, subject, text }) => {
  if (!transporter) {
    console.log(`[email disabled] To:${to} Subject:${subject} Text:${text}`);
    return;
  }
  await transporter.sendMail({ from: EMAIL.user, to, subject, text });
};
