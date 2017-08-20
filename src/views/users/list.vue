<template lang="pug">
.users
  .actions-form
    Radio-group(
      v-model="type",
      type="button",
      @on-change="handleRadioChange")
      Radio(label="0,1,-1") 普通用户
      Radio(label="-1") 封禁用户
      Radio(label="10,100") 管理用户
    Form
      Input(v-model="search", placeholder="请输入 昵称 / 姓名 / 标签", @on-enter="getUsers")
      Button(type="primary", @click.native="getUsers") 查询
  .data-table
    Table(border, :columns="columns", :data="data", style="margin-bottom: 15px")
  Page(
    placement="top",
    show-sizer,
    :page-size="limit",
    :page-size-opts="[12, 16, 20]",
    :total="total",
    :current="page",
    show-total,
    show-elevator,
    @on-page-size-change="handlePageSizeChange",
    @on-change="handlePageChange")
</template>

<script>
import * as api from '@/api';
import { date } from '@/utils';

export default {
  name: 'user-list',
  data() {
    return {
      columns: [
        {
          title: '昵称',
          key: 'nickName',
          width: 160,
          render: (h, params) => h('div', params.row.nickName || '未知'),
        },
        {
          title: '姓名',
          key: 'name',
          width: 100,
          render: (h, params) => h('div', [
            h('Icon', {
              props: {
                type: 'person',
              },
            }),
            h('strong', params.row.name || '未知'),
          ]),
        },
        {
          title: '公司',
          key: 'company',
          render: (h, params) => h('div', params.row.company || '未知'),
        },
        {
          title: '地址',
          key: 'address',
          width: 200,
          render: (h, params) => h('div', params.row.address || '未知'),
        },
        {
          title: '标签',
          key: 'tags',
          render: (h, params) => {
            const tags = params.row.tags.map((tag, index) => h('Tag', {
              props: {
                type: 'border',
                closable: true,
                color: 'blue',
              },
              on: {
                'on-close': () => {
                  this.removeTag(params.index, index);
                },
              },
            }, tag));
            return h('div', tags.concat([
              h('Button', {
                props: {
                  icon: 'ios-plus-empty',
                  type: 'dashed',
                  size: 'small',
                },
                on: {
                  click: () => {
                    this.addTag(params.index);
                  },
                },
              }),
            ]));
          },
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          render: (h, params) => h('div', [
            (() => {
              let text = params.row.type > 9 ? '解除管理' : '设为管理';
              if (params.row.type === 100) text = '最高管理';
              return h('Button', {
                props: {
                  type: 'ghost',
                  size: 'small',
                  disabled: params.row.type === 100,
                },
                style: {
                  marginRight: '5px',
                },
                on: {
                  click: () => {
                    this.toggleAdmin(params.index);
                  },
                },
              }, text);
            })(),
            h('Button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              style: {
                marginRight: '5px',
              },
              on: {
                click: () => {
                  this.show(params.index);
                },
              },
            }, '查看'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small',
                disabled: params.row.type === 100,
              },
              on: {
                click: () => {
                  this.forbidden(params.index);
                },
              },
            }, params.row.type === -1 ? '解封' : '封禁'),
          ]),
        },
      ],
      data: [],
      total: 0,
      search: '',
      page: 1,
      limit: 12,
      type: '0,1,-1',
    };
  },
  activated() {
    this.getUsers();
  },
  methods: {
    async show(index) {
      const data = this.data[index];
      this.$Modal.info({
        title: '用户信息',
        content: `
        <img src="${data.avatarUrl || 'https://miniapp.ourauto.club/logo.jpg'}" class="avatar"></img><br>
        昵称：${data.nickName || '未知'}<br>
        姓名：${data.name || '未知'}<br>
        性别：${this.genderFormat(data.gender)}<br>
        公司：${data.company || '未知'}<br>
        地址：${data.address || '未知'}<br>
        手机号：${data.phone || '未知'}<br>
        微信号：${data.wechat || '未知'}<br>
        省市：${data.province || ''}${data.city || '未知'}<br>
        认证情况：${this.authFormat(data.auth)}<br>
        会员：${this.insiderFormat(data.insider)}<br>
        注册时间：${data.createdAt ? date.formate(new Date(data.createdAt)) : '未知'}<br>
        解封时间：${data.deadline ? date.formate(new Date(data.deadline), 'YYYY-MM-DD') : '未被封禁'}<br>
        被举报次数：${data.reported}次`,
      });
    },
    async forbidden(index) {
      const user = this.data[index];
      if (user.type === -1) {
        this.$Modal.confirm({
          title: '确认解封？',
          content: '该操作不可撤销',
          loading: true,
          onOk: async () => {
            const rst = await api.editUser(user._id, { type: 0 });
            this.$Modal.remove();
            if (!rst) return;
            user.type = 0;
            this.$Message.success('解封成功');
          },
        });
        return;
      }
      let forbiddenDay = 7;
      this.$Modal.confirm({
        loading: true,
        render: h => h('Form', [
          h('Form-item', {
            props: {
              label: '请输入时长（单位：天）',
            },
          }, [
            h('Input-number', {
              props: {
                min: 1,
                value: forbiddenDay,
                autofocus: true,
                placeholder: '请输入封禁天数',
              },
              on: {
                input: (val) => {
                  forbiddenDay = val;
                },
              },
            }),
          ]),
        ]),
        onOk: async () => {
          const rst = await api.editUser(user._id, {
            type: -1,
            forbiddenDay,
          });
          this.$Modal.remove();
          if (!rst) return;
          user.type = -1;
          this.$Message.success('封禁成功');
        },
      });
    },
    async addTag(index) {
      const user = this.data[index];
      let tag;
      this.$Modal.confirm({
        render: h => h('Input', {
          props: {
            value: tag,
            autofocus: true,
            placeholder: '请输入标签',
          },
          on: {
            input: (val) => {
              tag = val;
            },
          },
        }),
        onOk: async () => {
          if (!tag) {
            this.$Message.warning('请输入标签');
            return;
          }
          const rst = await api.createUserTag({
            user: user._id,
            tag,
          });
          if (!rst) return;
          user.tags.push(tag);
          this.$Message.success('添加成功');
        },
      });
    },
    async removeTag(index, tagIndex) {
      const user = this.data[index];
      const rst = await api.removeUserTag(user.tags[tagIndex], {
        user: user._id,
      });
      if (!rst) return;
      user.tags.splice(tagIndex, 1);
      this.$Message.success('移除成功');
    },
    async toggleAdmin(index) {
      const user = this.data[index];
      if (user.type < 10) {
        let adminid;
        let password;
        this.$Modal.confirm({
          render: h => h('div', [
            h('Input', {
              props: {
                value: adminid,
                autofocus: true,
                placeholder: '请输入管理账号',
              },
              style: {
                marginBottom: '20px',
              },
              on: {
                input: (val) => {
                  adminid = val;
                },
              },
            }),
            h('Input', {
              props: {
                value: password,
                autofocus: true,
                placeholder: '请输入密码',
                type: 'password',
              },
              on: {
                input: (val) => {
                  password = val;
                },
              },
            }),
          ]),
          onOk: async () => {
            if (!password) {
              this.$Message.warning('请输入密码');
              return;
            }
            const rst = await api.editUser(user._id, {
              type: 10,
              password,
              adminid,
            });
            if (!rst) return;
            user.type = 10;
            this.$Message.success('设置成功');
          },
        });
      } else {
        const rst = await api.editUser(user._id, {
          type: 1,
        });
        if (!rst) return;
        user.type = 1;
        this.$Message.success('解除成功');
      }
    },
    authFormat(auth) {
      if (!auth) return '尚未完成认证';
      if (auth.person && auth.company) return '个人&公司';
      if (!auth.person) return '公司';
      return '个人';
    },
    insiderFormat(insider) {
      const deadline = date.formate(insider, 'YYYY-MM-DD');
      return insider > Date.now() ? `是 (${deadline}到期)` : '否';
    },
    genderFormat(gender) {
      if (gender === 1) return '男';
      if (gender === 2) return '女';
      return '未知';
    },
    async getUsers() {
      const data = await api.indexUser({
        search: this.search,
        type: this.type,
        page: this.page,
        limit: this.limit,
      });
      if (!data) return;
      this.data = data.users;
      this.total = data.total;
    },
    handleRadioChange() {
      this.page = 1;
      this.getUsers();
    },
    handlePageChange(page) {
      this.page = page;
      this.getUsers();
    },
    handlePageSizeChange(size) {
      this.limit = size;
      this.getUsers();
    },
  },
};
</script>

<style lang="less">
.avatar {
  width: 80px;
  float: right;
  border-radius: 50%;
  margin: 10px 20px;
}
</style>
