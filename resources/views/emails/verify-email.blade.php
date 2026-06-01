<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>Verify your email</title>
  <style>
    body { margin:0; padding:0; background:#080c12; font-family:'Segoe UI',sans-serif; }
    .wrapper { max-width:520px; margin:40px auto; background:#0d1117; border:1px solid #1f2d3d; border-radius:16px; overflow:hidden; }
    .header { background:#1e3a5f; padding:32px 40px; text-align:center; border-bottom:2px solid #4f9cf9; }
    .header h1 { margin:0; color:#ffffff; font-size:22px; font-weight:700; }
    .header p { margin:6px 0 0; color:#7ab3f0; font-size:14px; }
    .body { padding:36px 40px; }
    .body p { color:#8899aa; font-size:15px; line-height:1.7; margin:0 0 20px; }
    .body strong { color:#e8edf5; }
    .btn { display:block; width:fit-content; margin:28px auto; padding:14px 36px; background:linear-gradient(135deg,#4f9cf9,#3b82f6); color:#ffffff; text-decoration:none; border-radius:10px; font-size:15px; font-weight:600; }
    .footer { padding:20px 40px; text-align:center; border-top:1px solid #1f2d3d; }
    .footer p { color:#3a5270; font-size:12px; margin:0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>FetchBucks</h1>
      <p>Personal Expense Tracker</p>
    </div>
    <div class="body">
      <p>Hi <strong>{{ $name }}</strong>,</p>
      <p>Thanks for signing up! Please verify your email address to activate your account.</p>
      <a href="{{ $verificationUrl }}" class="btn">Verify Email Address</a>
      <p>This link expires in <strong>24 hours</strong>. If you did not create an account, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>© {{ date('Y') }} FetchBucks. All rights reserved.</p>
    </div>
  </div>
</body>
</html>