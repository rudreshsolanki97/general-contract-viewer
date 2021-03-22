import { Col, Container, Row } from "react-bootstrap";
import GeneralModal from "../common/GeneralModal";

const BalanceModal = ({ data = [] }) => {
  const balances = data.map(({ name, balance }) => (
    <Col className="balance-item">
      <div className="balance-item__name">{name}</div>
      <div className="balance-item__value">{balance}</div>
    </Col>
  ));

  return (
    <GeneralModal
      centered="true"
      btnVariant="warning"
      btnName="My Wallet"
      disableSubmit={true}
      modalName="Medici Wallet"
      className="balance-modal"
    >
      <div>
        <Container>
          <Row>{balances}</Row>
        </Container>
      </div>
    </GeneralModal>
  );
};

export default BalanceModal;
