'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotSafetyItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotSafetyItem.belongsTo(
        models.Spot,
        { foreignKey: 'spotId'}
      );
      SpotSafetyItem.belongsTo(
        models.SafetyItem,
        { foreignKey: 'safetyItemId'}
      )
    }
  }
  SpotSafetyItem.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    spotId: {
      type: DataTypes.INTEGER,
    },
    safetyItemId: {
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'SpotSafetyItem',
  });
  return SpotSafetyItem;
};