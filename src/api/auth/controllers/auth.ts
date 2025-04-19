// src/api/auth/controllers/auth.js

import { v4 as uuidv4 } from 'uuid';

export default {
  async forgotPassword(ctx) {
    const { identifier } = ctx.request.body;

    if (!identifier) {
      return ctx.badRequest('Email or phone number is required');
    }

    const user = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: {
        $or: [
          { email: identifier },
          { phone: identifier },
        ],
      },
    });
//hhhh
    if (!user) {
      return ctx.notFound('User not found');
    }

    const token = uuidv4();

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: user.id },
      data: { resetPasswordToken: token },
    });

    await strapi.plugin('email').service('email').send({
      to: user.email,
      subject: 'Reset your password',
      text: `Click the link to reset your password: http://localhost:3000/reset-password?token=${token}`,
    });

    ctx.send({ message: 'Reset link sent' });
  },
};
