import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { Resend } from 'resend';

const app = express();
const port = Number(process.env.PORT ?? 5000);
const clientUrl = process.env.CLIENT_URL;
const resend = new Resend(process.env.RESEND_API_KEY ?? '');


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: '20kb' }));

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Portfolio API is running",
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'portfolio-api' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body as { name?: unknown; email?: unknown; message?: unknown };

  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ message: 'Please enter a valid name.' });
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }
  if (typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({ message: 'Message must be at least 10 characters.' });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ message: 'Email service is not configured on the server.' });
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO_EMAIL ?? 'lapyslapy04@gmail.com'],
      replyTo: email.trim(),
      subject: `Portfolio contact from ${name.trim()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111">
          <h2>New portfolio message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name.trim())}</p>
          <p><strong>Email:</strong> ${escapeHtml(email.trim())}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(message.trim())}</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(502).json({ message: 'Email provider rejected the message.' });
    }

    return res.json({ message: 'Your message has been sent.' });
  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ message: 'Could not send your message right now.' });
  }
});

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}


app.listen(port, "0.0.0.0", () => {
  console.log(`Portfolio API running on port ${port}`);
});