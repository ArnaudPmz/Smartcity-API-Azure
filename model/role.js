const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize'); 

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('role', {
        name: {
            type:DataTypes.STRING,
            primaryKey: true
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Role;
};