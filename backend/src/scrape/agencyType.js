const agenciesType = [
    "Government",
    "Multinational",
    "Commercial",
    "Educational",
    "Private",
];

function agencyType(agencyID, agenciesResolutionTable = agenciesType) 
{
    return agenciesResolutionTable[agencyID-1] || "Unknown"
}

module.exports = agencyType;