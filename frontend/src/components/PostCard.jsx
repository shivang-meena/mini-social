import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

const timeAgo = (date) => {//this is time  converter from
//   mongodb default time to calcualte how many time ago it was posted 
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export default function PostCard({ post, onUpdate }) {
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [liking, setLiking] = useState(false)

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?'

  const isLiked = post.likes?.some(l => l.userId === user?.id)

  const handleLike = async () => {
    if (liking) return
    setLiking(true)
    try {
      const { data } = await API.post(`/posts/${post._id}/like`)
      onUpdate(post._id, { likes: data.likes })
    } catch (err) {
      console.error(err)
    } finally {
      setLiking(false)
    }
  }

  const handleComment = async () => {
    if (!commentText.trim() || submitting) return
    setSubmitting(true)
    try {
      const { data } = await API.post(`/posts/${post._id}/comment`, { text: commentText.trim() })
      onUpdate(post._id, { comments: data.comments })
      setCommentText('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-header">
        <div className="avatar-circle">{getInitial(post.author?.name)}</div>
        <div>
          <p className="post-author-name">{post.author?.name}</p>
          <p className="post-author-username">@{post.author?.username}</p>
        </div>
        <span className="post-time">{timeAgo(post.createdAt)}</span>
      </div>

      {/* Content */}
      {post.text && <p className="post-text">{post.text}</p>}
      {post.imageUrl && (
        <img src={post.imageUrl} alt="post" className="post-image" />
      )}

      <hr className="post-divider" />

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={liking}
        >
          {isLiked ? '❤️' : '🤍'} {post.likes?.length || 0}
        </button>
        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {post.comments?.length || 0}
        </button>
      </div>

      {/*  Comments */} 
      {showComments && (
        <div className="comments-section">
          {post.comments?.length === 0 && (
            <p style={{ color: '#aaa', fontSize: '0.85rem', textAlign: 'center', padding: '10px 0' }}>
              No comments yet. Be the first!
            </p>
          )}

          {post.comments?.map((c, i) => (
            <div className="comment-item" key={i}>
              <div className="avatar-circle avatar-circle-sm">{getInitial(c.name)}</div>
              <div className="comment-bubble">
                <div className="comment-username">@{c.username}</div>
                <div className="comment-text">{c.text}</div>
              </div>
            </div>
          ))}

          <div className="comment-input-wrap">
            <div className="avatar-circle avatar-circle-sm">{getInitial(user?.name)}</div>
            <input
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleComment()}
            />
            <button
              className="btn-send-comment"
              onClick={handleComment}
              disabled={!commentText.trim() || submitting}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  )
}