const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const requireAuth = require("../../middlewares/auth.middleware");
const { Blog } = require("../../models");

const create = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, slug, excerpt, content, author, image, category, tags, date, readTime } = req.body;
    if (!title || !slug || !content || !author || !category) {
      throw new ApiError(400, "Missing required fields");
    }
    const blog = await Blog.create({ title, slug, excerpt, content, author, image, category, tags, date, readTime });
    res.status(201).json({ blog });
  }),
];

const list = asyncHandler(async (req, res) => {
  const blogs = await Blog.findAll({ order: [["date", "DESC"]] });
  res.json({ blogs });
});

const getOne = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const blog = await Blog.findOne({ where: { slug } });
  if (!blog) throw new ApiError(404, "Blog not found");
  res.json({ blog });
});

const update = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const blog = await Blog.findOne({ where: { slug } });
    if (!blog) throw new ApiError(404, "Blog not found");
    await blog.update(req.body);
    res.json({ blog });
  }),
];

const remove = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const blog = await Blog.findOne({ where: { slug } });
    if (!blog) throw new ApiError(404, "Blog not found");
    await blog.destroy();
    res.status(204).send();
  }),
];

module.exports = { create, list, getOne, update, remove };
