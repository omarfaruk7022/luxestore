import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
});

export async function sendStoreCredentials({
  to,
  storeName,
  adminEmail,
  tempPassword,
  ownerName,
}) {
  await transporter.sendMail({
    from: `"Luxe" <${process.env.MAIL_USER}>`,
    to,
    subject: `Your Store "${storeName}" is Ready!`,
    html: `
<div style="margin:0;padding:50px;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  
  <div style="max-width:560px;margin:60px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:28px 32px;color:white;">
      <h2 style="margin:0;font-size:22px;font-weight:600;">Welcome, ${ownerName} </h2>
      <p style="margin:6px 0 0;font-size:14px;opacity:0.9;">
        Your store <strong>${storeName}</strong> is now live 
      </p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      
      <p style="margin:0 0 20px;color:#555;font-size:14px;line-height:1.6;">
        We're excited to let you know that your store has been successfully approved and is ready to use.
      </p>

      <!-- Credentials Card -->
      <div style="background:#f9fafb;border:1px solid #eef0f3;border-radius:12px;padding:20px;margin-bottom:24px;">
        
        <p style="margin:0 0 12px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">
          Admin Credentials
        </p>

        <p style="margin:8px 0;font-size:14px;color:#333;">
          <strong>Email:</strong> ${adminEmail}
        </p>

        <p style="margin:8px 0;font-size:14px;color:#333;">
          <strong>Password:</strong> 
          <span style="display:inline-block;background:#eef2ff;color:#4338ca;padding:4px 10px;border-radius:6px;font-family:monospace;font-size:13px;">
            ${tempPassword}
          </span>
        </p>

      </div>

      <!-- CTA Button -->
      <div style="text-align:center;margin-bottom:24px;">
        <a href="#" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:500;">
          Login to Dashboard
        </a>
      </div>

      <!-- Note -->
      <p style="margin:0 0 12px;color:#e11d48;font-size:13px;">
         Please change your password after your first login.
      </p>

      <p style="margin:0;color:#777;font-size:13px;">
        Need help? Just reply to this email — we're here for you.
      </p>

    </div>

    <!-- Footer -->
    <div style="border-top:1px solid #f1f1f1;padding:18px 32px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#aaa;">
        Powered by <strong style="color:#4f46e5;">Luxe</strong>
      </p>
    </div>

  </div>

</div>
`,
  });
}
