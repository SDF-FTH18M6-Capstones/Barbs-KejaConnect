def verification_email(verification_url):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your KejaConnect Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0F172A; -webkit-font-smoothing: antialiased;">
  
  <!-- Outer Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F8FAFC; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 8px; border: 1px solid #E2E8F0; overflow: hidden;">
          
          <!-- Brand Header -->
          <tr>
            <td style="background-color: #0F766E; padding: 28px 40px; text-align: center; border-bottom: 4px solid #F59E0B;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                KejaConnect
              </h1>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              <h2 style="margin: 0 0 16px 0; color: #0F172A; font-size: 20px; font-weight: 600;">
                Verify your email address
              </h2>
              
              <p style="margin: 0 0 16px 0; color: #0F172A; font-size: 16px; line-height: 24px;">
                Welcome to KejaConnect! We are excited to help you get started.
              </p>

              <p style="margin: 0 0 28px 0; color: #64748B; font-size: 15px; line-height: 24px;">
                Please confirm that this is your email address by clicking the button below. This helps keep your account secure and gives you full access to our platform.
              </p>

              <!-- Primary CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 0 28px 0;">
                <tr>
                  <td align="center" style="border-radius: 6px; background-color: #0F766E;">
                    <a href="{verification_url}" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 6px; background-color: #0F766E;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link Section -->
              <p style="margin: 0 0 8px 0; color: #64748B; font-size: 13px; line-height: 20px;">
                If the button above does not work, copy and paste this link into your web browser:
              </p>
              <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 20px; word-break: break-all;">
                <a href="{verification_url}" target="_blank" style="color: #0F766E; text-decoration: underline;">
                  {verification_url}
                </a>
              </p>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;">

              <!-- Security Disclaimer -->
              <p style="margin: 0; color: #64748B; font-size: 13px; line-height: 20px;">
                If you did not create an account with KejaConnect, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #134E4A; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #FFFFFF; font-size: 13px; font-weight: 600;">
                KejaConnect
              </p>
              <p style="margin: 0; color: #E2E8F0; font-size: 12px; line-height: 18px;">
                &copy; 2026 KejaConnect. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- End Main Container -->

      </td>
    </tr>
  </table>

</body>
</html>
"""
