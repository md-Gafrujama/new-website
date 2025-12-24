/**
 * Simple Gmail Connection Test Script
 * Run this to test your Gmail App Password configuration
 * Usage: node test-email.js
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

async function testGmailConnection() {
  console.log('🧪 Testing Gmail Connection...\n');
  
  // Get and clean credentials
  const emailUser = process.env.EMAIL_USER?.trim();
  let emailPassword = process.env.EMAIL_PASSWORD?.trim();
  
  // Remove quotes if present
  if (emailPassword) {
    emailPassword = emailPassword.replace(/^["']|["']$/g, '');
  }
  
  // Validate
  if (!emailUser) {
    console.error('❌ ERROR: EMAIL_USER is not set in .env file');
    process.exit(1);
  }
  
  if (!emailPassword) {
    console.error('❌ ERROR: EMAIL_PASSWORD is not set in .env file');
    process.exit(1);
  }
  
  console.log('📋 Configuration Check:');
  console.log(`   ✅ Email User: ${emailUser}`);
  console.log(`   ${emailPassword.length === 16 ? '✅' : '❌'} Password Length: ${emailPassword.length} (expected: 16)`);
  console.log(`   ${/^[a-z]{16}$/.test(emailPassword) ? '✅' : '❌'} Password Format: ${/^[a-z]{16}$/.test(emailPassword) ? 'Valid (16 lowercase letters)' : 'Invalid (should be 16 lowercase letters)'}`);
  console.log(`   ${!emailPassword.includes(' ') ? '✅' : '❌'} No Spaces: ${emailPassword.includes(' ') ? 'Has spaces (remove them)' : 'No spaces'}`);
  console.log('');
  
  // Create transporter
  console.log('🔌 Attempting to connect to Gmail...\n');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });
  
  try {
    // Test connection
    await transporter.verify();
    console.log('✅ SUCCESS! Gmail connection verified!');
    console.log('   Your App Password is working correctly.\n');
    
    // Try sending a test email
    console.log('📧 Attempting to send test email...');
    const info = await transporter.sendMail({
      from: `"Test" <${emailUser}>`,
      to: emailUser,
      subject: '✅ Gmail Test - Success!',
      text: 'If you receive this email, your Gmail configuration is working perfectly!',
      html: '<p>If you receive this email, your Gmail configuration is working perfectly!</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log('   Check your inbox for the test email.\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ CONNECTION FAILED!\n');
    
    if (error.code === 'EAUTH' || error.message.includes('535-5.7.8') || error.message.includes('Username and Password not accepted')) {
      console.error('🔑 Authentication Error:');
      console.error('   Your App Password is being rejected by Gmail.\n');
      console.error('📋 Possible Causes:');
      console.error('   1. ❌ App Password is incorrect');
      console.error('   2. ❌ 2-Step Verification is not enabled');
      console.error('   3. ❌ App Password was revoked or expired');
      console.error('   4. ❌ Using regular Gmail password instead of App Password');
      console.error('   5. ❌ Password has hidden characters\n');
      console.error('📋 Solution:');
      console.error('   1. Go to: https://myaccount.google.com/apppasswords');
      console.error('   2. Generate a NEW App Password');
      console.error('   3. Copy the 16-character password (no spaces)');
      console.error('   4. Update .env: EMAIL_PASSWORD=your_new_password');
      console.error('   5. Run this test again: node test-email.js\n');
    } else {
      console.error('Error:', error.message);
      console.error('\nFull error:', error);
    }
    
    process.exit(1);
  }
}

// Run the test
testGmailConnection();

