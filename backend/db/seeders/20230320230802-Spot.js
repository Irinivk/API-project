'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
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

    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '123 Disney Lane',
        city: 'San Francisco',
        state: 'California',
        country: 'United States of America',
        lat: 37.7645358,
        lng: -122.4730327,
        name: 'App Academy',
        description: 'Place where web developers are created',
        price: 50.00
      },
      {
        ownerId: 2,
        address: '150 Sponge Lane',
        city: 'New York',
        state: 'New York',
        country: 'United States of America',
        lat: 30.76453338,
        lng: -112.4732327,
        name: 'Spongebob',
        description: 'Place where nice sponges are created',
        price: 70.00
      },
      {
        ownerId: 3,
        address: '130 Mouse World',
        city: 'Miami',
        state: 'Florida',
        country: 'United States of America',
        lat: 41.76213338,
        lng: -145.4756327,
        name: 'Mickey Mouse World',
        description: 'Place where nice mice are created',
        price: 80.00
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Disney Lane', '150 Sponge Lane', '130 Mouse World'] }
    }, {});
  }
};
