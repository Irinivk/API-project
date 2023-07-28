'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotAmenity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotAmenity.belongsTo(
        models.Spot,
        { foreignKey: 'spotId'}
      );
      SpotAmenity.belongsTo(
        models.Amenity,
        { foreignKey: 'amenityId'}
      )
    }
  }
  SpotAmenity.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    spotId: {
      type: DataTypes.INTEGER,
    },
    amenityId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'SpotAmenity',
  });
  return SpotAmenity;
};