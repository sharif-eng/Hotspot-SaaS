module.exports = {
  apps: [
    {
      name: 'sharif-wifi-billing-api',
      script: 'dist/main.js',
      cwd: './api',
      instances: process.env.CLUSTER_MODE === 'true' ? 'max' : 1,
      exec_mode: process.env.CLUSTER_MODE === 'true' ? 'cluster' : 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Monitoring
      monitoring: true,
      pmx: true,
      
      // Auto-restart configuration
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced features
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      
      // Health monitoring
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/wifi-billing.git',
      path: '/var/www/wifi-billing',
      'pre-deploy-local': '',
      'post-deploy': 'pnpm install && pnpm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};