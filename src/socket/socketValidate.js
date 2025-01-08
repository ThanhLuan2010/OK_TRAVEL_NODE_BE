/**
 * validate input from socket
 * @param schema
 * @param data
 * @returns {Object}
 */
module.exports.socketValidate = (schema, data) => {
  if (!data) {
    return { message: 'Input required' };
  }
  const { error } = schema.validate(data);
  return error;
};
