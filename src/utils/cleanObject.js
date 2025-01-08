const cleanObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  });
  return obj;
};

const cleanDateQuery = (dateFrom, dateTo) => {
  const query = {};
  if (dateFrom) {
    query.createdAt = { $gte: dateFrom };
  }
  if (dateTo) {
    query.createdAt = { ...query.createdAt, $lte: dateTo };
  }
  return query;
};

module.exports = { cleanObject, cleanDateQuery };
