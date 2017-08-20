<template lang="pug">
.login
  .login-bg
  .login-bg-cover
  Card.login-card
    p(slot="title") Ourauto后台管理系统
    Form(
      ref="form",
      :model="form",
      :rules="rule",
      :label-width="60",
      label-position="left")
      Form-item(label="账号", prop="account")
        Input(
          v-model="form.account",
          placeholder="请输入账号",
          @on-enter="handleLogin")
      Form-item(label="密码", prop="password")
        Input(
          type="password",
          v-model="form.password",
          placeholder="请输入密码",
          @on-enter="handleLogin")
      Form-item
        Button(type="primary", @click="handleLogin") 登录
        Button(type="ghost", @click="handleReset", style="margin-left: 8px") 重置
</template>

<script>
import * as api from '@/api';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        account: '',
        password: '',
      },
      rule: {
        account: [{
          required: true,
          message: '账号不能为空',
        }],
        password: [{
          required: true,
          message: '密码不能为空',
        }],
      },
    };
  },
  methods: {
    handleLogin() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        const data = await api.createToken(this.form);
        // if (!data) return;
        sessionStorage.setItem('token', data);
        this.$Message.success('登录成功');
        this.$router.replace(this.$route.query.redirect || '/');
      });
    },
    handleReset() {
      this.$refs.form.resetFields();
    },
  },
};
</script>

<style lang="less">
.login {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: absolute;
}

.login-card {
  width: 360px;
}

.login-bg, .login-bg-cover {
  width: 120vw;
  height: 120vh;
  position: absolute;
}
.login-bg {
  background-image: url("https://api.dujin.org/bing/1366.php");
  background-size: cover;
  background-position: center center;
  filter: blur(12px);
}
.login-bg-cover {
  background-color: rgba(255, 255, 255, .7);
}
</style>
