import { reactive, onMounted, createApp } from './vue.esm-browser.js';

createApp({
  setup() {
    let viewdata = reactive({
      title: 'vue3你好',
      user: {
        username: '',
        password: '',
      },
    });

    onMounted(() => {
      console.log('in onMounted...');
    });

    return {
      viewdata,
    };
  },
}).mount('#app');
