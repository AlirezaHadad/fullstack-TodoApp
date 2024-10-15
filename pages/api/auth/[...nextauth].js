import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import UserTodo from "../../../models/User";
import { verifyPassword } from "../../../utils/auth";
import connectDB from "../../../utils/connectDB";

// تنظیمات احراز هویت
const authOptions = {
  session: { strategy: "jwt" }, // استفاده از JWT برای مدیریت جلسه
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter Email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;

        // اتصال به پایگاه داده
        try {
          await connectDB();
        } catch (error) {
          throw new Error("Error in connecting to DB!"); // خطا در اتصال به DB
        }

        // بررسی وجود ایمیل و رمز عبور
        if (!email || !password) {
          throw new Error("Invalid Data!"); // داده‌های نامعتبر
        }

        const user = await UserTodo.findOne({ email: email }); // جستجوی کاربر

        if (!user) throw new Error("User doesn't exist!"); // کاربر وجود ندارد

        const isValid = await verifyPassword(password, user.password); // بررسی رمز عبور

        if (!isValid) throw new Error("Username or password is incorrect!"); // رمز عبور نادرست

        return { email }; // بازگشت اطلاعات کاربر
      },
    }),
  ],
  secret: process.env.SECRET, // کلید مخفی برای JWT
};

export default NextAuth(authOptions); // صادر کردن تنظیمات احراز هویت
