require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.get("/api/birds", async (req, res) => {
  try {
    const searchFunction = req.query.search?.toLowerCase() || "";
    const pageSize = 100;
    let page = 1;
    let allBirds = [];

    while (true) {
      const endpoint = `https://nuthatch.lastelm.software/v2/birds?page=${page}&pageSize=${pageSize}&region=North%20America&hasImg=true&operator=AND`;
      const response = await fetch(endpoint, {
        headers: {
          "API-Key": process.env.API_KEY,
        },
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const allData = await response.json();
      const birdsArray = allData.entities || allData.birds || [];
      allBirds.push(...birdsArray);
      if (birdsArray.length < pageSize) break;
      page++;
    }

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
console.log(`Visit your site at https://your-project-name.up.railway.app`);
