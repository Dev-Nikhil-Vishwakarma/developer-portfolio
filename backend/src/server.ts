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
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Portfolio Message</title>
</head>

<body style="margin:0;padding:0;background:#f7f7f5;font-family:Arial,Helvetica,sans-serif;color:#181818;">

  <div style="width:100%;padding:48px 20px;background:#f7f7f5;box-sizing:border-box;">

    <div style="
      max-width:680px;
      margin:0 auto;
      background:#ffffff;
      border:1px solid #e6e6e3;
      border-radius:20px;
      overflow:hidden;
    ">

      <!-- Top accent -->
      <div style="
        height:4px;
        background:#181818;
        width:100%;
      "></div>

      <!-- Header -->
      <div style="padding:42px 44px 34px;border-bottom:1px solid #eeeeeb;">

        <div style="
          display:inline-block;
          padding:7px 11px;
          border:1px solid #e5e5e2;
          border-radius:999px;
          color:#777773;
          font-size:10px;
          font-weight:600;
          letter-spacing:1.4px;
          text-transform:uppercase;
        ">
          Portfolio
        </div>

        <h1 style="
          margin:22px 0 10px;
          font-size:30px;
          line-height:1.2;
          font-weight:600;
          letter-spacing:-0.7px;
          color:#111111;
        ">
          New message
        </h1>

        <p style="
          margin:0;
          font-size:14px;
          line-height:1.7;
          color:#858581;
        ">
          A new person has reached out through your portfolio.
        </p>

      </div>

      <!-- Sender information -->
      <div style="padding:34px 44px 8px;">

        <div style="
          font-size:10px;
          font-weight:600;
          letter-spacing:1.5px;
          text-transform:uppercase;
          color:#999994;
          margin-bottom:20px;
        ">
          Contact details
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" border="0">

          <tr>
            <td style="
              width:50%;
              padding:0 20px 24px 0;
              vertical-align:top;
            ">

              <div style="
                font-size:11px;
                color:#999994;
                margin-bottom:7px;
              ">
                Name
              </div>

              <div style="
                font-size:15px;
                font-weight:600;
                color:#222222;
              ">
                ${escapeHtml(name.trim())}
              </div>

            </td>

            <td style="
              width:50%;
              padding:0 0 24px 20px;
              vertical-align:top;
              border-left:1px solid #eeeeeb;
            ">

              <div style="
                font-size:11px;
                color:#999994;
                margin-bottom:7px;
              ">
                Email
              </div>

              <a
                href="mailto:${escapeHtml(email.trim())}"
                style="
                  font-size:14px;
                  color:#222222;
                  text-decoration:none;
                  word-break:break-word;
                "
              >
                ${escapeHtml(email.trim())}
              </a>

            </td>
          </tr>

        </table>

      </div>

      <!-- Message -->
      <div style="padding:18px 44px 42px;">

        <div style="
          font-size:10px;
          font-weight:600;
          letter-spacing:1.5px;
          text-transform:uppercase;
          color:#999994;
          margin-bottom:14px;
        ">
          Message
        </div>

        <div style="
          background:#fafaf9;
          border:1px solid #e9e9e6;
          border-radius:14px;
          padding:24px;
        ">

          <p style="
            margin:0;
            font-size:15px;
            line-height:1.85;
            color:#333333;
            white-space:pre-wrap;
            word-break:break-word;
          ">
            ${escapeHtml(message.trim())}
          </p>

        </div>

      </div>

      <!-- Footer -->
      <div style="
        padding:22px 44px;
        border-top:1px solid #eeeeeb;
        background:#fcfcfb;
      ">

        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>

            <td style="
              font-size:11px;
              color:#999994;
              line-height:1.5;
            ">
              Developer Portfolio
            </td>

            <td style="
              text-align:right;
              font-size:11px;
              color:#b0b0ab;
              line-height:1.5;
            ">
              New contact
            </td>

          </tr>
        </table>

      </div>

    </div>

    <div style="
      max-width:680px;
      margin:18px auto 0;
      text-align:center;
      font-size:10px;
      color:#aaa9a4;
      letter-spacing:0.3px;
    ">
      Sent securely from your portfolio contact form
    </div>

  </div>

</body>
</html>
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