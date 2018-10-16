const axios = require("axios");

async function main()
{
    expected_url = "https://discordapp.com/invite/cExSaKZ";

    const response = await axios.get("http://localhost:8080/discord");
    response_url = response.request.res.responseUrl;
    
    process.exit(response_url === expected_url ? 0 : 1);
}

main();
