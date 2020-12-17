require('dotenv').config();
const process = require('process');

const { Sequelize, Model } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mariadb',
    dialectOptions: {
        encrypt: true
    },
    omitNull: true,
    define: {
        timestamps: false
    },
});

module.exports = sequelize;
