const each = require('jest-each').default;

const agencyType = require("scrape/agencyShortName");

const stub = [
    "stub",
    "test",
    "testing",
    "",
]

each([undefined, null]).test('return "Unknown" on undefined/null', (agencyID) => {
   

    const result = agencyType(agencyID, stub)

    expect(result).toBe('Unknown');
});


each([-100, 0, 4, 100]).test('return "Unknown" on value outside reference table', (agencyID) => {
   

    const result = agencyType(agencyID, stub)

    expect(result).toBe('Unknown');
});

each([1,2,3]).test('returns valid agency from agencyResolutionTable', (agencyID) => {
   

    const result = agencyType(agencyID, stub)

    expect(result).toBe(stub[agencyID-1]);
});

each([4]).test('return "Unknown" when entry is empty in the reference table', (agencyID) => {
   
    agencyID
    const result = agencyType(agencyID, stub)

    expect(result).toBe('Unknown');
});