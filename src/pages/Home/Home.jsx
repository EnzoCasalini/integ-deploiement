import { useState, useRef } from 'react';
import RegistrationForm from "./components/RegistrationForm.jsx";
import UsersList from "./components/UsersList.jsx";
import './Home.css';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const usersListRef = useRef(null);

  const scrollToUsersList = () => {
    usersListRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleUserRegistered = (newUser) => {
    // Ajouter le nouvel utilisateur à la liste
    setUsers(prevUsers => [...prevUsers, newUser]);
  };

  const handleUsersUpdate = (updatedUsers) => {
    setUsers(updatedUsers);
  };

  const handleAdminStateChange = (adminState) => {
    setIsAdmin(adminState);
  };

  return (
    <div className="home-container">
      <div className="registration-section">
        <RegistrationForm onUserRegistered={handleUserRegistered} />
        <button 
          className="see-hunters-btn"
          onClick={scrollToUsersList}
        >
          See who's already joined the hunt
        </button>
      </div>
      
      <div className="users-section" ref={usersListRef}>
        <UsersList 
          users={users}
          onUsersUpdate={handleUsersUpdate}
          onAdminStateChange={handleAdminStateChange}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

export default Home;
