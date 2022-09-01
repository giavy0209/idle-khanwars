module.exports = {
  apps: [
    {
      name: 'idle-khanwars-fe2',
      cwd: 'cwd',
      script: "serve",
      env: {
        PM2_SERVE_PATH: '.',
        PM2_SERVE_PORT: 3010,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: './index.html'

      },
      exec_mode: 'fork',
      instance: 1,
      autorestart: true,
      watch: false,
    },
  ],
}