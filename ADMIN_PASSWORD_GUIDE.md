# Admin Password Change Guide

## How to Change Admin Password

You have successfully set up a more secure authentication system! Here are the different ways to change your admin password:

### **Method 1: Environment Variables (Recommended)**

1. **Edit the `.env` file**:
   ```env
   VITE_ADMIN_USERNAME=admin
   VITE_ADMIN_PASSWORD=your_new_secure_password
   ```

2. **Restart the development server** for changes to take effect:
   ```bash
   npm run start
   ```

### **Method 2: Direct Code Change (Quick)**

1. **Edit `src/utils/auth.js`**:
   ```javascript
   export const ADMIN_CREDENTIALS = {
     username: 'admin',
     password: 'your_new_password'  // Change this
   };
   ```

2. **Save the file** - changes will be applied immediately in development.

---

## **Current Setup:**

### **Username:** `admin` (can be changed in .env)
### **Password:** `your_secure_password_123` (change this in .env)

---

## **How to Test:**

1. **Go to admin login page**: `http://localhost:5174/admin/login`
2. **Use your new credentials**:
   - Username: `admin`
   - Password: `your_secure_password_123` (or whatever you set)
3. **Click "Sign In"**

---

## **Security Best Practices:**

### ✅ **Recommended:**
- Use environment variables (`.env` file)
- Choose a strong password (8+ characters, mix of letters, numbers, symbols)
- Don't commit real passwords to version control
- Change the default password immediately

### ❌ **Avoid:**
- Using simple passwords like "123456" or "password"
- Hardcoding passwords in source code
- Sharing credentials in public repositories

---

## **Password Requirements:**
- **Minimum length**: 8 characters
- **Recommended**: Include uppercase, lowercase, numbers, and symbols
- **Examples of strong passwords**:
  - `AdminPass2024!`
  - `MySecure#Admin123`
  - `CEM_EventManager_2024`

---

## **Production Deployment:**

For production environments, consider implementing:

1. **Database-stored credentials** with hashing
2. **JWT token authentication**
3. **Multi-factor authentication (MFA)**
4. **Password complexity requirements**
5. **Session timeout and security**

---

## **Troubleshooting:**

### **If login doesn't work:**
1. Check that you restarted the server after changing .env
2. Verify the password in .env matches what you're typing
3. Clear browser cache/localStorage
4. Check browser console for any errors

### **To reset to defaults:**
1. Remove custom password from .env
2. The fallback will be `your_new_password_here` from auth.js

---

## **Next Steps:**

1. **Change the password** in `.env` to something secure
2. **Test the login** with your new credentials
3. **Consider implementing** more robust authentication for production

Your admin panel is now more secure! 🔐
