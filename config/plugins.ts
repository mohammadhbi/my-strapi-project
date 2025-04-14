export default () => ({
    email: {
      config: {
        provider: 'smtp',
        providerOptions: {
          host: 'sandbox.smtp.mailtrap.io',
          port: 587,
          secure: false,
          auth: {
            user: 'b164f889b67d59',
            pass: 'ed982a01eb846a',
          },
        },
        settings: {
          defaultFrom: 'your-email@example.com',
          defaultReplyTo: 'your-email@example.com',
        },
      },
    },
  });
  