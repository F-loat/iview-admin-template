<template lang="pug">
.setting-common
  Form
    Form-item(label="必应背景")
      i-switch(
        @on-change="handleBackgroundChange",
        :value="settings.background",
        size="large")
        span(slot="open") 开启
        span(slot="close") 关闭
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'setting-common',
  data() {
    return {
      phone: {
        data: '',
      },
    };
  },
  computed: {
    ...mapState({
      settings: 'settings',
    }),
  },
  methods: {
    handleBackgroundChange(status) {
      const settings = { background: status };
      this.$store.commit('SETTINGS', settings);
      localStorage.setItem('settings', JSON.stringify(settings));
    },
  },
};
</script>

<style lang="less">
.setting-common .ivu-form-item-label {
  font-size: 14px;
}
</style>
