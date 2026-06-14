import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

// this componet is mainly for posting new post in the feed in this have that part taht is show into 
// while we create new post like text input and image input and then post button 
export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?'
 
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }
   
  const removeImage = () => {
    setImage(null)
    setPreview('')
  }

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      setError('Add text or image to post')
      return
    }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      if (text.trim()) formData.append('text', text.trim())
      if (image) formData.append('image', image)

      const { data } = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })// 
      onPostCreated(data)
      setText('')
      setImage(null)
      setPreview('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <div className="avatar-circle">{getInitial(user?.name)}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name}</div>
          <div style={{ fontSize: '0.8rem', color: '#888' }}>@{user?.username}</div>
        </div>
      </div>

      <textarea
        className="create-post-textarea"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => { setText(e.target.value); setError('') }}
        rows={3}
      />

      {preview && (
        <div className="image-preview-wrap">
          <img src={preview} alt="preview" />
          <button className="remove-img-btn" onClick={removeImage}>✕</button>
        </div>
      )}

      {error && (
        <div style={{ color: '#e53935', fontSize: '0.83rem', marginTop: '8px' }}>{error}</div>
      )}

      <div className="create-post-actions">
        <label className="btn-image-upload">
          📷 Photo
          <input type="file" accept="image/*" hidden onChange={handleImageChange} />
        </label>
        <button
          className="btn-post"
          onClick={handleSubmit}
          disabled={loading || (!text.trim() && !image)}
        >
          {loading ? 'Posting...' : '➤ Post'}
        </button>
      </div>
    </div>
  )
}