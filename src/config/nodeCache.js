const NodeCache = require('node-cache');

const nodeCache = new NodeCache({ stdTTL: 0 });

const getNodeCache = (key) => {
  return nodeCache.get(key);
};

const setNodeCache = (key, value, ttl = 0) => {
  return nodeCache.set(key, value, ttl);
};

const delNodeCache = (key) => {
  return nodeCache.del(key);
};

const keysNodeCache = () => {
  return nodeCache.keys();
};

module.exports = {
  nodeCache,
  getNodeCache,
  setNodeCache,
  delNodeCache,
  keysNodeCache,
};
