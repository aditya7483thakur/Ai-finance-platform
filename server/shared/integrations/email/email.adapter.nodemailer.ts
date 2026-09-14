import nodemailer from "nodemailer";
import type { EmailSender } from "./email.port.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailNodemailerAdapter: EmailSender = {
  send: async ({ to, subject, html }) => {
    try {
      await transporter.sendMail({
        from: `"Budgetly" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.info(`Email sent to ${to}`);
    } catch (err) {
      console.error("Failed to send email:", err);
      throw err;
    }
  },
};
