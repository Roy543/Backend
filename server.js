const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const ics = require('ics');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'https://date-invite-eight.vercel.app', // Allow your Vercel frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

app.post('/send-invite', (req, res) => {
  // Set CORS headers for the response
  res.setHeader('Access-Control-Allow-Origin', 'https://date-invite-eight.vercel.app'); // Allow your Vercel frontend URL
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const { date, userEmail } = req.body;

  // Your existing code for parsing date and creating the event...

  ics.createEvent(event, (error, value) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error generating invite');
    }

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sahilsas88@gmail.com',
        pass: 'svsb nccn azqx axcv', // Use app password for security
      },
    });

    const mailOptions = {
      from: 'sahilsas88@gmail.com',
      to: `${userEmail}, sahilsas88@gmail.com`,
      subject: 'Yay! Our Date is Set! 🥳❤️',
      text: `
Hey Marmee!

Guess what? You have officially accepted my date invite, and I couldn’t be more excited! 🥰

We're going to have a date that will make even the cheesiest rom-coms jealous. I have already started practicing my best jokes, and I promise at least some of them will make you laugh (or at least roll your eyes in a good way). Either way, we are gonna have a great time!

Details:

Where: Your Favorite Place (because you deserve the best!)

Bring your awesome self, your lovely smile, and maybe an appetite for some fun surprises!

Can't wait to see you!

Cheers,
Sahil ❤️
      `,
      icalEvent: {
        filename: 'invite.ics',
        method: 'REQUEST',
        content: value,
      },
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending email');
      }
      res.send('Invite and email sent successfully!');
    });
  });
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
