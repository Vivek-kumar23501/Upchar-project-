import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification OTP",
        html: `
            <h2>Email Verification</h2>
            <p>Your OTP is:</p>

            <h1 style="letter-spacing:5px;color:blue;">
                ${otp}
            </h1>

            <p>This OTP is valid for 5 minutes.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export default sendOTP;