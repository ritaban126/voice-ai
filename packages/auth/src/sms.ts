// Sends the OTP SMS. Server only.
export async function sendSms(phone: string, message: string): Promise<void> {
  if (process.env.DEMO_MODE === 'true') {
    // Demo: read the OTP from the API console. Never enable DEMO_MODE in production.
    console.log(`[DEMO OTP] ${phone} -> ${message}`);
    return;
  }
  // TODO: plug in your SMS provider here (MSG91, Twilio, etc.)
  throw new Error('SMS provider not configured');
}