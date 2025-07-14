const pool = require('../connection/pool')
const nodemailer = require("nodemailer");

module.exports.getSkill = (req, res) => {
    const query = "SELECT * FROM tbl_skill";
    try {
      pool.query(query, (err, result) => {
        if (err) {
          return res
            .status(505)
            .json({ message: "Internal server error", status: false });
        } else {
          return res.status(200).json({
            message: "Skill retrieved successfully",
            status: true,
            result,
          });
        }
      });
    } catch (e) {
      return res
        .status(500)
        .json({ message: "error in get Skill", status: false });
    }
};
  
module.exports.handleEmailSending = (req, res) => {
  const { email, name, message, subject } = req.body;
  if (!email) {
    return res.status(404).json({status : false, message : "Email is required"})
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mubark001418@gmail.com",
        pass: "qmdy iirc gqzn buts",
      },
    });
    const mailOptions = {
      from: email, // Sender's email
      to: "mubark001418@gmail.com", // Recipient's email
      subject: `New message from ${name} via Portfolio`, // Subject line
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <header style="text-align: center; background-color: #4CAF50; color: white; padding: 10px; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0; font-size: 24px;">New Message Notification</h1>
            </header>
            <main style="padding: 20px;">
                <p style="font-size: 16px; line-height: 1.5; color: #333;">
                    You have received a new message via your portfolio website.
                </p>
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">Name:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">Email:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">Subject:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${subject}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">Message:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${message}</td>
                    </tr>
                </table>
                <p style="font-size: 14px; color: #666; margin-top: 20px;">
                    Please respond to this email if necessary.
                </p>
            </main>
            <footer style="text-align: center; margin-top: 20px; padding: 10px; font-size: 14px; color: #888;">
                © ${new Date().getFullYear()} Your Portfolio. All rights reserved.
            </footer>
        </div>
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error("Error sending email:", error);
      } else {
        return res
          .status(200)
          .json({ status: true, message: "emial sent successfully", info });
      }
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: false, message: "error in email sending" });
  }
};