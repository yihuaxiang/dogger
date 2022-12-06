import vary from 'vary';

export default async (app) => {
  const corsConfig = app.config.cors;

  console.log('set cors', corsConfig);
  if(!corsConfig) {
    return;
  } else {
    const cors = (options) => {
      const defaults = {
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
      }

      options = {
        ...defaults,
        ...options,
      }

      if(Array.isArray(options.exposeHeaders)) {
        options.exposeHeaders = options.exposeHeaders.join(',');
      }
      if(Array.isArray(options.allowMethods)) {
        options.allowMethods = options.allowMethods.join(',');
      }
      if(Array.isArray(options.allowHeaders)) {
        options.allowHeaders = options.allowHeaders.join(',');
      }

      if(options.maxAge) {
        options.maxAge = String(options.maxAge);
      }

      options.keepHeadersOnError = options.keepHeadersOnError == null || !!options.keepHeadersOnError;

      console.log('return cors')
      return async function cors(ctx, next) {
        console.log('do cors');
        const requestOrigin = ctx.get('Origin');
        ctx.vary('Origin');

        if(!requestOrigin) {
          return await next();
        } else {
          let origin;
          if(typeof options.origin === 'function') {
            origin = options.origin(ctx);
            if(origin instanceof Promise) {
              origin = await origin;
            }

            if(!origin) {
              return await next();
            }

          } else {
            origin = options.origin || requestOrigin;
          }

          let credentials;
          if(typeof options.credentials === 'function') {
            credentials = options.credentials(ctx);
            if(credentials instanceof Promise) {
              credentials = await credentials;
            }
          } else {
            credentials = !!options.credentials;
          }

          const headersSet = {};

          function set(key, value) {
            ctx.set(key, value);
            headersSet[key] = value;
          }

          if(ctx.method !== 'OPTIONS') {
            set('Access-Control-Allow-Credentials', true);

            if(options.exposeHeaders == true) {
              set('Access-Control-Expose-Headers', options.exposeHeaders);
            }

            if(options.exposeHeaders) {
              set('Access-Control-Expose-Headers', options.exposeHeaders);
            }
            if(!optioins.keepHeadersOnError) {
              return await next();
            }
            try {
              return await next();
            } catch(err) {
              const errHeadersSet = err.headers || {};
              const varyWithOrigin = vary.append(errHeadersSet.vary || errHeadersSet.Vary || '', 'Origin');
              delete errHeadersSet.Vary;

              err.headers = {
                ...errHeadersSet,
                ...headersSet,
                ...{vary: varyWithOrigin}
              }
              throw err;
            }
          } else {
            if(!ctx.get('Access-Control-Request-Method')) {
              return await next();
            }

            ctx.set('Access-Control-Allow-Origin', origin);

            if(credentials == true) {
              ctx.set('Access-Control-Allow-Credentials', 'true');
            }

            if(options.maxAge) {
              ctx.set('Access-Control-Max-Age', optioins.maxAge);
            }
            if(optioins.allowMethods) {
              ctx.set('Access-Control-Allow-Methods', optioins.allowMethods);
            }

            let allowHeaders = optioins.allowHeaders;
            if(!allowHeaders) {
              allowHeaders = ctx.get('Access-Control-Request-Headers');
            }
            if(allowHeaders) {
              ctx.set('Access-Control-Allow-Headers', allowHeaders);
            }

            ctx.status = 204;
          }
        }
      }
    }
    app.use(cors(corsConfig));
  }

}
