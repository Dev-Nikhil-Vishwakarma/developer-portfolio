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
    origin: "https://developer-portfolio-bthh.vercel.app",
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

app.post('/api/contect', async (req, res) => {
  const { name, email, message } = req.body as {
    name?: unknown;
    email?: unknown;
    message?: unknown;
  };
  console.log("CONTACT REQUEST RECEIVED");
  console.log(req.body);

  console.log("Contact request received");

  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      message: 'Please enter a valid name.',
    });
  }

  if (
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return res.status(400).json({
      message: 'Please enter a valid email address.',
    });
  }

  if (typeof message !== 'string' || message.trim().length < 10) {
    return res.status(400).json({
      message: 'Message must be at least 10 characters.',
    });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing');

    return res.status(500).json({
      message: 'Email service is not configured on the server.',
    });
  }

  try {
    console.log("Sending email through Resend...");

    const { data, error } = await resend.emails.send({
      from:
        process.env.CONTACT_FROM_EMAIL ??
        'Portfolio <onboarding@resend.dev>',

      to: [
        process.env.CONTACT_TO_EMAIL ??
        'lapyslapy04@gmail.com',
      ],

      replyTo: email.trim(),

      subject: `Portfolio contact from ${name.trim()}`,

      html: `
       <div style="margin:0;padding:40px 20px;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#171717;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e8e8e8;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.06);">

      <!-- Header -->
      <div style="padding:32px 36px;border-bottom:1px solid #eeeeee;">
        <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#777777;margin-bottom:10px;">
          Portfolio Contact
        </div>

        <h1 style="margin:0;font-size:26px;line-height:1.3;font-weight:600;color:#111111;">
          New message received
        </h1>

        <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:#777777;">
          Someone has contacted you through your developer portfolio.
        </p>
      </div>

      <!-- Contact information -->
      <div style="padding:30px 36px 10px;">

        <div style="margin-bottom:22px;">
          <div style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#999999;margin-bottom:7px;">
            From
          </div>

          <div style="font-size:16px;font-weight:600;color:#171717;">
            ${escapeHtml(name.trim())}
          </div>
        </div>

        <div style="margin-bottom:24px;">
          <div style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#999999;margin-bottom:7px;">
            Email
          </div>

          <a
            href="mailto:${escapeHtml(email.trim())}"
            style="font-size:15px;color:#171717;text-decoration:none;border-bottom:1px solid #cccccc;padding-bottom:2px;"
          >
            ${escapeHtml(email.trim())}
          </a>
        </div>

      </div>

      <!-- Message -->
      <div style="padding:0 36px 36px;">

        <div style="font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#999999;margin-bottom:10px;">
          Message
        </div>

        <div style="padding:22px;background:#f8f8f8;border:1px solid #eeeeee;border-radius:12px;">
          <p style="margin:0;font-size:15px;line-height:1.8;color:#333333;white-space:pre-wrap;">
            ${escapeHtml(message.trim())}
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div style="padding:20px 36px;background:#fafafa;border-top:1px solid #eeeeee;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:#999999;">
          This message was sent through your developer portfolio contact form.
        </p>
      </div>

    </div>
  </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return res.status(502).json({
        message: 'Email provider rejected the message.',
        error: error.message,
      });
    }

    console.log("Email sent successfully:", data);

    return res.status(200).json({
      message: 'Your message has been sent.',
    });

  } catch (error) {
    console.error("Contact error:", error);

    return res.status(500).json({
      message: 'Could not send your message right now.',
    });
  }
});

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}


app.listen(port, "0.0.0.0", () => {
  console.log(`Portfolio API running on port ${port}`);
});