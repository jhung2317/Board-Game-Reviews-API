const request = require('supertest');
const app = require('../app.js');
const db = require('../db/connection')
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));
afterAll(() => db.end());

//test is amended for ticket 3.5
describe('api test suite', () => {
    test('GET - /api returns 200 with an JSON Object of all endpoints information', () => {
        return request(app).get('/api').expect(200).then((response) => {
            console.log(response.body)
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.Instruction.hasOwnProperty("GET /api")).toBe(true)
            expect(Object.entries(response.body.Instruction).length).toBe(3)
        })
    })
    test('GET - /api/categories returns 200', () => {
        return request(app).get('/api/categories').expect(200).then(({body}) => {
            expect(body.category.length).toBe(4)
            expect(body.category).toBeArray();
            body.category.forEach(category => {
                expect(typeof category.slug).toBe('string')
                expect(typeof category.description).toBe('string')

            })
        })
    })
})

describe('404 error test', () => {
    test('GET - /api/nonsense returns 404 error msg ', () => {
        return request(app).get('/api/treasurdsfeame').expect(404).then((res) => {
            expect(res.body.msg).toBe('Not Found.')
        })
    })
})