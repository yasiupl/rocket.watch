const each = require("jest-each").default;

const agencyType = require("scrape/agencyType");

const stub = {
	1: "stub",
	2: "test",
	3: "testing",
	4: "",
};

each([undefined, null]).test("return \"Unknown\" on undefined/null", (agencyID) => 
{
   

	const result = agencyType(agencyID, stub);

	expect(result).toBe("Unknown");
});


each([-100, 0, 100]).test("return \"Unknown\" on value outside reference table", (agencyID) => 
{
   

	const result = agencyType(agencyID, stub);

	expect(result).toBe("Unknown");
});

each([[1,"stub"], [2,"test"], [3,"testing"]]).test("returns valid agency from agencyResolutionTable", (agencyID, name) => 
{

	const result = agencyType(agencyID, stub);

	expect(result).toBe(name);
});

each([4]).test("return \"Unknown\" when entry is empty in the reference table", (agencyID) => 
{
   
	const result = agencyType(agencyID, stub);

	expect(result).toBe("Unknown");
});
