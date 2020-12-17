const {DataTypes} = require('sequelize');
const sequelize = require('./sequelize'); 
const Category = require('./category')(sequelize, DataTypes);
const Status = require('./status')(sequelize, DataTypes);
const Entity = require('./entity')(sequelize, DataTypes);
const Appointment = require('./appointment')(sequelize, DataTypes);

module.exports = (sequelize, DataTypes) => {
    const Announce = sequelize.define('announce', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrementIdentity: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING
        },
        description: DataTypes.STRING,
        date: {
            type:DataTypes.DATE,
            validate: {
                isDate: true
            }
        },
        duration: DataTypes.INTEGER,
        price: {
            type: DataTypes.REAL,
            defaultValue: null,
            validate: {
                min: 0
            }
        },
        city: DataTypes.STRING,
        categoryName: DataTypes.STRING,
        entityId: DataTypes.INTEGER,
        statusId: DataTypes.INTEGER
    }, {
        timestamps: false,
        freezeTableName: true
    });

    Announce.hasOne(Category, { sourceKey: 'categoryName', foreignKey: 'name', as: 'category' });
    Category.belongsTo(Announce, { sourceKey: 'name', foreignKey: 'categoryName' });
    
    Announce.hasOne(Status, { sourceKey: 'statusId', foreignKey: 'id', as: 'status' });
    Status.belongsTo(Announce, { sourceKey: 'id', foreignKey: 'statusId' });

    Announce.hasOne(Entity, { sourceKey: 'entityId', foreignKey: 'id', as: 'author' });
    Entity.hasMany(Announce, { sourceKey: 'id', foreignKey: 'entityId' });

    Announce.hasMany(Appointment, { foreignKey: 'id', as: 'appointments' });
    Appointment.hasOne(Announce, { sourceKey: 'announceId', foreignKey: 'id'});

    
    return Announce;
};

//module.exports = Announce;