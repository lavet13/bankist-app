import { useState } from 'react';

import { getUsers } from '../../utils/firebase/firebase.utils';

const UsersSearch = ({ setUsers }) => {
  const [searchField, setSearchField] = useState('');

  const handleChange = async e => {
    const { value } = e.target;
    setSearchField(value);
    setUsers(await getUsers(value));
  };

  return (
    <input
      type='search'
      name='search'
      value={searchField}
      onChange={handleChange}
    />
  );
};

export default UsersSearch;
