const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      const config = this.getEmailConfig();
      console.log('📧 Email configuration:', {
        service: process.env.EMAIL_SERVICE,
        host: config.host,
        port: config.port,
        secure: config.secure,
        user: process.env.EMAIL_USER ? process.env.EMAIL_USER.substring(0, 10) + '***' : 'not set',
        passwordLength: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0
      });
      
      this.transporter = nodemailer.createTransport(config);
      
      if (process.env.NODE_ENV === 'development') {
        await this.testConnection();
      }
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
    }
  }

  getEmailConfig() {
    // Gmail specific configuration
    const config = {
      service: 'gmail', // Use Gmail service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    };

    // Add debug logging for development
    if (process.env.NODE_ENV === 'development') {
      config.debug = true;
      config.logger = true;
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
      
      if (error.code === 'EAUTH') {
        console.error('🔑 Gmail Authentication Issue:');
        console.error('   - Email User:', process.env.EMAIL_USER);
        console.error('   - Password Length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);
        console.error('   - Expected Password Length: 16 characters');
        console.error('   - Make sure 2FA is enabled and you are using App Password');
      }
      
      return { success: false, error: error.message };
    }
  }

  async sendOTPEmail(email, otp, purpose = 'login') {
    try {
      console.log(`📧 Attempting to send OTP email to: ${email}`);
      
      if (!this.transporter) {
        console.log('🔄 Reinitializing transporter...');
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

      console.log('📤 Mail options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ OTP email sent successfully:', result.messageId);
      
      return {
        success: true,
        messageId: result.messageId,
        provider: 'gmail',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Email sending error:', error);
      
      let errorMessage = 'Failed to send OTP email';
      
      if (error.code === 'EAUTH') {
        errorMessage = 'Gmail authentication failed. Please verify your App Password.';
        console.error('🔑 Authentication Details:');
        console.error('   - User:', process.env.EMAIL_USER);
        console.error('   - Password format correct:', /^[a-z]{16}$/.test(process.env.EMAIL_PASSWORD));
        console.error('   - Password length:', process.env.EMAIL_PASSWORD?.length);
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
