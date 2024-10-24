###  1: Project Overview and Authentication

### Project Name and Heading

# Customer 360

*Empowering businesses with comprehensive customer insights through advanced data integration and visualization.*

### Google SSO Authentication

The Customer 360 CDP application will implement Google SSO (Single Sign-On) authentication using the @react-oauth/google library. This process ensures secure and streamlined user access while maintaining data privacy.

Authentication Flow:
1. User clicks "Sign in with Google" button
2. Google OAuth consent screen appears
3. User grants permission
4. Application receives OAuth token
5. Backend verifies token with Google
6. User session created upon successful verification

Error Handling:
- Invalid token: Prompt user to retry authentication
- Network issues: Display connection error message with retry option

Security Considerations:
- Implement HTTPS for all communications
- Store tokens securely using HttpOnly cookies
- Implement token refresh mechanism for prolonged sessions

Authentication Interface Design:
- Minimalist login page with company logo
- Prominent "Sign in with Google" button using Google's official design guidelines
- Empty input fields for email and password (for future non-Google authentication options)
- Clear error messages for failed authentication attempts


