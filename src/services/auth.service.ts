import { apiClient } from './api-client';
import { User } from '@/types';

/**
 * Authentication response containing the access token and user information.
 */
interface AuthResponse {
  /** JWT access token for API authorization */
  access_token: string;
  /** Information about the authenticated user */
  user: User;
}

/**
 * Result of a login attempt.
 */
interface LoginResult {
  /** JWT access token if login is successful */
  access_token?: string;
  /** Type of the token, usually "Bearer" */
  token_type?: string;
  /** Whether MFA authentication is required */
  mfa_required?: boolean;
  /** Session identifier used for MFA verification */
  session_id?: string;
  /** User's email address */
  email?: string;
  /** Whether the user's email has been verified */
  email_verified?: boolean;
}

/**
 * Response from an email verification operation.
 */
interface EmailVerificationResponse {
  /** Status of the verification */
  status: string;
  /** Result message */
  message: string;
  /** Whether verification was successful */
  success: boolean;
}

/**
 * Response from an MFA setup operation.
 */
interface MFASetupResponse {
  /** Secret key for manual entry */
  secret: string;
  /** URI for provisioning the MFA device */
  provisioning_uri: string;
  /** Base64 encoded QR code image for scanning with authenticator app */
  qrcode: string;
}

/**
 * Response from an MFA status check operation.
 */
interface MFAStatusResponse {
  /** Whether MFA is currently enabled for the user */
  enabled: boolean;
}

/**
 * Authenticates a user with email/username and password.
 * @param {string} email - User's email address.
 * @param {string} username - User's username.
 * @param {string} password - User's password.
 * @param {string} rememberMe - Whether to keep the user logged in.
 * @returns {Promise<LoginResult>} Promise resolving to login result.
 */
export const loginUser = async (email: string, username: string, password: string, rememberMe: string): Promise<LoginResult> => {
  return apiClient.post('/auth/login', { email, username, password, rememberMe });
};

/**
 * Verifies a user's email with the provided verification code.
 * @param {string} email - User's email address.
 * @param {string} code - Verification code sent to the email.
 * @returns {Promise<EmailVerificationResponse>} Promise resolving to verification result.
 */
export const verifyEmail = async (email: string, code: string): Promise<EmailVerificationResponse> => {
  return apiClient.post('/auth/verify-email', { email, code });
};

/**
 * Resends the verification email to the user.
 * @param {string} email - User's email address.
 * @returns {Promise<{ status: string; message: string }>} Promise resolving to operation result.
 */
export const resendVerificationEmail = async (email: string): Promise<{ status: string; message: string }> => {
  return apiClient.post('/auth/resend-verification-email', { email });
};

/**
 * Verifies an MFA code during login.
 * @param {string} sessionId - Session identifier from the initial login attempt.
 * @param {string} mfaCode - MFA code from the user's authenticator app.
 * @returns {Promise<AuthResponse>} Promise resolving to authentication result.
 */
export const verifyMfaLogin = async (sessionId: string, mfaCode: string): Promise<AuthResponse> => {
  return apiClient.post('/auth/mfa/verify-login', {
    session_id: sessionId,
    mfa_code: mfaCode
  });
};

/**
 * Sets up MFA for a user.
 * @returns {Promise<MFASetupResponse>} Promise resolving to MFA setup data.
 */
export const setupMfa = async (): Promise<MFASetupResponse> => {
  return apiClient.post('/auth/mfa/setup', {});
};

/**
 * Verifies and enables MFA for a user.
 * @param {string} code - MFA code from the user's authenticator app.
 * @returns {Promise<{ success: boolean }>} Promise resolving to operation result.
 */
export const verifyAndEnableMfa = async (code: string): Promise<{ success: boolean }> => {
  return apiClient.post('/auth/mfa/verify', { code });
};

/**
 * Disables MFA for a user.
 * @param {string} code - MFA code from the user's authenticator app.
 * @returns {Promise<MFAStatusResponse>} Promise resolving to MFA status.
 */
export const disableMfa = async (code: string): Promise<MFAStatusResponse> => {
  return apiClient.post('/auth/mfa/disable', { code });
};

/**
 * Gets the current MFA status for a user.
 * @returns {Promise<MFAStatusResponse>} Promise resolving to MFA status.
 */
export const getMfaStatus = async (): Promise<MFAStatusResponse> => {
  return apiClient.get('/auth/mfa/status');
};

/**
 * Registers a new user.
 * @param {string} username - User's username.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise<void>} Promise resolving when registration is successful.
 */
export const registerUser = async (username: string, email: string, password: string): Promise<void> => {
  return apiClient.post('/auth/register', { username, email, password });
};

/**
 * Verifies the current user's token is valid.
 * @returns {Promise<User>} Promise resolving to the user information.
 */
export const verifyTokenUser = async (): Promise<User> => {
  return apiClient.get('/auth/verify');
};

/**
 * Initiates a password reset for a user.
 * @param {string} email - User's email address.
 * @returns {Promise<{message: string}>} Promise resolving with a confirmation message.
 */
export const forgotPasswordUser = async (email: string): Promise<{message: string}> => {
  return apiClient.post('/auth/request-password-reset', { email });
};

/**
 * Resets a user's password using a reset code.
 * @param {string} email - User's email address.
 * @param {string} code - Password reset code sent to the user's email.
 * @param {string} newPassword - New password for the user.
 * @returns {Promise<void>} Promise resolving when password reset is successful.
 */
export const resetPasswordUser = async (email: string, code: string, newPassword: string): Promise<void> => {
  return apiClient.post('/auth/reset-password', { email, code, new_password: newPassword });
};

