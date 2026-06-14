import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '?'

  return (
    <nav className="navbar-custom">
      <div className="container d-flex align-items-center justify-content-between">
        <span className="navbar-brand-text">🌐 SocialApp</span>
        {user && (
          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <div className="avatar-circle avatar-circle-sm">
                {getInitial(user.name)}
              </div>
              <span className="navbar-username d-none d-sm-inline">
                @{user.username}
              </span>
            </div>
            <button className="btn-logout btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}