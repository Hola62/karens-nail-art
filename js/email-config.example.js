// EmailJS configuration TEMPLATE
// INSTRUCTIONS:
// 1. Copy this file and rename it to: email-config.js
// 2. Replace the placeholder values with your actual EmailJS credentials
// 3. DO NOT commit email-config.js to GitHub (it's in .gitignore)

window.EMAIL_SETTINGS = {
    // Get these from https://dashboard.emailjs.com/
    serviceId: 'YOUR_SERVICE_ID_HERE',        // e.g., 'service_abc123'
    templateId: 'YOUR_TEMPLATE_ID_HERE',      // e.g., 'template_xyz789'
    publicKey: 'YOUR_PUBLIC_KEY_HERE',        // e.g., 'a1b2C3D4E5F6G7H8I'
    
    // Your business email settings
    fromEmail: 'your-email@example.com',      // Email address for replies
    fromName: "Karen's Nail Art"              // Your business name
};
