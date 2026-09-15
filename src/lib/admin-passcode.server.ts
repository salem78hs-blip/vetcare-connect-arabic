// Server-only: the admin passcode never reaches the client bundle.
const ADMIN_PASSCODE = "1234";

export function assertAdminPasscode(passcode: unknown) {
  if (typeof passcode !== "string" || passcode !== ADMIN_PASSCODE) {
    throw new Error("رمز الدخول غير صحيح");
  }
}
