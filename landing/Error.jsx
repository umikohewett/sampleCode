import React from 'react';
import PropTypes from "prop-types";
import Footer from "../footer/Footer";
import { Card, Col, Row } from "reactstrap";

const Error = (props) => {
    const goBack = e => {
        e.preventDefault();
        props.history.push("/login");
    }

    return (
        <>
        <Card onClick={goBack} >
            <hr />
            <Row className="col-sm-12 py-5">
                <Col className="col-sm-6" >
                    <img
                        className="pull-right"
                        src="https://sabio-training.s3-us-west-2.amazonaws.com/HostAHero/641d3e7d-4ff8-4262-8d62-fb418c712290/Annotation%202020-02-03%20121514.png"
                        alt="soldier standing there telling you the page does not exist"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "150px"
                        }} />
                </Col>
                <Col className="col-sm-6 mt-5"
                    style={{
                        color: "rgb(85, 107, 47)",
                        minwidth: "180px"
                    }}>
                    <p> That link didn&apos;t work. <br /> Click to log in. </p>
                </Col>
            </Row>
            <hr />
            
        </Card>
        <div className="footer" style={{ position: "fixed", left: "0", bottom: "0", width: "100%"}}>
            <Footer/>
        </div>
        
        </>
    );
}

Error.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func
    })
};

export default Error;