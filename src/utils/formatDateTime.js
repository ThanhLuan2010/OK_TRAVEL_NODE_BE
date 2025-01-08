const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

const formatDateTime = (date) => {
  return dayjs(date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD HH:mm:ss');
};

module.exports = formatDateTime;
