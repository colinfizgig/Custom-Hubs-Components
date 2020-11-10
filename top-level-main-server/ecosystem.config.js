module.exports = {
    apps: [{
      name: 'aelatgt-top-level',
      script: './index.js'
    }],
    deploy: {
      production: {
        user: 'ubuntu',
        host: 'ec2-3-82-226-254.compute-1.amazonaws.com',
        key: '~/.ssl/aelatgt-top-level.pem',
        ref: 'origin/main',
        repo: 'git@github.com:aelatgt/aelatgt-top-level.git',
        path: '/home/ubuntu/aelatgt-top-level',
        'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
      }
    }
  }