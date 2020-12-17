const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize'); 

module.exports = (sequelize, DataTypes) => {
    const Status = sequelize.define('status', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrementIdentity: true,
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Status;
};
