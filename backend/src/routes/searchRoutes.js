const router = require("express").Router();
const {
  globalSearch,
  searchSuggest,
} = require("../controllers/searchController");

router.get("/search", globalSearch);
router.get("/search/suggest", searchSuggest);

module.exports = router;
