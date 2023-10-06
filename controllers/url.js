const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  console.log(body);
  const shortId = shortid.generate();
  if (!body.url) return res.status(400).json({ error: "url is required" });
  await URL.create({
    shortId,
    redirectURL: body.url,
    visitHistory: [],
    createdBy:req.user._id,
  });
  return res.render("home", {
    id: shortId,
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.status(200).json({
    totalClick: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

async function handleRedirectUrl(req, res) {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  if (!entry) return res.status(404).redirect("/");
  res.status(200).redirect(entry.redirectURL);
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleRedirectUrl,
};
