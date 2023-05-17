import moment from 'moment';

import {
  LoanImage,
  LoanImageContainer,
  LoanItemContainer,
  AllowedIcon,
  DeniedIcon,
  IconContainer,
  Background,
} from './loan-item.styles';

const LoanItem = ({ loan }) => {
  const {
    id,
    creditCard,
    displayName,
    email,
    images,
    isAllowed,
    tel,
    timestamp,
  } = loan;

  return (
    <Background>
      <LoanItemContainer>
        <p style={{ marginBottom: '20px' }}>
          <b>Дата оформления кредита </b>
          {moment(timestamp.toDate()).calendar().toLowerCase()}
        </p>
        <p>
          <b>Имя кредитора:</b> {displayName}
        </p>
        <p>
          <b>Кредитная карта:</b> {creditCard}
        </p>
        <p>
          <b>E-mail:</b> {email}
        </p>
        <p>
          <b>Номер телефона:</b> {tel}
        </p>
        <p>
          <b>Документы:</b>
        </p>
        <LoanImageContainer>
          {images.map((imageSrc, idx) => (
            <LoanImage key={idx} src={imageSrc} alt='' />
          ))}
        </LoanImageContainer>
        {isAllowed ? (
          <IconContainer>
            Кредит одобрен <AllowedIcon />
          </IconContainer>
        ) : (
          <IconContainer>
            Кредит не одобрен
            <DeniedIcon />
          </IconContainer>
        )}
      </LoanItemContainer>
    </Background>
  );
};

export default LoanItem;
