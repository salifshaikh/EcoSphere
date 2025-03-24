import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, updateDoc, doc, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { Sparkles, Clock, Heart, MessageCircle, Search, X, Share2, Leaf, Wind, Droplet, Sun, Zap, ChevronRight, Filter } from 'lucide-react';

// Modal Component for Full Blog Post
const BlogModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-emerald-900 to-blue-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-emerald-900/90 backdrop-blur-sm border-b border-emerald-700 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-green-400" />
              {post.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-emerald-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {post.imageUrl && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-6 border border-emerald-700">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Author Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {post.author?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{post.author}</p>
                <p className="text-sm text-gray-300 flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-green-400" />
                  {post.createdAt?.toDate().toLocaleDateString()}
                </p>
              </div>
              
              <div className="ml-auto px-3 py-1 bg-green-800/50 text-green-300 rounded-full text-sm flex items-center">
                <Leaf className="w-4 h-4 mr-1" />
                <span>Eco Story</span>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Tags */}
            {post.tags && (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-emerald-800/40 text-emerald-300 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-emerald-800 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors">
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current text-red-400' : ''}`} />
                  <span>{post.likes || 0}</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments?.length || 0}</span>
                </button>
              </div>
              <button className="flex items-center space-x-2 text-gray-300 hover:text-emerald-400 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: null, tags: [] });
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const maxPreviewLength = 150;
  
  // Cloudinary credentials
  const CLOUDINARY_UPLOAD_PRESET = 'KahaniAI';
  const CLOUDINARY_CLOUD_NAME = 'dqsixqhky';

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Stories', icon: <Leaf /> },
    { id: 'renewable', name: 'Renewable Energy', icon: <Sun /> },
    { id: 'water', name: 'Water Conservation', icon: <Droplet /> },
    { id: 'recycling', name: 'Recycling', icon: <Wind /> },
    { id: 'energy', name: 'Energy Saving', icon: <Zap /> },
  ];

  useEffect(() => {
    if (!user) {
      fetchPosts();
    } else {
      fetchPostsWithoutUser();
    }
  }, [sortBy, !user, selectedCategory]);

  useEffect(() => {
    const filtered = posts.filter(post => 
      (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === 'all' || post.category === selectedCategory)
    );
    setFilteredPosts(filtered);
  }, [searchQuery, posts, selectedCategory]);

  const fetchPostsWithoutUser = async () => {
    try {
      let q;
      if (sortBy === 'newest') {
        q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
      } else {
        q = query(collection(db, 'blog_posts'), orderBy('likes', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isLiked: false,
        tags: doc.data().tags || ['sustainability', 'eco-friendly'],
        category: doc.data().category || 'renewable'
      }));
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      let q;
      if (sortBy === 'newest') {
        q = query(collection(db, 'blog_posts'), orderBy('createdAt', 'desc'));
      } else {
        q = query(collection(db, 'blog_posts'), orderBy('likes', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      const fetchedPosts = await Promise.all(querySnapshot.docs.map(async doc => {
        const postData = doc.data();
        let isLiked = false;
        
        if (!user) {
          const likesQuery = query(
            collection(db, 'blog_posts', doc.id, 'likes'),
            where('userId', '==', user.uid)
          );
          const likeSnapshot = await getDocs(likesQuery);
          isLiked = !likeSnapshot.empty;
        }

        return {
          id: doc.id,
          ...postData,
          isLiked,
          likes: postData.likes || 0,
          tags: postData.tags || ['sustainability', 'eco-friendly'],
          category: postData.category || 'renewable'
        };
      }));
      
      setPosts(fetchedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    try {
      const postRef = doc(db, 'blog_posts', postId);
      const post = posts.find(p => p.id === postId);
      const likesCollectionRef = collection(postRef, 'likes');
      
      if (post.isLiked) {
        // Unlike the post
        const likeQuery = query(likesCollectionRef, where('userId', '==', user.uid));
        const likeSnapshot = await getDocs(likeQuery);
        
        if (!likeSnapshot.empty) {
          await deleteDoc(likeSnapshot.docs[0].ref);
        }
        
        await updateDoc(postRef, {
          likes: Math.max((post.likes || 0) - 1, 0) // Ensure likes don't go below 0
        });

        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes: Math.max((p.likes || 0) - 1, 0), isLiked: false }
            : p
        ));
      } else {
        // Like the post
        await addDoc(likesCollectionRef, {
          userId: user.uid,
          createdAt: serverTimestamp()
        });

        await updateDoc(postRef, {
          likes: (post.likes || 0) + 1
        });

        setPosts(posts.map(p => 
          p.id === postId 
            ? { ...p, likes: (p.likes || 0) + 1, isLiked: true }
            : p
        ));
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost({ ...newPost, image: file });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !newPost.tags.includes(tagInput.trim())) {
      setNewPost({
        ...newPost,
        tags: [...newPost.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewPost({
      ...newPost,
      tags: newPost.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      let imageUrl = '';

      if (newPost.image) {
        imageUrl = await uploadImageToCloudinary(newPost.image);
      }

      await addDoc(collection(db, 'blog_posts'), {
        title: newPost.title,
        content: newPost.content,
        imageUrl,
        author: user.displayName || user.email,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        likes: 0,
        comments: [],
        tags: newPost.tags.length > 0 ? newPost.tags : ['sustainability', 'eco-friendly'],
        category: newPost.category || 'renewable'
      });

      setNewPost({ title: '', content: '', image: null, tags: [], category: 'renewable' });
      setPreviewUrl(null);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content) => {
    if (content.length <= maxPreviewLength) return content;
    return content.substring(0, maxPreviewLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-900 via-blue-900 to-emerald-900 py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 flex items-center justify-center">
          <Leaf className="w-10 h-10 mr-3 text-green-400" />
          Eco<span className="text-green-400">Stories</span>
        </h1>
        <p className="text-white text-lg max-w-2xl mx-auto">
          Share your sustainable journey, inspire others, and help build a greener future together.
        </p>
      </motion.div>

      {/* Category Navigation */}
      <div className="max-w-7xl mx-auto mb-8 overflow-x-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-2 pb-2"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-emerald-800/30 text-gray-300 hover:bg-emerald-800/50'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Search and Sort Controls */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Search eco stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-emerald-900/30 border border-emerald-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-emerald-400/70"
          />
        </div>
        <div className="flex items-center px-4 py-2 bg-emerald-900/30 border border-emerald-700/50 text-white rounded-lg">
          <Filter className="w-5 h-5 text-emerald-400 mr-2" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-white focus:outline-none"
          >
            <option value="newest" className="bg-emerald-900 text-white">Newest First</option>
            <option value="mostLiked" className="bg-emerald-900 text-white">Most Liked</option>
          </select>
        </div>
      </motion.div>

      {/* Create Post Section (Only for logged-in users) */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto mb-16 bg-gradient-to-br from-emerald-800/70 to-blue-900/70 backdrop-blur-sm p-6 rounded-xl border border-emerald-700/50 shadow-xl"
        >
          <div className="flex items-center mb-6">
            <Leaf className="w-6 h-6 text-green-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Share Your Eco Story</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Your story title..."
                className="w-full bg-emerald-900/40 border border-emerald-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-emerald-400/70"
                required
              />
            </div>
            <div>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Share your sustainability journey or eco-friendly tips..."
                className="w-full bg-emerald-900/40 border border-emerald-700/50 text-white rounded-lg px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-emerald-400/70"
                required
              />
            </div>
            
            {/* Category Selection */}
            <div>
              <label className="block text-emerald-300 mb-2 text-sm">Story Category</label>
              <select
                value={newPost.category || 'renewable'}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="w-full bg-emerald-900/40 border border-emerald-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {categories.filter(c => c.id !== 'all').map(category => (
                  <option key={category.id} value={category.id} className="bg-emerald-900">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Tags Input */}
            <div>
              <label className="block text-emerald-300 mb-2 text-sm">Tags (optional)</label>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags..."
                  className="flex-1 bg-emerald-900/40 border border-emerald-700/50 text-white rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-emerald-400/70"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors"
                >
                  Add
                </button>
              </div>
              
              {/* Display Tags */}
              <div className="flex flex-wrap gap-2 mt-2">
                {newPost.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-emerald-700/50 text-white rounded-full text-sm flex items-center">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-emerald-300 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="block w-full text-center py-3 px-4 rounded-lg border-2 border-dashed border-emerald-700 hover:border-green-400 cursor-pointer transition duration-300"
              >
                <Sparkles className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <span className="text-emerald-300">Add an image to your story</span>
              </label>
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-emerald-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null);
                      setNewPost({ ...newPost, image: null });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-lg hover:from-green-500 hover:to-emerald-400 transition duration-300 flex items-center justify-center"
            >
              {loading ? (
                'Publishing...'
              ) : (
                <>
                  <Leaf className="w-5 h-5 mr-2" />
                  Share Your Eco Story
                </>
              )}
            </button>
          </form>
        </motion.div>
      )}

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(searchQuery || selectedCategory !== 'all' ? filteredPosts : posts).map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index % 6) }}
            className="bg-gradient-to-br from-emerald-900/80 to-blue-900/80 backdrop-blur-sm rounded-xl overflow-hidden border border-emerald-700/50 hover:border-green-500/70 transition duration-300 shadow-lg hover:shadow-emerald-900/30 hover:shadow-xl"
          >
            {post.imageUrl && (
              <div 
                className="aspect-video w-full overflow-hidden cursor-pointer relative group"
                onClick={() => setSelectedPost(post)}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-emerald-800/80 text-green-300 rounded-full text-xs flex items-center backdrop-blur-sm">
                    {categories.find(c => c.id === (post.category || 'renewable'))?.icon}
                    <span className="ml-1">{categories.find(c => c.id === (post.category || 'renewable'))?.name}</span>
                  </span>
                </div>
              </div>
            )}
            <div className="p-6">
              <h2 
                className="text-xl font-bold text-white mb-3 cursor-pointer hover:text-green-400 transition-colors flex items-start"
                onClick={() => setSelectedPost(post)}
              >
                <Leaf className="w-5 h-5 mr-2 text-green-400 mt-1 flex-shrink-0" />
                <span>{post.title}</span>
              </h2>
              <div className="text-gray-300 mb-4">
                <p>{truncateContent(post.content)}</p>
                {post.content.length > maxPreviewLength && (
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-green-400 hover:text-green-300 mt-2 font-medium transition-colors flex items-center"
                  >
                    Read More
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-emerald-800/40 text-emerald-300 rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                  {post.tags.length > 3 && (
                    <span className="px-2 py-1 bg-emerald-800/40 text-emerald-300 rounded-full text-xs">
                      +{post.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>
                    {post.createdAt?.toDate().toLocaleDateString() || 'Just now'}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 ${
                      post.isLiked ? 'text-red-400' : 'text-gray-400'
                    } hover:text-red-400 transition-colors duration-200`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes || 0}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Empty State */}
      {(searchQuery || selectedCategory !== 'all' ? filteredPosts : posts).length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 max-w-md mx-auto"
        >
          <Leaf className="w-16 h-16 text-green-400/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Stories Found</h3>
          <p className="text-gray-300">
            {searchQuery 
              ? `No stories matching "${searchQuery}"`
              : 'Be the first to share an eco story!'}
          </p>
          {user && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
            >
              Create a New Story
            </button>
          )}
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Full Post Modal */}
      {selectedPost && (
        <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
};

export default Blog;