const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  test('/api/solve should solve a valid puzzle', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51' })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            solution: '827549163531672894649831527496157382218396475753284916962415738185763249374928651'
          }
        )
        done();
      });
  });

  test('/api/solve should return an error on missing puzzle string', (done) => {
    chai.request(server)
      .post('/api/solve')
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            error: 'Required field missing'
          }
        )
        done();
      });
  });

  test('/api/solve should return an error on invalid chars', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '8Z..4..6...16..8!...98315.749.157....;........53..4...96.415..81..7632..3...28.51' })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            error: 'Invalid characters in puzzle'
          }
        )
        done();
      });
  });

  test('/api/solve should return an error on incorrect puzzle length', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '8..98315.749.157.............53..4...96.415..81..7632..3...28.51' })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            error: 'Expected puzzle to be 81 characters long'
          }
        )
        done();
      });
  });

  test('/api/solve should return an error if puzzle cannot be solved', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '82..4..6..816...9...98315.749.157.............53..4...96.415..81..7632..3...28.51' })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            error: 'Puzzle cannot be solved'
          }
        )
        done();
      });
  });

  test('/api/check should check a placement with all fields correct', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
        coordinate: 'A3',
        value: 7
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            valid: true
          }
        )
        done();
      });
  });

  test('/api/check should check an incorrect placement with one conflict', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
        coordinate: 'D4',
        value: 8
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            valid: false,
            conflict: ['column']
          }
        )
        done();
      });
  });

  test('/api/check should check an incorrect placement with multiple conflicts', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
        coordinate: 'H3',
        value: 6
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            valid: false,
            conflict: ['row', 'region']
          }
        )
        done();
      });
  });

  test('/api/check should check all incorrect placement conflicts', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
        coordinate: 'B4',
        value: 1
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            valid: false,
            conflict: ['row', 'column', 'region']
          }
        )
        done();
      });
  });

  test('/api/check should return an error on missing required fields', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
        value: 7
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            error: 'Required field(s) missing'
          }
        )
        done();
      });
  });

  test('/api/check should return an error on invalid chars in puzzle', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '82.!4..6...I6..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
        coordinate: 'A3',
        value: 7
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            error: 'Invalid characters in puzzle'
          }
        )
        done();
      });
  });

  test('/api/check should return an error on too short puzzle', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415.',
        coordinate: 'A3',
        value: 7
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            error: 'Expected puzzle to be 81 characters long'
          }
        )
        done();
      });
  });

  test('/api/check should return an error on invalid coordinate', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
        coordinate: 'A',
        value: 7
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            error: 'Invalid coordinate'
          }
        )
        done();
      });
  });

  test('/api/check should return an error on invalid value', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
        coordinate: 'A3',
        value: 0
      })
      .end((_err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.deepInclude(
          res.body,
          {
            error: 'Invalid value'
          }
        )
        done();
      });
  });

});

