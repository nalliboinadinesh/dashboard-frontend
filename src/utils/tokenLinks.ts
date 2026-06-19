/**
 * Utility for generating tenant dashboard links with JWT tokens
 * Used in email templates and invitation systems
 */

export const generateTenantDashboardLink = (token: string, baseUrl: string = 'https://yourdomain.com'): string => {
  const url = new URL(baseUrl);
  url.searchParams.set('token', token);
  return url.toString();
};

export const generateLocalDashboardLink = (token: string): string => {
  return generateTenantDashboardLink(token, 'http://localhost:3000');
};

/**
 * Email template for sending tenant dashboard invitation
 */
export const generateTenantInvitationEmail = (tenantName: string, token: string, baseUrl: string = 'https://yourdomain.com'): string => {
  const dashboardLink = generateTenantDashboardLink(token, baseUrl);
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
      .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
      .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      .token-link { word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px; margin: 15px 0; font-size: 12px; font-family: monospace; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to SOSA Tenant Portal! 🎉</h1>
      </div>
      <div class="content">
        <p>Hello <strong>${tenantName}</strong>,</p>
        
        <p>Welcome to your new accommodation! We're excited to have you on board. Your tenant portal account has been created and is ready to use.</p>
        
        <h3>Access Your Dashboard</h3>
        <p>Click the button below to access your personalized dashboard where you can:</p>
        <ul>
          <li>View your room details and amenities</li>
          <li>Check payment status and billing history</li>
          <li>Raise complaint tickets for maintenance issues</li>
          <li>Track your support ticket status</li>
          <li>View important hostel announcements</li>
        </ul>
        
        <a href="${dashboardLink}" class="button">Access Your Dashboard</a>
        
        <p>Or copy and paste this link in your browser:</p>
        <div class="token-link">${dashboardLink}</div>
        
        <p><strong>Note:</strong> This link contains your personal access token. Keep it safe and don't share it with others.</p>
        
        <h3>Need Help?</h3>
        <p>If you have any questions or need assistance, please contact the hostel management through the portal or reply to this email.</p>
        
        <p>Best regards,<br><strong>SOSA Hostel Management Team</strong></p>
      </div>
      <div class="footer">
        <p>&copy; 2026 SOSA Tenant Portal. All rights reserved.</p>
        <p>This is an automated email, please do not reply directly.</p>
      </div>
    </div>
  </body>
</html>
  `;
};
