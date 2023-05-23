const server = require('../dist/apps/mfloww-api/main').default;

module.exports = async function () {
  const app = await server;
  return app;
};
