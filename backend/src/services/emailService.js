const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      const config = this.getEmailConfig();
      const emailUser = process.env.EMAIL_USER?.trim() || 'not set';
      const passwordLength = process.env.EMAIL_PASSWORD?.trim().length || 0;
      
      console.log('📧 Email configuration:', {
        service: process.env.EMAIL_SERVICE,
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: emailUser ? emailUser.substring(0, 10) + '***' : 'not set',
        passwordLength: passwordLength,
        passwordFormatValid: passwordLength === 16 && /^[a-z0-9]{16}$/.test((process.env.EMAIL_PASSWORD?.trim() || '').replace(/\s/g, ''))
      });
      
      this.transporter = nodemailer.createTransport(config);
      
      if (process.env.NODE_ENV === 'development') {
        await this.testConnection();
      }
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
      if (error.message.includes('EMAIL_USER') || error.message.includes('EMAIL_PASSWORD')) {
        console.error('💡 Please check your .env file and ensure both EMAIL_USER and EMAIL_PASSWORD are set correctly');
      }
    }
  }

  getEmailConfig() {
    // Clean and validate email credentials
    const emailUser = process.env.EMAIL_USER?.trim();
    let emailPassword = process.env.EMAIL_PASSWORD?.trim();
    
    // Remove any quotes that might be around the password
    if (emailPassword) {
      emailPassword = emailPassword.replace(/^["']|["']$/g, '');
    }
    
    // Validate credentials
    if (!emailUser) {
      throw new Error('EMAIL_USER is not set in environment variables');
    }
    
    if (!emailPassword) {
      throw new Error('EMAIL_PASSWORD is not set in environment variables');
    }
    
    // Log password info for debugging (without exposing the actual password)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Email Config Debug:');
      console.log(`   - User: ${emailUser}`);
      console.log(`   - Password length: ${emailPassword.length}`);
      console.log(`   - Password has spaces: ${emailPassword.includes(' ')}`);
      console.log(`   - Password starts/ends with quotes: ${/^["']|["']$/.test(process.env.EMAIL_PASSWORD || '')}`);
      console.log(`   - Password format (16 chars, no spaces): ${/^[a-z0-9]{16}$/.test(emailPassword)}`);
    }
    
    // Gmail: use port 587 with STARTTLS (recommended). App Password required (2FA).
    const config = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: emailUser,
        pass: emailPassword
      },
      tls: {
        rejectUnauthorized: true,
        minVersion: 'TLSv1.2'
      }
    };

    if (process.env.NODE_ENV === 'development') {
      config.logger = true;
      config.debug = true;
    }

    return config;
  }

  async testConnection() {
    try {
      console.log('🔌 Testing email connection...');
      
      if (!this.transporter) {
        throw new Error('Email transporter not initialized');
      }

      await this.transporter.verify();
      console.log('✅ Email service connected successfully');
      return { success: true, message: 'Email service connected' };
    } catch (error) {
      console.error('❌ Email connection test failed:', error.message);
      
      if (error.code === 'EAUTH' || error.message.includes('Username and Password not accepted') || error.message.includes('535-5.7.8')) {
        console.error('\n🔑 Gmail Authentication Failed:');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('📧 Current Configuration:');
        console.error(`   - Email: ${process.env.EMAIL_USER || 'NOT SET'}`);
        console.error(`   - Password Length: ${process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0} characters`);
        console.error(`   - Expected: 16 characters (Gmail App Password)`);
        console.error('');
        console.error('📋 Steps to Fix Gmail Authentication:');
        console.error('');
        console.error('1. ✅ Enable 2-Step Verification on Gmail:');
        console.error('   → Go to: https://myaccount.google.com/security');
        console.error('   → Click "2-Step Verification"');
        console.error('   → Follow the setup process');
        console.error('');
        console.error('2. ✅ Generate App Password:');
        console.error('   → Go to: https://myaccount.google.com/apppasswords');
        console.error('   → Or: Google Account → Security → 2-Step Verification → App passwords');
        console.error('   → Select "Mail" as app and "Other" as device');
        console.error('   → Enter a name (e.g., "Node.js App")');
        console.error('   → Click "Generate"');
        console.error('   → Copy the 16-character password (no spaces)');
        console.error('');
        console.error('3. ✅ Update .env File:');
        console.error('   → Open: new-website/backend/.env');
        console.error(`   → Set: EMAIL_PASSWORD=your_16_character_app_password`);
        console.error('   → Make sure there are NO spaces or quotes');
        console.error('   → Save the file');
        console.error('');
        console.error('4. ✅ Restart Server:');
        console.error('   → Stop the server (Ctrl+C)');
        console.error('   → Start again with: nodemon');
        console.error('');
        console.error('⚠️  Important Notes:');
        console.error('   - Do NOT use your regular Gmail password');
        console.error('   - App Passwords are 16 characters (no spaces)');
        console.error('   - Each App Password can only be viewed once');
        console.error('   - If you lose it, generate a new one');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }
      
      return { success: false, error: error.message };
    }
  }

  async sendOTPEmail(email, otp, purpose = 'login') {
    const sendOnce = async () => {
      if (!this.transporter) {
        await this.initializeTransporter();
      }
      if (!this.transporter) {
        throw new Error('Email transporter initialization failed');
      }
      const mailOptions = {
        from: {
          name: process.env.EMAIL_FROM_NAME || 'Admin System',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER
        },
        to: email,
        subject: this.getSubject(purpose),
        html: this.getOTPTemplate(otp, purpose),
        text: this.getOTPTextContent(otp, purpose)
      };
      return this.transporter.sendMail(mailOptions);
    };

    try {
      console.log(`📧 Sending OTP email to: ${email}`);
      
      let result;
      try {
        result = await sendOnce();
      } catch (firstError) {
        console.warn('⚠️ First send failed, retrying once...', firstError.message);
        this.transporter = null;
        result = await sendOnce();
      }

      console.log('✅ OTP email sent successfully. MessageId:', result.messageId);
      console.log('📬 Check inbox (and spam/junk) for:', email);
      
      return {
        success: true,
        messageId: result.messageId,
        provider: 'gmail',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Email sending error:', error);
      
      let errorMessage = 'Failed to send OTP email';
      
      if (error.code === 'EAUTH' || error.message.includes('Username and Password not accepted') || error.message.includes('535-5.7.8')) {
        errorMessage = 'Gmail authentication failed. Please verify your App Password.';
        const emailUser = process.env.EMAIL_USER?.trim() || 'NOT SET';
        const emailPassword = process.env.EMAIL_PASSWORD?.trim() || '';
        
        console.error('\n🔑 Authentication Error Details:');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error(`   - Email User: ${emailUser}`);
        console.error(`   - Password Length: ${emailPassword.length} characters`);
        console.error(`   - Expected: 16 characters (Gmail App Password)`);
        console.error(`   - Password Format Valid: ${/^[a-z0-9]{16}$/.test(emailPassword) ? '✅ Yes' : '❌ No (should be 16-character App Password, no spaces)'}`);
        console.error(`   - Has Spaces: ${emailPassword.includes(' ') ? '❌ Yes (remove spaces)' : '✅ No'}`);
        console.error(`   - Has Quotes: ${/^["']|["']$/.test(process.env.EMAIL_PASSWORD || '') ? '❌ Yes (remove quotes)' : '✅ No'}`);
        console.error('');
        console.error('🔍 Common Issues:');
        console.error('   1. ❌ App Password is incorrect or expired');
        console.error('   2. ❌ 2-Step Verification is not enabled');
        console.error('   3. ❌ App Password was revoked or regenerated');
        console.error('   4. ❌ Using regular Gmail password instead of App Password');
        console.error('   5. ❌ Password has hidden characters or spaces');
        console.error('');
        console.error('📋 Solution Steps:');
        console.error('   1. Go to: https://myaccount.google.com/apppasswords');
        console.error('   2. Generate a NEW App Password (old ones may be invalid)');
        console.error('   3. Copy the 16-character password (no spaces)');
        console.error('   4. Update .env file: EMAIL_PASSWORD=your_new_password');
        console.error('   5. Make sure there are NO spaces, quotes, or special characters');
        console.error('   6. Restart the server');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }
      
      throw new Error(errorMessage);
    }
  }

  getSubject(purpose) {
    return '🔐 Admin Login - Your OTP Code';
  }

  getOTPTemplate(otp, purpose) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>OTP Verification</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 0; 
                padding: 20px; 
                background: #f5f5f5; 
            }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background: white; 
                border-radius: 8px; 
                overflow: hidden; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
            }
            .header { 
                background: linear-gradient(135deg, #00BFA6, #0A2540); 
                color: white; 
                padding: 30px; 
                text-align: center; 
            }
            .content { 
                padding: 30px; 
                text-align: center; 
            }
            .otp-box { 
                background: #f8f9fa; 
                border: 2px solid #00BFA6; 
                border-radius: 8px; 
                padding: 20px; 
                margin: 20px 0; 
            }
            .otp-code { 
                font-size: 32px; 
                font-weight: bold; 
                color: #0A2540; 
                letter-spacing: 5px; 
                font-family: monospace; 
            }
            .footer { 
                background: #f8f9fa; 
                padding: 20px; 
                text-align: center; 
                color: #666; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Admin OTP Verification</h1>
                <p>Your verification code is ready</p>
            </div>
            <div class="content">
                <h2>Hello Admin!</h2>
                <p>Use this code to complete your login:</p>
                <div class="otp-box">
                    <div class="otp-code">${otp}</div>
                    <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
                        Valid for ${process.env.OTP_EXPIRY_MINUTES || 5} minutes only
                    </p>
                </div>
                <p style="color: #999; font-size: 14px;">
                    If you didn't request this code, please ignore this email.
                </p>
            </div>
            <div class="footer">
                <p>© 2025 Admin System | Automated Email</p>
                <p style="font-size: 12px;">Generated at: ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  getOTPTextContent(otp, purpose) {
    return `
Admin Login OTP: ${otp}

Your verification code is: ${otp}

This code expires in ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.

If you didn't request this code, please ignore this email.

Generated at: ${new Date().toLocaleString()}
    `;
  }

  async sendTestEmail(toEmail) {
    try {
      const testEmail = toEmail || process.env.ADMIN_EMAIL;
      
      const mailOptions = {
        from: {
          name: process.env.EMAIL_FROM_NAME || 'Admin System',
          address: process.env.EMAIL_FROM || process.env.EMAIL_USER
        },
        to: testEmail,
        subject: '✅ Gmail Configuration Test - Success!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #00BFA6, #0A2540); color: white; padding: 30px; text-align: center; border-radius: 8px;">
              <h1>🎉 Gmail Test Successful!</h1>
              <p>Your Gmail configuration is working perfectly</p>
            </div>
            <div style="padding: 30px; background: #f9f9f9; margin-top: 20px; border-radius: 8px;">
              <h2>Configuration Verified</h2>
              <p><strong>✅ Gmail Service:</strong> Connected</p>
              <p><strong>✅ Authentication:</strong> Successful</p>
              <p><strong>✅ Email Delivery:</strong> Working</p>
              <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `,
        text: `Gmail Configuration Test Successful! Test completed at: ${new Date().toLocaleString()}`
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        message: 'Test email sent successfully',
        to: testEmail,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Test email failed:', error);
      throw new Error(`Test email failed: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
