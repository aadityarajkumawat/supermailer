const nodemailer = require("nodemailer");
const fs = require("fs");

function getEmailList(fileName) {
  const data = fs.readFileSync(fileName, "utf8");
  const emailList = JSON.parse(data);
  return emailList.emails;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    // user: "arkumawat78@gmail.com",
    // pass: "wenposwnwujtcrmq",
    user: "aaditya01work@gmail.com",
    pass: "yiocstfakojpnwyh",
  },
});

const logoImage = (email, emailId) =>
  "https://api.datajunction.pro/api/analytics/eo?email=" +
  email +
  "&emailId=" +
  emailId;

function getEmailHtml(emailId, name, subject) {
  return function getEmailContent(email) {
    let file = fs.readFileSync(`emails/${emailId}/index.html`, "utf8");
    file = file.replace("[PN]", name);
    return file;
  };
}

async function sendEmail(to, subject, html, emailId) {
  const info = await transporter.sendMail({
    // from: '"Aditya Raj Kumawat" <arkumawat78@gmail.com>',
    from: '"Edy from Data Junction" <aaditya01work@gmail.com>',
    to,
    subject,
    html,
  });

  console.log("Message sent: %s", info.messageId, to);
}

function getSubject(subjectFile) {
  return fs.readFileSync(subjectFile, "utf8");
}

async function main() {
  try {
    if (process.argv.length < 3) {
      throw new Error("Please provide email list file and email id");
    }
    const emailListFile = process.argv[2];
    const emailId = process.argv[3];
    const emailList = getEmailList(emailListFile);
    const subject = getSubject(`emails/${emailId}/subject.txt`);

    console.log(emailId);
    console.log(emailList);
    console.log(subject);

    // const promises = emailList.map(({ email, name }) => {
    //   const html = getEmailHtml(emailId, name, subject)(email);
    //   return sendEmail(email, subject, html, emailId);
    // });

    // await Promise.all(promises);

    for (let i = 0; i < emailList.length; i++) {
      const { email, name } = emailList[i];
      const html = getEmailHtml(emailId, name, subject)(email);
      await sendEmail(email, subject, html, emailId);
      console.log("Email sent to: ", email);
    }
  } catch (error) {
    console.log(error);
  }
}

main();
