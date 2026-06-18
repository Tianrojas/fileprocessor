const { buildItsmRecord } = require('./builders/itsmBuilder');

const BUILDERS = {
  ITSM: buildItsmRecord
};

function createRecord(area, data) {
  const builder = BUILDERS[area];

  if (!builder) {
    throw new Error(`Unsupported area: ${area}`);
  }

  return builder(data);
}

module.exports = { createRecord };