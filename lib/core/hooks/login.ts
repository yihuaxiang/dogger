import {sign, decode} from 'jsonwebtoken';

export default async (app) => {
  const loginConfig = app.config.login;
  const secret = loginConfig.secret;
  const cookieOption = loginConfig;
  
  console.log('loginConfig', loginConfig)
  if(loginConfig?.needLogin) {
    console.log('needLogin')
    const checkLogin = (ctx, next) => {
      console.log('checkLogin...')
      const token = ctx.cookies.get('dogger_token');
      console.log('token is', token);
      if(!token) {
        const jwt = login();
        ctx.cookies.set('dogger_token', jwt, cookieOption);
        ctx.status = 302;
        ctx.redirect(ctx.url);
      } else {
        const user = decode(token);
        if(user) {
          ctx.user = user;
        }
      }

      return next();
    }

    const login = () => {
      const jwt = sign({username: 'fjj'}, secret, {expiresIn: '1h'});
      return jwt;
    }
    app.use(checkLogin);
  } else {
    console.log('no need login')
  }
}
