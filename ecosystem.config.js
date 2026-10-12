module.exports = {
  apps: [
    {
      name: "backend-server",
      script: "./dist/server.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "notification-worker",
      script: "./dist/workers/notificationWorker.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
