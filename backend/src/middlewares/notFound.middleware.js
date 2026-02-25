module.exports = (req, res) => {
  res.status(404).json({ error: "Not Found", code: "NOT_FOUND" });
};
