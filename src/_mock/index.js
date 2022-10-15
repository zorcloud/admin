import Mock from 'mockjs';
import packMock from './packMock';
import user from './user';
import crud from './crud';

Mock.setup({
  timeout: '500-1000'
});

packMock(user, crud);
