'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   options.tableName = 'SpotAmenities';
   return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        amenityId: 1
      },
      {
        spotId: 2,
        amenityId: 2
      },
      {
        spotId: 3,
        amenityId: 3
      },
      {
        spotId: 3,
        amenityId: 4
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotAmenities';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      amenityId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};


