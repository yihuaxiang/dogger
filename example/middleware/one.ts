export default (app) => {
  return (ctx, next) => {
    console.log('this is one mw');
    return next();
  }
}
