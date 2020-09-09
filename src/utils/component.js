
    import Alers from '@/components/Alers';
    Alers.install = function (Vue) {
      Vue.component('Alers', Alers);
    };
  
    import VerifycationCode from '@/components/VerifycationCode';
    VerifycationCode.install = function (Vue) {
      Vue.component('VerifycationCode', VerifycationCode);
    };
  
    // const components = [Alers,VerifycationCode];
    const components = [
      Alers,
    
      VerifycationCode,
    ];
    // install Vue.use 注册全局组件
    const install = function (Vue) {
      components.forEach(component => {
        Vue.component(component.name, component);
      });
    }
    export default {
      // component install function
      install,
      // component ⬇
      
      Alers,
    
      VerifycationCode,
    
      // component ⬆
    }