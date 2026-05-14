export const shortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '昨天',
    value: () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date;
    },
  },
  {
    text: '一周前',
    value: () => {
      const date = new Date();
      date.setDate(date.getDate() - 7);
      return date;
    },
  },
];
