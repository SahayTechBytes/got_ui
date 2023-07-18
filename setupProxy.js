const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080", // URL of your backend API
      changeOrigin: true,
      pathRewrite: {
        "^/proxy": "",
      },
    })
  );
};
