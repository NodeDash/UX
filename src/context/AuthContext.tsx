import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  forgotPasswordUser,
  loginUser,
  registerUser,
  resetPasswordUser,
  verifyTokenUser,
  verifyEmail as verifyEmailApi,
  resendVerificationEmail as resendVerificationEmailApi,
  verifyMfaLogin as verifyMfaLoginApi,
  setupMfa as setupMfaApi,
  verifyAndEnableMfa as verifyAndEnableMfaApi,
  disableMfa as disableMfaApi,
  getMfaStatus as getMfaStatusApi,
} from "@/services/auth.service";

// Define the structure of a user object
export interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  mfa_enabled?: boolean;
  mfa_secret?: string;
  email_verified?: boolean;
}

// MFA-related types
export interface MFASetupResponse {
  secret: string;
  provisioning_uri: string;
  qrcode: string;
}

export interface MFALoginSession {
  session_id: string;
  email: string;
}

export interface MFAStatusResponse {
  verified: boolean;
  message: string;
}

// Email verification types
export interface EmailVerificationResponse {
  verified: boolean;
  message: string;
}

// Define the authentication context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  emailVerified: boolean;
  needsEmailVerification: boolean;
  mfaSession: MFALoginSession | null;
  isMfaRequired: boolean;
  mfaSetupData: MFASetupResponse | null;
  mfaLoading: boolean;

  // Authentication functions
  login: (
    identifier: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    email: string,
    code: string,
    newPassword: string
  ) => Promise<void>;

  // Email verification functions
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  resendVerificationEmail: (email: string) => Promise<void>;

  // MFA related functions
  verifyMfaLogin: (code: string) => Promise<void>;
  setupMfa: () => Promise<MFASetupResponse>;
  verifyAndEnableMfa: (code: string) => Promise<boolean>;
  disableMfa: (code: string) => Promise<boolean>;
  getMfaStatus: () => Promise<boolean>;
  clearMfaSetup: () => void;

  error: string | null;
  clearError: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Only for initial auth check
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [needsEmailVerification, setNeedsEmailVerification] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaSession, setMfaSession] = useState<MFALoginSession | null>(null);
  const [isMfaRequired, setIsMfaRequired] = useState<boolean>(false);
  const [mfaSetupData, setMfaSetupData] = useState<MFASetupResponse | null>(
    null
  );

  // Operation-specific loading states
  const [mfaLoading, setMfaLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [registerLoading, setRegisterLoading] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  // On mount, check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Verify the token with the backend
        const userData = await verifyTokenUser();
        setUser(userData);
        setIsAuthenticated(true);
        setEmailVerified(userData.email_verified || false);
      } catch {
        // Token is invalid or expired
        localStorage.removeItem("auth_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const clearError = () => {
    setError(null);
  };

  const clearMfaSetup = () => {
    setMfaSetupData(null);
  };

  const login = async (
    identifier: string,
    password: string,
    rememberMe: boolean
  ) => {
    try {
      setLoginLoading(true);
      setError(null);

      // Check if identifier is an email or username
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

      let email = "";
      let username = "";
      if (isEmail) {
        email = identifier;
      } else {
        username = identifier;
      }

      // Create appropriate payload based on identifier type
      const response = await loginUser(
        email,
        username,
        password,
        rememberMe ? "true" : "false"
      );

      if ("mfa_required" in response && response.mfa_required) {
        // Handle MFA challenge
        setIsMfaRequired(true);
        if (response.session_id && response.email) {
          setMfaSession({
            session_id: response.session_id,
            email: response.email,
          });
        }
        // Navigate to MFA verification page
        navigate("/mfa-verify");
      } else if ("access_token" in response) {
        // Standard login flow
        localStorage.setItem("auth_token", response.access_token as string);
        const userData = await verifyTokenUser();
        setUser(userData);
        setIsAuthenticated(true);
        setEmailVerified(userData.email_verified || false);

        // Redirect user to the route they were trying to access (or home)
        const redirectPath =
          new URLSearchParams(window.location.search).get("redirect") || "/";
        navigate(redirectPath);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      // Handle specific errors
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      // Check if it's an email verification error
      if (errorMessage.includes("Email not verified")) {
        setError("Please verify your email before logging in");
        // Store email for redirect to verification page
        const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
          ? identifier
          : "";
        navigate(`/email-verify?email=${encodeURIComponent(email)}`);
        return;
      } else if (errorMessage.includes("401")) {
        setError("Invalid username or password");
        return;
      }

      setError(errorMessage || "Invalid username or password");
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsAuthenticated(false);
    setEmailVerified(false);
    navigate("/login");
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setRegisterLoading(true);
      setError(null);

      await registerUser(username, email, password);

      // Handle successful registration
      // Don't auto login since email verification is required first
      setNeedsEmailVerification(true);

      // Store the email in the local state for easier verification
      localStorage.setItem("pending_verification_email", email);

      // Don't navigate here - let the RegisterPage handle the UI flow
      // This allows for a better user experience with the success screen

      return true;
    } catch (err) {
      // Extract error message from API response
      let errorMsg = "Registration failed";

      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === "object" && err !== null) {
        // Handle API error responses
        const errorObj = err as Record<string, any>;
        if (errorObj.detail) {
          errorMsg = errorObj.detail;
        } else if (errorObj.message) {
          errorMsg = errorObj.message;
        }
      }

      // Set specific error messages for common registration issues
      if (errorMsg.includes("email already exists")) {
        setError(t("auth.emailAlreadyExists"));
      } else if (
        errorMsg.includes("user with this username already exists") ||
        errorMsg.includes("username already exists")
      ) {
        setError(t("auth.usernameAlreadyExists"));
      } else {
        setError(errorMsg);
      }

      throw new Error(errorMsg);
    } finally {
      setRegisterLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setPasswordLoading(true);
      setError(null);

      await forgotPasswordUser(email);

      navigate("/login?passwordResetSent=true");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send password reset email"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ) => {
    try {
      setPasswordLoading(true);
      setError(null);

      await resetPasswordUser(email, code, newPassword);

      navigate("/login?passwordReset=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    try {
      setEmailVerificationLoading(true);
      setError(null);

      console.log("AuthContext: Calling verifyEmailApi with:", { email, code });
      const response = await verifyEmailApi(email, code);
      console.log("AuthContext: API response:", response);

      if (response.verified) {
        setEmailVerified(true);
        setNeedsEmailVerification(false);
        return true;
      } else {
        throw new Error(response.message || "Failed to verify email");
      }
    } catch (err) {
      console.error("AuthContext: verifyEmail error:", err);
      setError(err instanceof Error ? err.message : "Failed to verify email");
      return false;
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string): Promise<void> => {
    try {
      setEmailVerificationLoading(true);
      setError(null);

      const response = await resendVerificationEmailApi(email);
      if (response.status !== "success") {
        throw new Error(
          response.message || "Failed to resend verification email"
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to resend verification email"
      );
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  const verifyMfaLogin = async (code: string) => {
    try {
      setMfaLoading(true);
      setError(null);

      if (!mfaSession || !mfaSession.session_id) {
        throw new Error("No active MFA session found");
      }

      const response = await verifyMfaLoginApi(mfaSession.session_id, code);

      if (response && response.access_token) {
        // Store the token and update authentication state
        localStorage.setItem("auth_token", response.access_token);

        // Fetch user data with the new token
        const userData = await verifyTokenUser();

        setUser(userData);
        setIsAuthenticated(true);

        // Reset MFA session state
        setIsMfaRequired(false);
        setMfaSession(null);

        // Redirect to home or the requested page
        const redirectPath =
          new URLSearchParams(window.location.search).get("redirect") || "/";
        navigate(redirectPath);
      } else {
        throw new Error("Invalid response from MFA verification");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to verify MFA code"
      );
    } finally {
      setMfaLoading(false);
    }
  };

  const setupMfa = async (): Promise<MFASetupResponse> => {
    try {
      setMfaLoading(true);
      setError(null);

      const response = await setupMfaApi();

      setMfaSetupData(response);
      return response;
    } catch (err) {
      console.error("MFA setup error:", err);
      setError(err instanceof Error ? err.message : "Failed to setup MFA");
      throw err;
    } finally {
      setMfaLoading(false);
    }
  };

  const verifyAndEnableMfa = async (code: string): Promise<boolean> => {
    try {
      setMfaLoading(true);
      setError(null);

      const response = await verifyAndEnableMfaApi(code);

      if (response && response.success) {
        setUser(
          (prevUser) =>
            ({
              ...prevUser,
              mfa_enabled: true,
            } as User)
        );
        return true;
      } else {
        throw new Error("Failed to verify and enable MFA");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enable MFA");
      return false;
    } finally {
      setMfaLoading(false);
    }
  };

  const disableMfa = async (code: string): Promise<boolean> => {
    try {
      setMfaLoading(true);
      setError(null);

      const response = await disableMfaApi(code);

      if (response && response.enabled === false) {
        setUser(
          (prevUser) =>
            ({
              ...prevUser,
              mfa_enabled: false,
              mfa_secret: undefined,
            } as User)
        );
        return true;
      } else {
        throw new Error("Failed to disable MFA");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disable MFA");
      return false;
    } finally {
      setMfaLoading(false);
    }
  };

  const getMfaStatus = async (): Promise<boolean> => {
    try {
      setError(null);

      if (user && user.mfa_enabled !== undefined) {
        return user.mfa_enabled;
      }

      const response = await getMfaStatusApi();
      return response.enabled;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to retrieve MFA status"
      );
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    emailVerified,
    needsEmailVerification,
    mfaSession,
    isMfaRequired,
    mfaSetupData,
    mfaLoading, // Add operation-specific loading states to context
    loginLoading,
    registerLoading,
    passwordLoading,
    emailVerificationLoading,
    login,
    logout,
    register,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    verifyMfaLogin,
    setupMfa,
    verifyAndEnableMfa,
    disableMfa,
    getMfaStatus,
    clearMfaSetup,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
