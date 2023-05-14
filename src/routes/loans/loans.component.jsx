import { useDispatch, useSelector } from 'react-redux';

import { selectCurrentUser } from '../../store/user/user.selector';

import { fetchLoanStart } from '../../store/loan/loan.action';

import { Fragment, useEffect } from 'react';
import { selectLoanArray } from '../../store/loan/loan.selector';

const Loans = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const loanArray = useSelector(selectLoanArray);

  useEffect(() => {
    if (currentUser) dispatch(fetchLoanStart(currentUser));
  }, [currentUser]);
  console.log(loanArray);

  return (
    <Fragment>
      {loanArray.flatMap(loan => {
        return Object.keys(loan).map(id => {
          const images = loan[id];
          console.log(images);

          return (
            <div>
              <p>{id}</p>
              {images.map(imageSrc => (
                <img src={imageSrc} alt='' />
              ))}
            </div>
          );
        });
      })}
    </Fragment>
  );
};

export default Loans;
