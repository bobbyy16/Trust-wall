const Waitlist = require("../models/waitlist.model.js");
const sendEmail = require("../utils/sendEmail");

const waitlistController = {
  // Join waitlist
  joinWaitlist: async (req, res) => {
    try {
      const { email, name, source } = req.body;

      // Validate required fields
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }

      // Check if email already exists
      const existingUser = await Waitlist.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "You are already on the waitlist!",
          data: {
            position: existingUser.position,
            joinedAt: existingUser.joinedAt,
          },
        });
      }

      // Create new waitlist entry
      const waitlistEntry = new Waitlist({
        email,
        name,
        source: source || "website",
      });

      await waitlistEntry.save();

      // Send welcome email
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Trust Wall Waitlist</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
              .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
              .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
              .content { padding: 40px 30px; }
              .position-badge { display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; margin: 20px 0; }
              .features { margin: 30px 0; }
              .feature { display: flex; align-items: center; margin: 15px 0; }
              .feature-icon { width: 20px; height: 20px; margin-right: 15px; color: #667eea; }
              .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
              .social-links { margin: 20px 0; }
              .social-links a { color: #667eea; text-decoration: none; margin: 0 10px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Welcome to Trust Wall!</h1>
                <p>You're now on the waitlist for the future of customer testimonials</p>
              </div>
              
              <div class="content">
                <p>Hi ${name || "there"},</p>
                
                <p>Thank you for joining the Trust Wall waitlist! We're excited to have you on board.</p>
                
                <div class="position-badge">
                  You're #${waitlistEntry.position} on the waitlist
                </div>
                
                <p>While you wait, here's what you can expect from Trust Wall:</p>
                
                <div class="features">
                  <div class="feature">
                    <span class="feature-icon">⭐</span>
                    <span>Beautiful, customizable testimonial walls</span>
                  </div>
                  <div class="feature">
                    <span class="feature-icon">🚀</span>
                    <span>Easy integration with any website</span>
                  </div>
                  <div class="feature">
                    <span class="feature-icon">📊</span>
                    <span>Advanced analytics and insights</span>
                  </div>
                  <div class="feature">
                    <span class="feature-icon">🛡️</span>
                    <span>Powerful moderation tools</span>
                  </div>
                </div>
                
                <p>We'll notify you as soon as we launch. In the meantime, feel free to follow our journey on social media!</p>
                
                <p>Best regards,<br>The Trust Wall Team</p>
              </div>
              
              <div class="footer">
                <div class="social-links">
                  <a href="#">Twitter</a>
                  <a href="#">LinkedIn</a>
                  <a href="#">Blog</a>
                </div>
                <p>© 2024 Trust Wall. All rights reserved.</p>
                <p>You're receiving this email because you signed up for our waitlist.</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await sendEmail(email, "Welcome to Trust Wall Waitlist! 🎉", emailHtml);

        // Mark email as sent
        waitlistEntry.emailSent = true;
        await waitlistEntry.save();
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the request if email fails
      }

      res.status(201).json({
        success: true,
        message: "Successfully joined the waitlist!",
        data: {
          position: waitlistEntry.position,
          joinedAt: waitlistEntry.joinedAt,
          emailSent: waitlistEntry.emailSent,
        },
      });
    } catch (error) {
      console.error("Waitlist join error:", error);

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Email already exists on waitlist",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error. Please try again later.",
      });
    }
  },

  // Get waitlist stats
  getWaitlistStats: async (req, res) => {
    try {
      const totalCount = await Waitlist.countDocuments();
      const recentJoins = await Waitlist.find()
        .sort({ joinedAt: -1 })
        .limit(5)
        .select("email name joinedAt position");

      res.json({
        success: true,
        data: {
          totalCount,
          recentJoins,
        },
      });
    } catch (error) {
      console.error("Stats error:", error);
      res.status(500).json({
        success: false,
        message: "Could not fetch stats",
      });
    }
  },

  // Check position by email
  checkPosition: async (req, res) => {
    try {
      const { email } = req.params;

      const user = await Waitlist.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Email not found on waitlist",
        });
      }

      res.json({
        success: true,
        data: {
          position: user.position,
          joinedAt: user.joinedAt,
          emailSent: user.emailSent,
        },
      });
    } catch (error) {
      console.error("Position check error:", error);
      res.status(500).json({
        success: false,
        message: "Could not check position",
      });
    }
  },
};

module.exports = waitlistController;
