import React from 'react';
import { Link } from 'react-router-dom';

const AdminButton = () => {
  return (
    <Link to="/admin">
      <button>Admin</button>
    </Link>
  );
};

export default AdminButton;
