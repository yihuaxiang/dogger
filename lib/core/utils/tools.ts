import _ from 'lodash';

function customizer(objValue: any, srcValue: any) {
  if(_.isObject(objValue)) {
    return srcValue;
  }
}

// 深度合并
export const deepMerge = (target, source) => {
  console.log('merge')
  console.log(source);
  const assign = Object.assign({}, _.mergeWith(target, source, customizer));
  console.log(assign);
  return assign;
}
