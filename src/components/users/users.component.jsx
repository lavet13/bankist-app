import { Fragment } from 'react';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';

const Users = ({ users }) => {
  return (
    <Fragment>
      {users?.map(user => (
        <Button buttonType={BUTTON_TYPE_CLASSES.arrowSubmit} key={user.id}>
          {`${user.displayName}(${user.email})`}
        </Button>
      ))}
    </Fragment>
  );
};

export default Users;
