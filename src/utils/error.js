export const translateSupabaseAuthError = (error) => {
  const errorMap = {
    "Invalid login credentials": "ایمیل یا رمز عبور نادرست است",
    "Invalid email or password": "ایمیل یا رمز عبور نامعتبر است",
    "Email not confirmed": "ایمیل شما هنوز تایید نشده است",
    "User already registered": "این ایمیل قبلاً ثبت‌نام کرده است",
    "User not found": "کاربری با این ایمیل یافت نشد",
    "Weak password": "رمز عبور بسیار ضعیف است",
    "Email rate limit exceeded": "تعداد درخواست‌های ایمیل بیش از حد مجاز",
    "Password recovery requires an email": "بازیابی رمز عبور نیاز به ایمیل دارد",
    "Password recovery link expired": "لینک بازیابی رمز عبور منقضی شده است",
    "Signup requires a valid password": "ثبت‌نام نیاز به رمز عبور معتبر دارد",
    "New password should be different from the old password": "رمز عبور جدید باید با رمز عبور قبلی متفاوت باشد.",
    "No changes have been made": "هیچ تغییری اعمال نشده است",
    "Network error": "خطا در اتصال به سرور",
    "Failed to fetch": "عدم ارتباط با سرور",
    "Service unavailable": "سرویس در دسترس نیست",
    "Request timeout": "زمان درخواست به پایان رسید",

    400: "درخواست نامعتبر",
    401: "عدم احراز هویت",
    403: "دسترسی ممنوع",
    404: "منبع یافت نشد",
    409: "تضاد در داده‌ها",
    422: "داده‌های ارسالی نامعتبر",
    500: "خطای داخلی سرور",
    502: "خطای دروازه بد",
    503: "سرویس در دسترس نیست",
    504: "زمان دروازه به پایان رسید",

    "Auth session missing": "جلسه احراز هویت یافت نشد",
    "Auth session expired": "جلسه احراز هویت منقضی شده است",
    "Auth user already invited": "کاربر قبلاً دعوت شده است",
    "Auth invalid phone number": "شماره تلفن نامعتبر است",
    "Auth invalid OTP": "کد یکبار مصرف نامعتبر است",
    "Auth OTP expired": "کد یکبار مصرف منقضی شده است",
    "Auth retry limit reached": "حد مجاز تلاش برای ورود به پایان رسید",
    "Auth provider error": "خطا در سرویس احراز هویت",
    "Auth missing MFA factor": "عامل احراز هویت دومرحله‌ای یافت نشد",
    "Auth MFA verification failed": "تایید احراز هویت دومرحله‌ای ناموفق بود",

    default: "خطای ناشناخته رخ داده است",
  };

  if (errorMap[error]) {
    return errorMap[error];
  }

  for (const [key, value] of Object.entries(errorMap)) {
    if (error.includes(key)) {
      return value;
    }
  }

  if (error.includes("For security purposes, you can only request this after")) {
    const match = error.match(/after (\d+) seconds?/i);
    const seconds = match ? match[1] : "?";
    return `به دلایل امنیتی، لطفاً ${seconds} ثانیه دیگر دوباره تلاش کنید.`;
  }

  const httpStatusMatch = error.match(/\b\d{3}\b/);
  if (httpStatusMatch && errorMap[httpStatusMatch[0]]) {
    return errorMap[httpStatusMatch[0]];
  }

  return errorMap["default"];
};
