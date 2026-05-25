import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  MessageSquare,
  ThumbsUp,
  Trophy,
  User,
  Users,
  Wheat,
  TrendingUp,
  Zap,
  X,
  Filter,
  ChevronDown,
  PenSquare,
  Send,
  Trash2,
  Loader2,
} from "lucide-react";
import LandingLayout from "../../components/landing/LandingLayout";
import LandingNavbar from "../../components/landing/LandingNavbar";
import LandingFooter from "../../components/landing/LandingFooter";
import { authStore } from "../../auth/auth.store";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useLanguage } from "../../i18n/LanguageProvider";
import { api, getErrorMessage } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";

const categories = [
  { id: "all", icon: MessageCircle, label: { ro: "Toate", en: "All" } },
  { id: "success", icon: Trophy, label: { ro: "Povești de Succes", en: "Success Stories" } },
  { id: "tips", icon: Zap, label: { ro: "Sfaturi", en: "Tips" } },
  { id: "guides", icon: Wheat, label: { ro: "Ghiduri", en: "Guides" } },
  { id: "support", icon: MessageSquare, label: { ro: "Suport Tehnic", en: "Tech Support" } },
  { id: "apia", icon: TrendingUp, label: { ro: "APIA", en: "APIA" } },
];

const formatRelativeTime = (timestamp, lang) => {
  if (!timestamp) return "";
  const diff = Date.now() - new Date(timestamp).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (d > 0) return `${d}${lang === "ro" ? "z" : "d"}`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}${lang === "ro" ? "min" : "m"}`;
  return lang === "ro" ? "acum" : "now";
};

const initials = (name) =>
  (name || "?").split(" ").filter(Boolean).map((n) => n[0].toUpperCase()).slice(0, 2).join("");

export default function CommunityPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const forumRef = useRef(null);
  const isAuthenticated = authStore.isAuthed();
  const currentUser = authStore.getUser();

  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [showComposer, setShowComposer] = useState(false);

  const [posts, setPosts] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.community.listPosts(activeCategory);
      setPosts(data);
    } catch (err) {
      setError(getErrorMessage(err, language === "ro" ? "Nu am putut încărca discuțiile." : "Could not load discussions."));
    } finally {
      setLoading(false);
    }
  }, [activeCategory, language]);

  const loadLikes = useCallback(async () => {
    if (!isAuthenticated) {
      setLikedIds(new Set());
      return;
    }
    try {
      const ids = await api.community.myLikes();
      setLikedIds(new Set(ids));
    } catch {
      // non-fatal
    }
  }, [isAuthenticated]);

  useEffect(() => { loadPosts(); }, [loadPosts]);
  useEffect(() => { loadLikes(); }, [loadLikes]);

  const getText = (obj) => (typeof obj === "string" ? obj : obj?.[language] || obj?.en || "");

  const totalLikes = useMemo(() => posts.reduce((s, p) => s + (p.likes || 0), 0), [posts]);

  const scrollToForum = () => forumRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate("/auth/register");
      return false;
    }
    return true;
  };

  const toggleLike = async (postId, e) => {
    e?.stopPropagation();
    if (!requireAuth()) return;

    const wasLiked = likedIds.has(postId);
    setLikedIds((prev) => {
      const next = new Set(prev);
      wasLiked ? next.delete(postId) : next.add(postId);
      return next;
    });
    setPosts((prev) => prev.map((p) =>
      p.id === postId ? { ...p, likes: p.likes + (wasLiked ? -1 : 1) } : p
    ));

    try {
      const result = await api.community.toggleLike(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes: result.likes } : p)));
    } catch {
      // rollback
      setLikedIds((prev) => {
        const next = new Set(prev);
        wasLiked ? next.add(postId) : next.delete(postId);
        return next;
      });
      setPosts((prev) => prev.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + (wasLiked ? 1 : -1) } : p
      ));
    }
  };

  const handleCreatePost = async (data) => {
    try {
      const created = await api.community.createPost(data);
      setPosts((prev) => [created, ...prev]);
      setShowComposer(false);
      toastSuccess(language === "ro" ? "Postare publicată." : "Post published.");
    } catch (err) {
      toastError(err, language === "ro" ? "Nu am putut publica postarea." : "Could not publish post.");
    }
  };

  const handleDeletePost = async (postId) => {
    const ok = window.confirm(language === "ro" ? "Sigur ștergi această postare?" : "Delete this post?");
    if (!ok) return;
    try {
      await api.community.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      if (selectedTopicId === postId) setSelectedTopicId(null);
      toastSuccess(language === "ro" ? "Postare ștearsă." : "Post deleted.");
    } catch (err) {
      toastError(err, language === "ro" ? "Nu am putut șterge postarea." : "Could not delete post.");
    }
  };

  const selectedPost = posts.find((p) => p.id === selectedTopicId);

  return (
    <LandingLayout>
      <LandingNavbar />

      <AnimatePresence>
        {selectedPost && (
          <TopicModal
            postSummary={selectedPost}
            language={language}
            isAuthenticated={isAuthenticated}
            isLiked={likedIds.has(selectedPost.id)}
            isOwner={currentUser?.id === selectedPost.ownerId}
            onClose={() => setSelectedTopicId(null)}
            onLike={(e) => toggleLike(selectedPost.id, e)}
            onLoginPrompt={() => navigate("/auth/register")}
            onDelete={() => handleDeletePost(selectedPost.id)}
            categoryLabel={getText(categories.find((c) => c.id === selectedPost.category)?.label || {})}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComposer && (
          <ComposerModal
            language={language}
            onClose={() => setShowComposer(false)}
            onSubmit={handleCreatePost}
          />
        )}
      </AnimatePresence>

      <main className="flex-1">
        <section className="relative py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
              >
                <ArrowLeft size={16} />
                {language === "ro" ? "Înapoi la pagina principală" : "Back to home"}
              </button>

              <Badge variant="success" className="mb-4">
                <Users size={14} className="mr-1" />
                {language === "ro" ? "Comunitate" : "Community"}
              </Badge>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                {language === "ro" ? "Forumul " : "The "}
                <span className="text-primary">AgriOne</span>
                {language === "ro" ? "" : " forum"}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {language === "ro"
                  ? "Întreabă, împărtășește și învață alături de alți fermieri."
                  : "Ask, share and learn alongside other farmers."}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {isAuthenticated ? (
                  <Button onClick={() => setShowComposer(true)} variant="primary">
                    <PenSquare size={16} className="mr-2" />
                    {language === "ro" ? "Postează o discuție" : "Post a discussion"}
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/auth/register")} variant="primary">
                    {language === "ro" ? "Alătură-te gratuit" : "Join for free"}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                )}
                <Button onClick={scrollToForum} variant="ghost">
                  {language === "ro" ? "Vezi discuțiile" : "Browse discussions"}
                  <ChevronDown size={16} className="ml-1" />
                </Button>
              </div>

              <div className="flex justify-center gap-8 mt-10 text-center">
                <div>
                  <div className="text-2xl font-extrabold text-primary">{posts.length}</div>
                  <div className="text-xs text-muted-foreground">{language === "ro" ? "Discuții" : "Discussions"}</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-primary">{totalLikes}</div>
                  <div className="text-xs text-muted-foreground">{language === "ro" ? "Aprecieri" : "Likes"}</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-primary">{categories.length - 1}</div>
                  <div className="text-xs text-muted-foreground">{language === "ro" ? "Categorii" : "Categories"}</div>
                </div>
              </div>
            </Motion.div>
          </div>
        </section>

        <section className="py-12 lg:py-16" ref={forumRef}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold">
                {language === "ro" ? "Discuții" : "Discussions"}
              </h2>
              <Button
                onClick={() => (isAuthenticated ? setShowComposer(true) : navigate("/auth/register"))}
                variant="primary"
                size="sm"
              >
                <PenSquare size={14} className="mr-1.5" />
                {language === "ro" ? "Postează" : "Post"}
              </Button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              <Filter size={14} className="text-muted-foreground flex-shrink-0" />
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card/60 border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon size={12} />
                    {getText(cat.label)}
                  </button>
                );
              })}
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 size={28} className="animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="card p-6 text-center">
                <p className="text-sm text-destructive mb-3">{error}</p>
                <Button onClick={loadPosts} variant="secondary" size="sm">
                  {language === "ro" ? "Reîncearcă" : "Retry"}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((topic, index) => {
                  const catLabel = categories.find((c) => c.id === topic.category)?.label || {};
                  const isOwn = currentUser?.id === topic.ownerId;
                  return (
                    <Motion.div
                      key={topic.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.04, 0.3) }}
                      whileHover={{ y: -2 }}
                      className="card p-4 hover:border-primary/30 transition-all cursor-pointer group"
                      onClick={() => setSelectedTopicId(topic.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-sm text-primary">{initials(topic.author)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant="default" className="text-xs">{getText(catLabel)}</Badge>
                            {isOwn && (
                              <Badge variant="success" className="text-xs">
                                {language === "ro" ? "A ta" : "Yours"}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                            {topic.title}
                          </h3>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1"><User size={12} />{topic.author}</span>
                            {topic.location && (
                              <span className="flex items-center gap-1"><MapPin size={12} />{topic.location}</span>
                            )}
                            <span className="flex items-center gap-1"><MessageSquare size={12} />{topic.comments}</span>
                            <button
                              onClick={(e) => toggleLike(topic.id, e)}
                              className={`flex items-center gap-1 transition-colors ${likedIds.has(topic.id) ? "text-primary" : "hover:text-primary"}`}
                            >
                              <ThumbsUp size={12} />
                              {topic.likes}
                            </button>
                            <span className="flex items-center gap-1"><Clock size={12} />{formatRelativeTime(topic.createdAt, language)}</span>
                          </div>
                        </div>
                      </div>
                    </Motion.div>
                  );
                })}

                {posts.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground card">
                    <MessageCircle size={32} className="mx-auto mb-3 opacity-40" />
                    <p className="mb-4">
                      {language === "ro" ? "Nicio discuție încă." : "No discussions yet."}
                    </p>
                    {isAuthenticated && (
                      <Button onClick={() => setShowComposer(true)} variant="primary" size="sm">
                        <PenSquare size={14} className="mr-1.5" />
                        {language === "ro" ? "Fii primul care postează" : "Be the first to post"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <div className="card p-5 mt-8 bg-gradient-to-br from-primary/10 via-card to-card border-primary/20 text-center">
                <Heart size={28} className="text-primary mx-auto mb-2" />
                <h3 className="font-bold mb-1">
                  {language === "ro" ? "Vrei să participi?" : "Want to participate?"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "ro"
                    ? "Creează un cont gratuit ca să postezi, să comentezi și să apreciezi."
                    : "Create a free account to post, comment and like."}
                </p>
                <Button onClick={() => navigate("/auth/register")} variant="primary" size="sm">
                  {language === "ro" ? "Alătură-te gratuit" : "Join for free"}
                  <ArrowRight size={14} className="ml-1.5" />
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <LandingFooter />
    </LandingLayout>
  );
}

/* ------------ Subcomponents ------------ */

function TopicModal({ postSummary, language, isAuthenticated, isLiked, isOwner, onClose, onLike, onLoginPrompt, onDelete, categoryLabel }) {
  const [detail, setDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.community
      .getPost(postSummary.id)
      .then((data) => {
        if (cancelled) return;
        setDetail(data.post);
        setComments(data.comments || []);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [postSummary.id]);

  const submitReply = async (e) => {
    e.preventDefault();
    const trimmed = replyText.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      const c = await api.community.addComment(postSummary.id, trimmed);
      setComments((prev) => [...prev, c]);
      setReplyText("");
    } catch (err) {
      toastError(err, language === "ro" ? "Nu am putut trimite răspunsul." : "Could not send reply.");
    } finally {
      setSending(false);
    }
  };

  const post = detail || postSummary;

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <Motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative bg-card border border-border/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-border/20">
          <div className="flex-1 pr-4">
            <Badge variant="default" className="text-xs mb-2">{categoryLabel}</Badge>
            <h2 className="font-extrabold text-lg leading-snug">{post.title}</h2>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
              {post.location && <span className="flex items-center gap-1"><MapPin size={12} />{post.location}</span>}
              <span className="flex items-center gap-1"><Clock size={12} />{formatRelativeTime(post.createdAt, language)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isOwner && (
              <button
                onClick={onDelete}
                title={language === "ro" ? "Șterge" : "Delete"}
                className="p-2 rounded-lg hover:bg-destructive/15 hover:text-destructive transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line">{post.body}</p>

          <div className="flex items-center gap-4 py-3 border-y border-border/20">
            <button
              onClick={onLike}
              className={`flex items-center gap-2 text-sm transition-colors ${
                isLiked ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <ThumbsUp size={16} />
              {post.likes} {language === "ro" ? "aprecieri" : "likes"}
            </button>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <MessageSquare size={16} />
              {comments.length} {language === "ro" ? "răspunsuri" : "replies"}
            </span>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-4 text-muted-foreground uppercase tracking-wider">
              {language === "ro" ? "Răspunsuri" : "Replies"}
            </h3>
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 size={20} className="animate-spin text-primary" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                {language === "ro" ? "Niciun răspuns încă. Fii primul!" : "No replies yet. Be the first!"}
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {initials(c.author)}
                    </div>
                    <div className="flex-1 bg-secondary/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">{c.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(c.createdAt, language)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 whitespace-pre-line">{c.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border/20 bg-card/50">
          {isAuthenticated ? (
            <form onSubmit={submitReply} className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={language === "ro" ? "Scrie un răspuns..." : "Write a reply..."}
                className="flex-1 bg-secondary/40 border border-border/30 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 transition-colors"
                disabled={sending}
              />
              <Button type="submit" variant="primary" size="sm" disabled={!replyText.trim() || sending}>
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="flex-1 text-sm text-muted-foreground">
                {language === "ro" ? "Creează un cont pentru a răspunde." : "Create an account to reply."}
              </p>
              <Button variant="primary" size="sm" onClick={onLoginPrompt} className="sm:flex-shrink-0">
                {language === "ro" ? "Creează cont" : "Create account"}
              </Button>
            </div>
          )}
        </div>
      </Motion.div>
    </Motion.div>
  );
}

function ComposerModal({ language, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("tips");
  const [submitting, setSubmitting] = useState(false);

  const composerCategories = categories.filter((c) => c.id !== "all");
  const canSubmit = title.trim().length >= 5 && body.trim().length >= 10 && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), body: body.trim(), category });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <Motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative bg-card border border-border/30 rounded-2xl shadow-2xl w-full max-w-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between p-5 border-b border-border/20">
            <h2 className="font-extrabold text-lg flex items-center gap-2">
              <PenSquare size={18} className="text-primary" />
              {language === "ro" ? "Postează o discuție" : "Post a discussion"}
            </h2>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                {language === "ro" ? "Categorie" : "Category"}
              </label>
              <div className="flex flex-wrap gap-2">
                {composerCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        category === cat.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-card/60 border border-border/30 text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      <Icon size={12} />
                      {cat.label[language] || cat.label.en}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                {language === "ro" ? "Titlu" : "Title"}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={language === "ro" ? "Despre ce vrei să vorbim?" : "What's on your mind?"}
                maxLength={200}
                className="w-full bg-secondary/40 border border-border/30 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors"
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">{title.length}/200</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                {language === "ro" ? "Conținut" : "Content"}
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={language === "ro" ? "Detalii, întrebări, experiențe..." : "Details, questions, experiences..."}
                rows={6}
                maxLength={5000}
                className="w-full bg-secondary/40 border border-border/30 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors resize-none"
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">{body.length}/5000</div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 p-5 border-t border-border/20 bg-card/50">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
              {language === "ro" ? "Anulează" : "Cancel"}
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={!canSubmit}>
              {submitting ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Send size={14} className="mr-1.5" />}
              {language === "ro" ? "Publică" : "Publish"}
            </Button>
          </div>
        </form>
      </Motion.div>
    </Motion.div>
  );
}
