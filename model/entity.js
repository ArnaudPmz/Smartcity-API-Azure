const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize'); 
const Commentary = require('./commentary')(sequelize, DataTypes);
const Appointment = require('./appointment')(sequelize, DataTypes);
const Entity_Role = require('./entity_role')(sequelize, DataTypes);
const Role = require('./role')(sequelize, DataTypes);
const Address = require('./address')(sequelize, DataTypes);

module.exports = (sequelize, DataTypes) => {
    const Entity = sequelize.define('entity', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            autoIncrementIdentity: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        firstname: DataTypes.STRING,
        lastname: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        phoneNumber: DataTypes.STRING,
        password: DataTypes.STRING,
        registrationDate: {
            type:DataTypes.DATE,
            defaultValue: new Date()
        },
        description: DataTypes.STRING,
        addressId: DataTypes.INTEGER
    }, {
        timestamps: false,
        freezeTableName: true
    });

    Entity.hasOne(Address, { sourceKey: 'addressId', foreignKey: 'id'});
    //Entity.hasMany(Entity_Role, { sourceKey: 'id', foreignKey: 'entityId', as: 'entity_roles'});
    Role.belongsToMany(Entity, { through: 'entity_role'});
    Entity.belongsToMany(Role, { through: 'entity_role' });

    Entity.belongsToMany(Commentary, { through: 'commentary_entity', foreignKey: 'authorEntityId', as: 'written_comments'});
    Entity.belongsToMany(Commentary, { through: 'commentary_entity', foreignKey: 'targetEntityId', as: 'received_comments'});

    Entity.hasMany(Appointment, { sourceKey: 'id', foreignKey: 'entityId'});
    Appointment.hasMany(Entity, { sourceKey: 'entityId', foreignKey: 'id'});
  
    return Entity;
};