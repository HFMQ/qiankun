// import HelloWorld from './HelloWorld.vue'

// HelloWorld.install = function (Vue) {
//   Vue.component('HelloWorld', HelloWorld);
// };

// export default HelloWorld;
const fs = require('fs');

fs.unlink('../utils/component.js', () => {})
let allFiles = fs.readdirSync('./');
allFiles = allFiles.filter(fileName => {
  console.log('hf', fileName);
  return fileName !== 'generateComponent.js' && fileName !== 'HelloWorld.vue'
});
console.log('hf', allFiles);
let componentsStr = '';
allFiles.forEach((item, index) => {
  let str = `
    import ${item} from '@/components/${item}';
    ${item}.install = function (Vue) {
      Vue.component('${item}', ${item});
    };
  `
  componentsStr += `
      ${item},
    `
  if (index === allFiles.length - 1) {
    str += `
    // const components = [${allFiles}];
    const components = [${componentsStr}];
    // install Vue.use 注册全局组件
    const install = function (Vue) {
      components.forEach(component => {
        Vue.component(component.name, component);
      });
    }
    `
    str += `export default {
      // component install function
      install,
      // component ⬇
      ${componentsStr}
      // component ⬆
    }`
  }
  fs.appendFileSync('../utils/component.js', str, function (err) {
    if (!err) {
      console.log('hf', 'failed');
    }
    console.log('hf', 'success');
  })
})

// console.log('hf', all);