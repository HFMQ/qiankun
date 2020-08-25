
    import Alers from '@/components/Alers';
    Alers.install = function (Vue) {
      Vue.component('Alers', Alers);
    };
  
    import VerifycationCode from '@/components/VerifycationCode';
    VerifycationCode.install = function (Vue) {
      Vue.component('VerifycationCode', VerifycationCode);
    };
  
      const components = [Alers,VerifycationCode];
      const install = function (Vue) {
        components.forEach(component => {
          Vue.component(component.name, component);
        });
      }
    export default {
      Alers,VerifycationCode,
      install
    }