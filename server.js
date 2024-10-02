// server.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const ics = require('ics');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Your Gmail address
    pass: process.env.APP_PASSWORD // Your Gmail app password
  }
});

// POST endpoint to send the invite
app.post('/send-invite', (req, res) => {
  const { date, userEmail } = req.body;

  // Parse the date string into a Date object
  const parsedDate = new Date(date);
  
  // Check if the parsed date is valid
  if (isNaN(parsedDate)) {
    console.error('Invalid date format:', date);
    return res.status(400).send('Invalid date format');
  }

  const event = {
    start: [
      parsedDate.getFullYear(),
      parsedDate.getMonth() + 1,
      parsedDate.getDate(),
      parsedDate.getHours(),
      parsedDate.getMinutes()
    ],
    duration: { hours: 2, minutes: 0 },
    title: 'Our Cute Date! ❤️',
    description: 'I’m really looking forward to our date! 🥰',
    location: 'Your Favorite Place', // You can replace this with a specific location
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    attendees: [
      { name: 'You', email: process.env.EMAIL }, // Your email
      { name: 'User', email: userEmail } // User's email
    ]
  };

  ics.createEvent(event, (error, value) => {
    if (error) {
      console.error('Error generating ICS file:', error);
      return res.status(500).send('Error generating invite');
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: `${userEmail}, ${process.env.EMAIL}`,
      subject: 'Yay! Our Date is Set! 🥳❤️',
      text: `Hey Marmee!

Guess what? You have officially accepted my date invite, and I couldn’t be more excited! 🥰

We're going to have a date that will make even the cheesiest rom-coms jealous. I have already started practicing my best jokes, and I promise at least some of them will make you laugh (or at least roll your eyes in a good way). Either way, we are gonna have a great time!

Details:

When: ${parsedDate.toLocaleString()}
Where: Your Favorite Place (because you deserve the best!)

Bring your awesome self, your lovely smile, and maybe an appetite for some fun surprises!

Can't wait to see you!

Cheers,
Sahil ❤️`,
      icalEvent: {
        filename: 'invite.ics',
        method: 'REQUEST',
        content: value
      }
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent:', info.response);
      res.send('Invite and email sent successfully!');
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
