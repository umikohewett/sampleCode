import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Card } from "reactstrap";
import styles from "./hostDash.module.css";

class SingleRes extends Component {
  render() {
    const startDate = new Date(this.props.hostRes.dateCheckIn);
    const endDate = new Date(this.props.hostRes.dateCheckOut);
    const dateOptions = {
      month: "long",
      day: "numeric",
      year: "numeric"
    };

    return (
      <Fragment>
        <div className={styles.outerCard}>
          <Card>
            <div className={styles.resCard}>
              <img
                className={styles.image}
                // This src was set to an array but no array was recieved
                // changed to fileUrl as that is what is passed in props as a link to an image
                src={this.props.hostRes.images[0].fileUrl}
                alt="https://images.pexels.com/photos/1648373/pexels-photo-1648373.jpeg?cs=srgb&dl=white-reserved-sign-on-brown-wooden-table-1648373.jpg&fm=jpg"
              />

              <div className="card-body">
                <h2 className="card-title">{this.props.hostRes.title}</h2>
                <p className="card-text">
                  {startDate.toLocaleDateString("en-US", dateOptions)}
                </p>
                <p className="card-text">
                  {endDate.toLocaleDateString("en-US", dateOptions)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Fragment>
    );
  }
}

SingleRes.propTypes = {
  hostRes: PropTypes.shape({
    id: PropTypes.number,
    dateCheckIn: PropTypes.string,
    dateCheckOut: PropTypes.string,
    listingId: PropTypes.number,
    chargeId: PropTypes.string,
    statusId: PropTypes.number,
    userId: PropTypes.number,
    title: PropTypes.string,
    images: PropTypes.array,
    fileUrl: PropTypes.string
  }).isRequired,

  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(SingleRes);
