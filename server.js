//Backend server setup to retrieve API data, without exposing API key to frontend.
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.get("/api/birds", async (req, res) => {
  try {
    // Retrieves optional search query, normalizes to lowercase, or defaults to no search
    const searchFunction = req.query.search?.toLowerCase() || "";
    //Pagination variables required by API, due to limited results per request.
    const pageSize = 100;
    let page = 1;
    let allBirds = [];
    //Loop through all API pages until the final page of data is reached.
    while (true) {
      const endpoint = `https://nuthatch.lastelm.software/v2/birds?page=${page}&pageSize=${pageSize}&region=North%20America&hasImg=true&operator=AND`;
      const response = await fetch(endpoint, {
        headers: {
          "API-Key": process.env.API_KEY,
        },
      });
      //Error handling
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const allData = await response.json();
      const birdsArray = allData.entities || allData.birds || [];
      allBirds.push(...birdsArray);
      if (birdsArray.length < pageSize) break;
      page++;
    }
    //Filter birds by search term and maps only required fields for the frontend.
    const filteredBirds = allBirds
      .filter((bird) => {
        if (!searchFunction) return true;
        return (bird.name || "").toLowerCase().includes(searchFunction);
      })
      .map((bird) => ({
        name: bird.name,
        status: bird.status,
        images:
          bird.images && bird.images.length > 0
            ? [bird.images[0]]
            : ["/images/no-image-available.jpg"],
      }));
    res.json(filteredBirds);
  } catch (error) {
    console.error("Error fetching birds:", error);
    res.status(500).json({ error: "Failed to fetch birds" });
  }
});
//Console log to display port and link to local host
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
