function sleeping(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = sleeping;
