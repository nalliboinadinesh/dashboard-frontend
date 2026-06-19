/**
 * Utility for generating tenant dashboard links with JWT tokens.
 * Used in email templates and invitation systems.
 *
 * The link format is:
 *   https://dashboard-frontend-five-rouge.vercel.app/api/dashboard?token=<jwt>
 *
 * The /api/dashboard route handler (src/app/api/dashboard/route.ts) extracts
 * the token and redirects to / where AuthContext picks it up.
 */

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  'https://dashboard-frontend-five-rouge.vercel.app';

export const generateTenantDashboardLink = (token: string, baseUrl?: string): string => {
  const base = baseUrl || APP_URL;
  const url = new URL('/api/dashboard', base);
  url.searchParams.set('token', token);
  return url.toString();
};

export const generateLocalDashboardLink = (token: string): string =>
  generateTenantDashboardLink(token, 'http://localhost:3000');

/**
 * HTML email template for tenant dashboard invitation.
 */
export const generateTenantInvitationEmail = (
  tenantName: string,
  token: string,
  baseUrl?: string
): string => {
  const dashboardLink = generateTenantDashboardLink(token, baseUrl);

  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
      .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
      .button { display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
      .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      .token-link { word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px; margin: 15px 0; font-size: 12px; font-family: monospace; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Your Tenant Portal 🎉</h1>
      </div>
      <div class="content">
        <p>Hello <strong>${tenantName}</strong>,</p>
        <p>Welcome to your new accommodation! Your tenant portal account is ready.</p>
        <h3>Access Your Dashboard</h3>
        <p>Click the button below to access your personalized dashboard:</p>
        <a href="${dashboardLink}" class="button">Access Your Dashboard</a>
        <p>Or copy and paste this link in your browser:</p>
        <div class="token-link">${dashboardLink}</div>
        <p><strong>Note:</strong> This link contains your personal access token. Keep it safe and don't share it.</p>
        <p>Best regards,<br><strong>Hostel Management Team</strong></p>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Tenant Portal. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
};
