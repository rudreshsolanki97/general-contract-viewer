import { Card, Container } from "react-bootstrap";

import { DynamicForm } from "./RenderCustomView";

const FunctionCard = ({ title, inputs }) => {
  
  return (
    <Card className="custom-card-2">
      <Card.Title>
        <div className="title">
          {title}
          <div className="title--bottom"></div>
        </div>
      </Card.Title>
      <Card.Body>
        <DynamicForm data={inputs} method={title} />
      </Card.Body>
    </Card>
  );
};

export default FunctionCard;
