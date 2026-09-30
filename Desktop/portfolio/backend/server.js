const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS
    ? process.env.EMAIL_PASS.replace(/\s/g, "")
    : "";
const EMAIL_TO = process.env.EMAIL_TO;

// Check .env configuration
if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
    console.error("❌ Missing email configuration in .env");
    console.error("Required: EMAIL_USER, EMAIL_PASS, EMAIL_TO");
    process.exit(1);
}

// Gmail transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Check Gmail connection when server starts
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Gmail connection failed:");
        console.error(error.message);
    } else {
        console.log("✅ Gmail SMTP connection successful");
    }
});

// Send message
app.post("/send-message", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        console.log(`📩 New message from: ${email}`);

        // Send email
        const info = await transporter.sendMail({
            from: `"Portfolio Contact" <${EMAIL_USER}>`,
            to: EMAIL_TO,
            replyTo: email,
            subject: `New Portfolio Message from ${name}`,
            text: `
Name: ${name}
Email: ${email}

Message:
${message}
            `,
            html: `
                <h2>New Portfolio Message</h2>

                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>

                <hr>

                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, "<br>")}</p>
            `
        });

        console.log("✅ Email sent successfully:", info.messageId);

        return res.status(200).json({
            success: true,
            message: "Message sent successfully!"
        });

    } catch (error) {
        console.error("❌ Email error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send message. Please try again later."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});