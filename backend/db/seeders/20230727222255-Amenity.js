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
   options.tableName = 'Amenities';
   return queryInterface.bulkInsert(options, [
      {
        name: 'Pool',
        icon: "https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg"
      },
      {
        name: 'Hot tub',
        icon: "https://cdn-icons-png.flaticon.com/512/7416/7416467.png"
      },
      {
        name: 'Patio',
        icon: "https://static.thenounproject.com/png/3263390-200.png"
      },
      {
        name: 'BBQ grill',
        icon: "https://static.thenounproject.com/png/2334768-200.png"
      },
      {
        name: 'Outdoor dining area',
        icon: "https://cdn2.iconfinder.com/data/icons/summer-69/65/table-512.png"
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
    options.tableName = 'Amenities';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Pool", "Hot tub", "Patio", "BBQ grill", "Outdoor dining area"] }
    }, {});
  }
};
