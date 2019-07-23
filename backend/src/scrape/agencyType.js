const agenciesType = [
    "Government",
    "Multinational",
    "Commercial",
    "Educational",
    "Private",
  ];

function agencyType(agencyID, agenciesResolutionTable = agenciesType) {
  if(agencyID > 0 && agencyID - 1 < agenciesResolutionTable.length) {
    return agenciesResolutionTable[agencyID - 1];
  } else return "Unknown"
}

module.exports = agencyType;