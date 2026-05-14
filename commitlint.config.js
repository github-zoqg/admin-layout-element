export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', //新功能
        'fix', //修复bug
        'docs', //文档变更
        'style', //样式修改（不影响代码运行的变动）
        'refactor', //代码重构（既不是增加功能，也不是修复bug）
        'test', //增加测试
        'chore', //构建过程或辅助工具的变动
        'revert', //回滚某个更早之前的提交
        'perf', //性能优化
        'ci', //持续集成
      ],
    ],
  },
};
