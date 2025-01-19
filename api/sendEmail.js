const nodemailer = require('nodemailer');
const formidable = require('formidable');
const fs = require('fs');
const fetch = require('node-fetch');

export const config = {
    api: {
        bodyParser: false,
    },
};

async function verifyRecaptcha(token) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const googleResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: new URLSearchParams({
            secret: secretKey,
            response: token,
        }),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const googleResult = await googleResponse.json();
    return googleResult.success && googleResult.score >= 0.7;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form: ', err);
            return res.status(500).json({ error: 'Error processing form data' });
        }

        const { 'g-recaptcha-response': name, email, phone, message, captchaToken } = fields;

        const isHuman = await verifyRecaptcha(captchaToken);
        if (!isHuman) {
            return res.status(400).json({ error: 'reCAPTCHA validation failed.' });
        }

        const attachments = [];
        if (files.files && Object.keys(files.files).length > 0) {
            const fileList = Array.isArray(files.files) ? files.files : [files.files];
            fileList.forEach(file => {
                if (file && file.filepath && fs.existsSync(file.filepath)) {
                    attachments.push({
                        filename: file.originalFilename || 'unknown',
                        path: file.filepath,
                    });
                }
            });
        }

        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: `${name}`
                to: process.env.SMTP_USER,
                subject: `[prevodach.at] New Request from ${name}`,
                text: `Message: \n${message}\n\nName: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}`,
                attachments,
            });

            res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            console.error('Error sending email: ', error);
            res.status(500).json({ error: 'Failed to send email' });
        } finally {
            attachments.forEach(att => fs.unlink(att.path, () => {}));
        }
    });
}
