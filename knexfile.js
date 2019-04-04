const ENV = process.env.NODE_ENV || 'development';

const baseConfig = {
  client: 'pg',
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  }
};

const customConfigs = {
  development: {
    connection: {
      database: 'news_api'
    }
  },
  test: {
    connection: {
      database: 'news_api_test'
    }
  },
  production: {
    connection: process.env.DATABASE_URL
  }
};

module.exports = { ...baseConfig, ...customConfigs[ENV] };
