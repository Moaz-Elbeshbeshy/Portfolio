const express = require('express');
const sgMail = require('@sendgrid/mail');  // Import SendGrid
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();  // Load .env file

const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://127.0.0.1:8080', // Allow requests from this origin
    methods: ['GET', 'POST'], // Allow these methods
}));


//for testing
console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);  // Make sure to add your SendGrid API key in .env

// Create a route to handle the form submission
app.post('/send-email', (req, res) => {
    const { fullname, email, message } = req.body;

    // Validate input
    if (!fullname || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Set up email data
    const msg = {
        to: 'awladnasem800@gmail.com',
        from: 'awladnasem800@gmail.com',
        replyTo: email,
        subject: `New message from ${fullname}`,
        text: message,
        html: `<p><strong>Name:</strong> ${fullname}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong><br/> ${message}</p>`
    };

    // Send email via SendGrid
    sgMail
        .send(msg)
        .then(() => {
            res.status(200).json({ message: 'Message sent successfully' });
        })
        .catch((error) => {
            console.error('SendGrid Error:', error.response ? error.response.body : error);
            res.status(500).json({ error: 'Error sending message', details: error.message });
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
