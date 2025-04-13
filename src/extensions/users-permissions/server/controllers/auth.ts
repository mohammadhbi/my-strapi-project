import { Context } from 'koa';
import { sanitizeContentAPIOutput } from '@strapi/utils';

interface LoginParams {
  identifier: string;
  password: string;
}

export default ({ strapi }: { strapi: any }) => ({
  async callback(ctx: Context) {
    const provider = (ctx.params.provider || 'local').toLowerCase();

    if (provider !== 'local') {
      return strapi
        .plugin('users-permissions')
        .controller('auth')
        .callback(ctx);
    }

    const { identifier, password } = ctx.request.body as LoginParams;

    if (!identifier || !password) {
      return ctx.badRequest('Please provide identifier and password');
    }

    const user =
      (await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: identifier.toLowerCase() },
      })) ||
      (await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { username: identifier },
      })) ||
      (await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { phone: identifier },
      }));

    if (!user) {
      return ctx.badRequest('Invalid identifier or password');
    }

    const validPassword = await strapi
      .plugin('users-permissions')
      .service('user')
      .validatePassword(password, user.password);

    if (!validPassword) {
      return ctx.badRequest('Invalid identifier or password');
    }

    if (user.blocked === true) {
      return ctx.badRequest('User is blocked');
    }

    const token = strapi
      .plugin('users-permissions')
      .service('jwt')
      .issue({ id: user.id });

    const model = strapi.getModel('plugin::users-permissions.user');
    const sanitizedUser = await sanitizeContentAPIOutput(user, model);

    ctx.body = {
      jwt: token,
      user: sanitizedUser,
    };
  },
});
