import {React} from "react";

const TourPackage = () => {
    return (
        
            <div className="container mt-2">
     <div>
        <center className="mt-2">
        <h3> Tour Package</h3>
      </center>
      <Row className="justify-content-md-center">
      <Card className="totalCard">
      <div className="row propertyCard">
                      <Col xs lg="2">
                        <Card className="housedetails">
                        <span className="househeading">
                            Tour number: {tour.tourid}
                          </span>
                          <br></br>
                          <span className="househeading">
                            Tour name: {tour.tourname}
                          </span>
                          <br></br>
                          <span className="househeading">
                            Description: {tour.description}
                          </span>
                          <br />
                          <span className="househeading">
                            Stay duration: {tour.duration}
                          </span>
                          <br />
                          <span>Budget: CA$ {tour.price}</span>
                        </Card>
                        </Col>
                        <Col xs lg="2">
                        <Button
                          variant="success saveproperty"
                          onClick={() => handleTourClick(tour.tourid)} >
                          Book room
                        </Button>
                        </Col>
        </div>
      </Card>
      </Row>
     </div>
        </div>
    );
}

export default TourPackage;