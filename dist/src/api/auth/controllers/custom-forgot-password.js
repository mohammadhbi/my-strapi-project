"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const date_fns_1 = require("date-fns"); // برای اضافه کردن زمان انقضای توکن
exports.default = {
    async forgotPassword(ctx) {
        const { identifier } = ctx.request.body;
        // بررسی اینکه آیا ایمیل یا شماره موبایل وارد شده است
        if (!identifier) {
            return ctx.badRequest('Email or phone number is required');
        }
        // جستجو برای یافتن کاربر با ایمیل یا شماره موبایل
        const user = await strapi.db.query('plugin::users-permissions.user').findOne({
            where: {
                $or: [
                    { email: identifier },
                    { phone: identifier },
                ],
            },
        });
        // اگر کاربر پیدا نشد
        if (!user) {
            return ctx.notFound('User not found');
        }
        // ایجاد یک توکن منحصر به فرد برای ریست پسورد
        const token = (0, uuid_1.v4)();
        // تنظیم زمان انقضا برای توکن (مثلاً یک ساعت)
        const expirationTime = (0, date_fns_1.addMinutes)(new Date(), 60); // 60 دقیقه
        // بروزرسانی اطلاعات کاربر در دیتابیس برای ذخیره توکن و زمان انقضا
        await strapi.db.query('plugin::users-permissions.user').update({
            where: { id: user.id },
            data: {
                resetPasswordToken: token,
                resetPasswordTokenExpiration: expirationTime, // ذخیره زمان انقضا
            },
        });
        try {
            // ارسال ایمیل به کاربر با لینک ریست پسورد
            await strapi.plugin('email').service('email').send({
                to: user.email,
                subject: 'Reset your password',
                text: `Click the link to reset your password: http://localhost:3000/reset-password?token=${token}`,
            });
            ctx.send({ message: 'Reset link sent' });
        }
        catch (error) {
            // در صورتی که در ارسال ایمیل مشکلی پیش بیاید
            console.error('Error sending email:', error);
            return ctx.internalServerError('Error sending reset password email');
        }
    },
};
