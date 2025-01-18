const nodemailer = require('nodemailer');
import formidable from 'formidable';
import fs from 'fs';


export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error parsing form: ', err);
            return res.status(500).json({ error: 'Error processing form data' });
        }

        const { name, email, phone, message } = fields;
        const attachments = [];

        if (files.files) {
            const fileList = Array.isArray(files.files) ? files.files : [files.files];
            fileList.forEach(file => {
                attachments.push({
                    filename: file.originalFilename,
                    path: file.filepath,
                });
            });
        }

        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
            });

            await transporter.sendMail({
                from: `${name}`,
                to: process.env.SMTP_USER,
                subject: `[prevodach.at] New Request from ${name}`,
                text: `Message: \n${message}\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`,
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
