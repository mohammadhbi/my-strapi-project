"use strict";
// src/api/auth/routes/route.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/auth/forgot-password',
            handler: 'auth.forgotPassword', // اشاره به متد `forgotPassword` در کنترلر
            config: {
                auth: false, // در صورتی که نیاز به احراز هویت نباشد
            },
        },
    ],
};
