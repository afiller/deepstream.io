/* global jasmine, spyOn, describe, it, expect, beforeEach, afterEach */
'use strict'

const jsonPath = require('../../src/record/json-path')

describe('objects are created from paths and their value is set correctly', () => {
  it('sets simple values', () => {
    let record = {}
    jsonPath.setValue(record, 'firstname', 'Wolfram')
    expect(record).toEqual({ firstname: 'Wolfram' })
  })

  it('sets values for nested objects', () => {
    let record = {}
    jsonPath.setValue(record, 'address.street', 'someStreet')

    expect(record).toEqual({
      address: {
        street: 'someStreet'
      }
    })
  })

  it('sets values for nested objects with numeric field names', () => {
    let record = {}
    jsonPath.setValue(record, 'address.street.1', 'someStreet')

    expect(record).toEqual({
      address: {
          street: {
              1: 'someStreet'
          }
      }
    })
  })


  it('sets values for nested objects with multiple numeric field names', () => {
    let record = {}
    jsonPath.setValue(record, 'address.99.street.1', 'someStreet')

    expect(record).toEqual({
      address: {
        99 : {
          street: {
            1: 'someStreet'
          }
        }
      }
    })
  })


  it('sets values for nested objects with multiple mixed array and numeric field names', () => {
    let record = {}
    jsonPath.setValue(record, 'address[2].99.street[2].1', 'someStreet')

    expect(record).toEqual({
      address: [
          undefined,
          undefined,
          {
              99 : {
                  street: [
                      undefined,
                      undefined,
                      {
                          1: 'someStreet'
                      }
                  ]
              }
          }
        ]
    })
  })

  it('sets first value of array', () => {
    let record = {}
    jsonPath.setValue(record, 'items[0]', 51)

    expect(JSON.stringify(record)).toEqual(JSON.stringify({
        items: [
            51
        ]
    }))
  })

  it('sets numeric obj member name of 0 (zero)', () => {
    let record = {}
    jsonPath.setValue(record, 'items.0', 51)

    expect(JSON.stringify(record)).toEqual(JSON.stringify({
      items: {
        0 : 51
      }
    }))
  })

  it('sets values for arrays', () => {
    let record = {}
    jsonPath.setValue(record, 'pastAddresses[1].street', 'someStreet')

    expect(JSON.stringify(record)).toEqual(JSON.stringify({
      pastAddresses: [
        undefined,
        {
          street: 'someStreet'
        }
      ]
    }))
  })

  it('sets value AS arrays of arrays', () => {
    let record = {
      addresses: undefined
    },
    arrOfArr = [
      undefined,
      [
        'new-Street1', 'road1', 'blvd1'
      ],
      [
        'street2', 'road2', 'blvd2'
      ]
    ]

    jsonPath.setValue(record, 'addresses', arrOfArr)

    expect(JSON.stringify(record)).toEqual(JSON.stringify({
      addresses: [
        undefined,
        [
          'new-Street1', 'road1', 'blvd1'
        ],
        [
          'street2', 'road2', 'blvd2'
        ]
      ]
    }))
  })

  it('sets value IN arrays of arrays', () => {
    let record = {
      addresses: [
        undefined,
        [
          'street1', 'road1', 'blvd1'
        ],
        [
          'street2', 'road2', 'blvd2'
        ]
      ]
    }
    jsonPath.setValue(record, 'addresses[1][0]', 'new-Street1')

    expect(JSON.stringify(record)).toEqual(JSON.stringify({
      addresses: [
        undefined,
        [
          'new-Street1', 'road1', 'blvd1'
        ],
        [
          'street2', 'road2', 'blvd2'
        ]
      ]
    }))
  })

  it('sets value IN deeper nested multi-dimensional arrays of arrays', () => {
    let record = {
      obj: {
        101 : {
          addresses: [
            [
              undefined,
              [
                undefined,
                [ 'street1', 'road1', 'blvd1' ],
                [ 'street2', 'road2', 'blvd2' ]
              ],
              [
                undefined,
                { a: 'street1', b: 'road1', c: 'blvd1' },
                { 1: 'street2', 2: 'road2', 3: 'blvd2' }
              ]
            ],
            undefined,
            [ [0,1,2,3], [9,8,7,6], [2,4,6,8] ]
          ]
        }
      }
    }
    jsonPath.setValue(record, 'obj.101.addresses[0][1][1][0]', 'new-Street1')

    expect(JSON.stringify(record)).toEqual(JSON.stringify({
        obj: {
          101 : {
            addresses: [
              [
                undefined,
                [
                  undefined,
                  [ 'new-Street1', 'road1', 'blvd1' ],
                  [ 'street2', 'road2', 'blvd2' ]
                ],
                [
                  undefined,
                  { a: 'street1', b: 'road1', c: 'blvd1' },
                  { 1: 'street2', 2: 'road2', 3: 'blvd2' }
                ]
              ],
              undefined,
              [ [0,1,2,3], [9,8,7,6], [2,4,6,8] ]
            ]
          }
        }
    }))
  })

  it('extends existing objects', () => {
    let record = { firstname: 'Wolfram' }
    jsonPath.setValue(record, 'lastname', 'Hempel')

    expect(record).toEqual({
      firstname: 'Wolfram',
      lastname: 'Hempel'
    })
  })

  it('extends existing arrays', () => {
    let record = {
      firstname: 'Wolfram',
      animals: ['Bear', 'Cow', 'Ostrich']
    }
    jsonPath.setValue(record, 'animals[ 1 ]', 'Emu')

    expect(record).toEqual({
      firstname: 'Wolfram',
      animals: ['Bear', 'Emu', 'Ostrich']
    })
  })

  it('extends existing arrays with empty slot assigned a primitive', () => {
    let record = {
      firstname: 'Wolfram',
      animals: [undefined, 'Cow', 'Ostrich']
    }
    jsonPath.setValue(record, 'animals[0]', 'Emu')

    expect(record).toEqual({
      firstname: 'Wolfram',
      animals: ['Emu', 'Cow', 'Ostrich']
    })
  })

  it('extends existing arrays with objects', () => {
    let record = {
        firstname: 'Wolfram',
        animals: [undefined, 'Cow', 'Ostrich']
    }
    jsonPath.setValue(record, 'animals[0].xxx', 'Emu')

    expect(record).toEqual({
      firstname: 'Wolfram',
      animals: [{ xxx: 'Emu'}, 'Cow', 'Ostrich']
    })
  })

  it('treats numbers with the path such as .0. as a key value', () => {
    let record = {}
    jsonPath.setValue(record, 'animals.0.name', 'Emu')

    expect(record).toEqual({
      animals: {
        0: {
          name: 'Emu'
        }
      }
    })
  })

  it('treats numbers with the path such as [0] as an index value', () => {
    let record = {}
    jsonPath.setValue(record, 'animals[0].name', 'Emu')

    expect(record).toEqual({
      animals: [{
        name: 'Emu'
      }]
    })
  })

})