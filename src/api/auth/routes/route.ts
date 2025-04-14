// src/api/auth/routes/route.ts

export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/forgot-password',
      handler: 'auth.forgotPassword',  // اشاره به متد `forgotPassword` در کنترلر
      config: {
        auth: false,  // در صورتی که نیاز به احراز هویت نباشد
      },
    },
  ],
};
