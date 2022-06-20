const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const filter = {
  'DataCad': {
    '$gte': new Date('Mon, 13 Jun 2022 13:22:47 GMT')
  }
};

MongoClient.connect(
  'mongodb://mobs2admin:hpSWqzt27LczDTjN@gwbl.brazilsouth.cloudapp.azure.com:7070/gerenciador',
  { useNewUrlParser: true, useUnifiedTopology: true },
  function(connectErr, client) {
    assert.equal(null, connectErr);
    const coll = client.db('gerenciador').collection('comandos');
    coll.find(filter, (cmdErr, result) => {
      assert.equal(null, cmdErr);
    });
    client.close();
  });