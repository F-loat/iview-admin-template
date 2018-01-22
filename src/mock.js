import Mock, { Random } from 'mockjs';

Mock.mock('/api/tokens', 'post', () => 'token');
Mock.mock(/\/api\/users*/, () => ({
  total: 1,
  users: [{
    avatarUrl: Random.image('250x250'),
    country: Random.city(),
    createdAt: Random.date(),
    gender: Number(Random.boolean()),
    insider: Number(Random.boolean()),
    nickName: Random.name(),
    name: Random.name(),
    address: Random.city(),
    province: Random.province(),
    city: Random.city(),
    company: Random.ctitle(),
    reported: Number(Random.boolean()),
    sharedAt: Random.date(),
    tags: [],
    type: Number(Random.boolean()),
    updatedAt: Random.date(),
    __v: 0,
    _id: Random.guid(),
  }],
}));
Mock.mock('/api/users/:id', 'patch', () => 'ok');
Mock.mock('/api/users/tags', 'post', () => 'ok');
Mock.mock('/api/users/tags/:id', 'delete', () => 'ok');
