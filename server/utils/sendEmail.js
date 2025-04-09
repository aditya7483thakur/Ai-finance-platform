import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email.
 * @param {string} to - Receiver email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 */
export async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"Budgetly" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}
