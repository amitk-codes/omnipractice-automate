import { NavLink } from 'react-router-dom'

function Navigation() {
  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div className="nav-logo">
          Omnipractice Automation
        </div>
        <div className="nav-links">
          <NavLink 
            to="/clients" 
            className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Client Automation
          </NavLink>
          <NavLink 
            to="/appointments" 
            className={({ isActive }) => 
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Appointment Automation
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navigation 