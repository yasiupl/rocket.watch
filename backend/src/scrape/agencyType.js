const agenciesType = {
	1: "Government",
	2: "Multinational",
	3: "Commercial",
	4: "Educational",
	5: "Private",
};

function agencyType(agencyID, agenciesResolutionTable = agenciesType) 
{
	return agenciesResolutionTable[agencyID] || "Unknown";
}

module.exports = agencyType;
