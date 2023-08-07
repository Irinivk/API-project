'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SafetyItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SafetyItem.belongsToMany(
        models.Spot,
        { through: models.SpotSafetyItem,  foreignKey: 'spotId' }
      );
    }
  }
  SafetyItem.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'SafetyItem',
  });
  return SafetyItem;
};