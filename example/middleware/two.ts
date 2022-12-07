export default (app) => {
  return (ctx, next) => {
    console.log('this is two mw');
    return next();
  }
}
