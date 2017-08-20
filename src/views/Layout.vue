<template lang="pug">
.layout
  .login-bg(v-if="settings.background")
  .login-bg-cover(v-if="settings.background")
  .layout-header
    .logo
    .title 后台管理系统
    span &nbsp;
    router-link.logout(to="/login") [注销]
  .layout-body
    .layout-menu
      Menu(
        ref="menu",
        width="auto",
        accordion,
        :open-names="openNames",
        :active-name="activeName",
        @on-select="handleSelect")
        Submenu(
          v-for="route of $router.options.routes[0].children",
          :key="route.path",
          :name="route.path")
          template(slot="title")
            Icon(:type="route.meta.icon || 'ios-navigate'")
            span.layout-text {{route.meta.title}}
          Menu-item(
            v-for="subroute of route.children",
            :key="subroute.path",
            v-if="!subroute.meta.hidden",
            :name="subroute.path") {{subroute.meta.title}}
    .layout-content
      .layout-breadcrumb
        Breadcrumb
          Breadcrumb-item(
            v-for="route of $route.matched",
            :key="route.path") {{route.meta.title || '首页'}}
      .layout-content-main
        router-view
      .layout-copy 2017 © Ourauto
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Layout',
  data() {
    return {
      activeName: '',
      openNames: [],
    };
  },
  computed: {
    ...mapState({
      settings: 'settings',
    }),
  },
  created() {
    this.update();
  },
  methods: {
    handleSelect(name) {
      this.$router.push(name);
    },
    update(route) {
      const path = route ? route.path : this.$route.path;
      this.openNames = [path.split('/')[1]];
      this.activeName = path;
      this.$nextTick(() => {
        this.$refs.menu.updateActiveName();
        this.$refs.menu.updateOpened();
      });
    },
  },
  watch: {
    $route() {
      this.update();
    },
  },
};
</script>

<style lang="less">
.ivu-menu-light,
.layout-menu,
.layout-header,
.layout-body,
.layout-content,
.login-bg-cover {
  background-color: rgba(255, 255, 255, .7);
}
</style>

<style lang="less" scoped>
.layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
}
.layout-header {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .title {
    font-size: 16px;
  }
  .logout {
    color: #666;
    &:hover {
      color: #999;
    }
  }
}
.layout-body {
  width: 100%;
  max-width: 1400px;
  flex: 1;
  display: flex;
  margin-top: 16px;
  border-radius: 4px;
}
.layout-menu {
  width: 240px;
  display: flex;
  .ivu-menu {
    flex: 1;
    overflow: auto;
  }
}
.layout-breadcrumb {
  padding: 10px 10px 5px;
}
.layout-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px;
  overflow: hidden;
  border-radius: 4px;
  overflow: auto;
}
.layout-content-main {
  padding: 10px;
  flex: 1;
}
.layout-copy {
  text-align: center;
  color: #9ea7b4;
}

.login-bg, .login-bg-cover {
  width: 120vw;
  height: 120vh;
  position: absolute;
  z-index: -1;
}
.login-bg {
  background-image: url("https://api.dujin.org/bing/1366.php");
  background-size: cover;
  background-position: center center;
  filter: blur(12px);
}
</style>
