const responseMessage = (message, code = 200) => {
  return { code, message };
};

const responseData = (data, message, code = 200) => {
  return { code, message, data };
};

const responseListData = (data, totalCount, page, limit, totalResult) => {
  return { data, page, limit, totalCount: parseInt(totalCount, 10), totalPage: Math.ceil(totalCount / limit), totalResult };
};

module.exports = {
  responseData,
  responseMessage,
  responseListData,
};
