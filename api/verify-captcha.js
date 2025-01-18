const fetch = require('node-fetch');

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { 'g-recaptcha-response': captchaToken, ...formData } = req.body;

        const secretKey = process.env.RECAPTCHA_SECRET_KEY;

        try {
            const googleResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                body: new URLSearchParams({
                    secret: secretKey,
                    response: captchaToken,
                }),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const googleResult = await googleResponse.json();

            if (googleResult.success) {
                res.status(200).json({ success: true });
            } else {
                res.status(400).json({ error: 'reCAPTCHA validation failed.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error verifying reCAPTCHA.' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
