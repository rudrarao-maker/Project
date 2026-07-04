require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  cookie: {
    name: 'gov_token',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in ms
  },
  
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    uploadDir: process.env.UPLOAD_DIR || 'uploads/documents',
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
  },
  
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@gov-eservices.in',
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  },

  otp: {
    length: 6,
    expiresInMinutes: 10,
    maxAttempts: 5,
  },

  passwordReset: {
    expiresInMinutes: 60, // 1 hour
  },
};
