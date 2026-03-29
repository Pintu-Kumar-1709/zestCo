import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
 service:"gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from : `"ZestCo" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  })
}