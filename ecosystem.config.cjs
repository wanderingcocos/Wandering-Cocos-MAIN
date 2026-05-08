module.exports = {
  apps: [
    {
      name: "wandering-cocos",
      script: "artifacts/api-server/dist/index.cjs",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      restart_delay: 3000,
      // PORT must be set in the environment before starting PM2.
      // Hostinger injects it automatically via hPanel; when starting from the
      // terminal directly, pass it explicitly:
      //   PORT=<your-port> pm2 start ecosystem.config.cjs --env production
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "logs/pm2-error.log",
      out_file: "logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    },
  ],
};
