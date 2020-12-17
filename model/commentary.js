const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize'); 

module.exports = (sequelize, DataTypes) => {
    const Commentary = sequelize.define('commentary', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrementIdentity: true,
            primaryKey: true
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publicationDate: {
            type:DataTypes.DATE,
            defaultValue: new Date()
        }
    }, {
        timestamps: false,
        freezeTableName: true
    });

    return Commentary;
};