const backendURL = "https://ll.thespacedevs.com/2.0.0/";

export async function fetchLaunchData(query) {
  try {
    const response = await fetch(backendURL + query);
    if (!response.ok) {
      // Log more detailed error information
      const errorData = await response.text();
      console.error(`API Error ${response.status}: ${errorData} for query: ${query}`);
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch launch data:", error);
    // Re-throw the error or return a specific error structure
    // For now, returning null to indicate failure, can be improved
    return null;
  }
}

// We might need other utility functions from the original utils.js later.
// For example: ReadableDateString, getLongStatusName
// These can be added here or in a separate utils.js in the lib folder.

export function ReadableDateString(f) {
  if (!f) return 'N/A';
  try {
    let e = new Date(f);
    // Make sure it's a valid date
    if (isNaN(e.getTime())) return 'Invalid Date';
    let d = e.getFullYear() + "-" + ("0" + (e.getMonth() + 1)).slice(-2) + "-" + ("0" + e.getDate()).slice(-2) + " " + ("0" + e.getHours()).slice(-2) + ":" + ("0" + e.getMinutes()).slice(-2) + ":" + ("0" + e.getSeconds()).slice(-2);
    return d;
  } catch (error) {
    console.error("Error formatting date:", f, error);
    return 'Date Error';
  }
}

export function getLongStatusName(status_id) {
  // Original status mapping:
  // const statuses = ["NO-GO for launch", "GO for launch", "To Be Determined", "Launch successful", "Launch failed", "Hold", "In Flight", "Partial Failure"];
  // From API docs (https://ll.thespacedevs.com/2.0.0/config/launchstatus/):
  // 1: Go for Launch (Green)
  // 2: To Be Determined (TBD) (Gray)
  // 3: Launch Successful (Green)
  // 4: Launch Failure (Red)
  // 5: On Hold (Orange)
  // 6: In Flight (Blue)
  // 7: Partial Failure (Yellow)
  // 8: To Be Confirmed (TBC) (Gray)

  const statuses = {
    1: "Go for Launch",
    2: "To Be Determined",
    3: "Launch Successful",
    4: "Launch Failure",
    5: "On Hold",
    6: "In Flight",
    7: "Partial Failure",
    8: "To Be Confirmed"
  };

  return statuses[status_id] || "Unknown Status";
}
