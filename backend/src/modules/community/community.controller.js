const asyncHandler = require("../../utils/asyncHandler");
const ApiError = require("../../utils/ApiError");
const requireAuth = require("../../middlewares/auth.middleware");
const { CommunityPost, CommunityComment, CommunityLike, User, sequelize } = require("../../models");

const CATEGORIES = ["success", "tips", "guides", "support", "apia"];

const serializePost = (post) => ({
  id: post.id,
  title: post.title,
  body: post.body,
  category: post.category,
  likes: post.likesCount,
  comments: post.commentsCount,
  createdAt: post.created_at || post.createdAt,
  author: post.owner ? (post.owner.name || post.owner.username || "Anonim") : "Anonim",
  location: post.owner?.globalLocationName || null,
  ownerId: post.ownerId,
});

const serializeComment = (comment) => ({
  id: comment.id,
  body: comment.body,
  createdAt: comment.created_at || comment.createdAt,
  author: comment.owner ? (comment.owner.name || comment.owner.username || "Anonim") : "Anonim",
  ownerId: comment.ownerId,
});

const list = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const where = {};
  if (category && CATEGORIES.includes(category)) where.category = category;

  const posts = await CommunityPost.findAll({
    where,
    include: [{ model: User, as: "owner", attributes: ["id", "name", "username", "globalLocationName"] }],
    order: [["created_at", "DESC"]],
    limit: 100,
  });

  res.json({ posts: posts.map(serializePost) });
});

const getOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await CommunityPost.findByPk(id, {
    include: [
      { model: User, as: "owner", attributes: ["id", "name", "username", "globalLocationName"] },
      {
        model: CommunityComment,
        as: "comments",
        include: [{ model: User, as: "owner", attributes: ["id", "name", "username"] }],
      },
    ],
    order: [[{ model: CommunityComment, as: "comments" }, "created_at", "ASC"]],
  });
  if (!post) throw new ApiError(404, "Post not found", null, "COMMUNITY_POST_NOT_FOUND");

  res.json({
    post: serializePost(post),
    comments: (post.comments || []).map(serializeComment),
  });
});

const create = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { title, body, category } = req.body || {};
    if (!title || !body || !category) {
      throw new ApiError(400, "Missing required fields: title, body, category");
    }
    if (typeof title !== "string" || title.trim().length < 5 || title.length > 200) {
      throw new ApiError(400, "Title must be 5-200 characters");
    }
    if (typeof body !== "string" || body.trim().length < 10 || body.length > 5000) {
      throw new ApiError(400, "Body must be 10-5000 characters");
    }
    if (!CATEGORIES.includes(category)) {
      throw new ApiError(400, "Invalid category");
    }

    const post = await CommunityPost.create({
      ownerId: req.user.sub,
      title: title.trim(),
      body: body.trim(),
      category,
    });

    const full = await CommunityPost.findByPk(post.id, {
      include: [{ model: User, as: "owner", attributes: ["id", "name", "username", "globalLocationName"] }],
    });

    res.status(201).json({ post: serializePost(full) });
  }),
];

const remove = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await CommunityPost.findByPk(id);
    if (!post) throw new ApiError(404, "Post not found", null, "COMMUNITY_POST_NOT_FOUND");
    if (post.ownerId !== req.user.sub && req.user.role !== "ADMIN") {
      throw new ApiError(403, "Not allowed to delete this post");
    }
    await post.destroy();
    res.status(204).send();
  }),
];

const addComment = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { body } = req.body || {};
    if (!body || typeof body !== "string" || body.trim().length < 1 || body.length > 2000) {
      throw new ApiError(400, "Comment body must be 1-2000 characters");
    }
    const post = await CommunityPost.findByPk(id);
    if (!post) throw new ApiError(404, "Post not found", null, "COMMUNITY_POST_NOT_FOUND");

    const comment = await sequelize.transaction(async (t) => {
      const c = await CommunityComment.create(
        { postId: id, ownerId: req.user.sub, body: body.trim() },
        { transaction: t }
      );
      await post.increment("commentsCount", { by: 1, transaction: t });
      return c;
    });

    const full = await CommunityComment.findByPk(comment.id, {
      include: [{ model: User, as: "owner", attributes: ["id", "name", "username"] }],
    });

    res.status(201).json({ comment: serializeComment(full) });
  }),
];

const toggleLike = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await CommunityPost.findByPk(id);
    if (!post) throw new ApiError(404, "Post not found", null, "COMMUNITY_POST_NOT_FOUND");

    const result = await sequelize.transaction(async (t) => {
      const existing = await CommunityLike.findOne({
        where: { postId: id, ownerId: req.user.sub },
        transaction: t,
      });
      if (existing) {
        await existing.destroy({ transaction: t });
        await post.decrement("likesCount", { by: 1, transaction: t });
        return { liked: false };
      }
      await CommunityLike.create({ postId: id, ownerId: req.user.sub }, { transaction: t });
      await post.increment("likesCount", { by: 1, transaction: t });
      return { liked: true };
    });

    await post.reload();
    res.json({ liked: result.liked, likes: post.likesCount });
  }),
];

const myLikes = [
  requireAuth,
  asyncHandler(async (req, res) => {
    const likes = await CommunityLike.findAll({
      where: { ownerId: req.user.sub },
      attributes: ["postId"],
    });
    res.json({ postIds: likes.map((l) => l.postId) });
  }),
];

module.exports = { list, getOne, create, remove, addComment, toggleLike, myLikes };
