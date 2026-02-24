const fs = require('fs');
const path = require('path');

const loadQuery = (feature, filename) =>
  fs.readFileSync(
    path.join(__dirname, '../queries', feature, `${filename}.sql`),
    'utf-8'
  );

module.exports = loadQuery;
