import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import API from '../api/axios'
//this is feed where all posts are appear after fetching i have aslo added pagination for feed  in this at a
//so like if we have total 25 page so 25/10 its ceil value is 3 so it first show only three post and button appear 
//load more so next 3 post appear after load more so repeart this untill 25 post reached then it will stop 
//to show button load more 
export default function Feed() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchPosts = useCallback(async (pageNum = 1, append = false) => {
    try {
      const { data } = await API.get(`/posts?page=${pageNum}&limit=10`)
      if (append) {
        setPosts(prev => [...prev, ...data.posts])
      } else {
        setPosts(data.posts)
      }
      setTotalPages(data.totalPages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts(1)
  }, [fetchPosts])

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
  }

  const handlePostUpdate = (postId, updatedFields) => {
    setPosts(prev =>
      prev.map(p => p._id === postId ? { ...p, ...updatedFields } : p)
    )
  }

  const handleLoadMore = async () => {
    const nextPage = page + 1
    setLoadingMore(true)
    setPage(nextPage)
    await fetchPosts(nextPage, true)
  }

  return (
    <>
      <Navbar />
      <div className="feed-wrapper">
        <CreatePost onPostCreated={handlePostCreated} />

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <h5>No posts yet</h5>
            <p>Be the first to post something!</p>
          </div>
        ) : (
          <>
            {posts.map(post => (
              <PostCard
                key={post._id}
                post={post}
                onUpdate={handlePostUpdate}
              />
            ))}

            {page < totalPages && (
              <button
                className="load-more-btn"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Loading...' : 'Load More Posts'}
              </button>
            )}
          </>
        )}
      </div>
    </>
  )
}