# OTP Email Setup (Gmail)

Abhi Gmail **Username and Password not accepted** aa raha hai, isliye OTP sirf console pe dikh raha hai. Email pe bhejne ke liye ye steps follow karo.

## Steps (mdgafrujamaansri@gmail.com ke liye)

1. **2-Step Verification ON karo**
   - Open: https://myaccount.google.com/security
   - "2-Step Verification" pe click karke enable karo

2. **App Password banao**
   - Open: https://myaccount.google.com/apppasswords
   - App: **Mail**, Device: **Other** (name: "Node OTP" ya kuch bhi)
   - **Generate** pe click karo
   - Jo **16-character password** dikhe (bina spaces), use copy karo

3. **.env update karo**
   - Open: `backend/.env`
   - Line: `EMAIL_PASSWORD=eoaclcechmyavqpy`
   - Isko replace karo: `EMAIL_PASSWORD=your_16_char_app_password` (jo step 2 mein mila)
   - Koi space ya quotes mat add karo

4. **Backend restart karo**
   - Terminal: Ctrl+C, phir `nodemon` ya `npm start`

5. **Test karo**
   - Browser: http://localhost:5000/api/auth/test-email
   - Agar "success" aaye to OTP ab email pe bhi jayega

## Note

- **Normal Gmail password mat use karo** – sirf App Password chalega
- App Password sirf ek baar dikhta hai; agar lose ho jaye to naya generate karo
