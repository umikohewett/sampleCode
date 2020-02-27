import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import styles from "./landing.module.css";
import { Card, CardLink } from "reactstrap";
import Footer from "../footer/Footer";
import PropTypes from "prop-types";



class Landing extends Component {
  componentDidMount() {
    return null;
  }
  render() {
    return (
      <Fragment>
        {this.props.currentUser.roles.includes("Anonymous")
          ? null
          : this.props.history.push("/user/dashboard")}
        <div className={styles.container}>
          <div className="container">
            <div className="row py-5">
              <div className="col text-center ">
                <div
                  className="rounded-lg"
                  style={
                    window.innerWidth < 1222
                      ? { backgroundColor: "rgba(255,255,255)" }
                      : { backgroundColor: "rgba(255,255,255, 0.3)" }
                  }
                >
                  <p className="lead py-5">
                    <b>
                      The mission of Tent Hut is to Rebuild, Restructure and
                      Reinforce by keeping veterans moving in a positive
                      direction
                      <br />
                      by establishing a strong foundation and placing homeless
                      veterans in homes that we have built through strategic
                      partnerships
                    </b>
                  </p>
                </div>

                <a
                  href="/login"
                  className="btn btn-light pmd-ripple-effect btn-lg pmd-btn-raised"
                >
                  <b> Lead the Way</b>
                </a>
                <div className="row py-5">
                  <div className="col m-2">
                    <Card className={styles.memberCard}>
                      <div className="card pmd-card">
                        <div className="media pmd-card-media d-block d-md-flex">
                          <div className="media-body">
                            <div className="card-body">
                              <h2 className="card-title">Members</h2>
                              <p className="card-text">
                                Looking to become a Member? Host A Hero has made
                                it easy to go through the verifcation of your
                                military status. Working with ID.Me we will cut
                                the hassel of needing addintional forms and
                                checks.
                              </p>
                              <CardLink href="/register">
                                <b>Become a Member</b>
                              </CardLink>
                            </div>
                          </div>
                          <img
                            className="ml-3 d-none d-md-block"
                            src="https://images.unsplash.com/photo-1464660756002-dd9f9a92b01b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1334&q=80"
                            alt=""
                            width="240"
                            height="280"
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="col m-2">
                    {" "}
                    <Card className={styles.hostCard}>
                      <div className="card pmd-card">
                        <div className="media pmd-card-media d-block d-md-flex">
                          <img
                            src="https://images.unsplash.com/photo-1521732292260-b73d63a37f5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60/"
                            alt=""
                            width="240"
                            height="280"
                            className="d-none d-md-block"
                          />
                          <div className="media-body">
                            <div className="card-body">
                              <h3 className="card-title">Hosting</h3>
                              <p className="card-text">
                                Do you have a home that you are interested in
                                sharing your home with a soldier or veteran?
                                Consider becoming a Host with Host A Hero.
                                Members are verified through ID me and you get
                                to choose who stays in your home.{" "}
                              </p>
                              <CardLink href="/register">
                                <b>Become A Host</b>
                              </CardLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </Fragment>
    );
  }
}

Landing.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  currentUser: PropTypes.shape({
    roles: PropTypes.array
  })
};

export default withRouter(Landing);
