import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Row, Container, Card, Nav, NavLink } from "reactstrap";
import styles from "./hostDash.module.css";
import SingleRes from "./SingleRes";
import SearchReservation from "./SearchReservation";
import * as reservationService from "../../services/reservationService";
import Pagination from "react-js-pagination";
import Footer from "../footer/Footer";
import logger from "debug";
import swal from "sweetalert2";
import ReviewsToSend from "../reviews/ReviewsToSend";

const _logger = logger.extend("HostDash");

class HostDashboard extends Component {
  state = {
    SingleRes: [
      {
        id: "",
        dateCheckIn: "",
        dateCheckOut: "",
        listingId: "",
        chargeId: "",
        statusId: "",
        userId: "",
        title: "",
        images: ""
      }
    ],
    hostRes: [],
    mappedHostRes: [],
    reservations: [],
    activePage: 1,
    numResPerPage: 6,
    totalNumRes: 0,
    numDisplayedPages: 6,
    isSearching: false,
    fromSearch: "",
    reservationError: false,
    displayReviewsToSend: false
  };

  componentDidMount() {
    this.onGetHostRes(0, 6);
  }

  onGetHostRes = (pageIndex, pageSize) => {
    reservationService
      .getHostRes(pageIndex, pageSize, this.props.currentUser.id)
      .then(this.onGetHostResSuccess)
      .catch(this.onGetHostResError);
  };

  onGetHostResSuccess = response => {
    _logger(response);
    let { item } = response.data;

    this.setState(() => {
      let mappedHostRes = item.pagedItems.map(this.mappedHostResCard);
      let totalNumRes = item.totalCount;
      let isSearching = false;

      return {
        totalNumRes,
        isSearching,
        mappedHostRes
      };
    });
  };

  onGetHostResError = () => {
    const Toast = swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      onOpen: toast => {
        toast.addEventListener("mouseenter", swal.stopTimer);
        toast.addEventListener("mouseleave", swal.resumeTimer);
      }
    });

    Toast.fire({
      icon: "question",
      title: "No reservations for your listings"
    });
  };

  handlePageChange = pageNumber => {
    this.setState(() => {
      let activePage = pageNumber;

      return { activePage };
    });

    let { numResPerPage } = this.state;

    if (!this.state.isSearching) {
      this.onGetHostRes(pageNumber - 1, numResPerPage);
    } else {
      reservationService
        .searchReservation(pageNumber - 1, numResPerPage, this.state.fromSearch)
        .then(this.onSearchResSuccess)
        .catch(this.onSearchResError);
    }
  };

  onSearchResSuccess = response => {
    _logger("search Success", response);
    let { pagedItems } = response.data.item;

    this.setState(() => {
      let mappedHostRes = pagedItems.map(this.mappedHostResCard);
      return { mappedHostRes };
    });
  };

  onSearchResError = error => {
    _logger(error);
  };

  setUpForSearch = (responseObj, searchTerm) => {
    this.setState(() => {
      let mappedHostRes = responseObj.pagedItems.map(this.mappedHostResCard);
      let activePage = 1;
      let totalNumRes = responseObj.totalCount;
      let isSearching = true;
      let fromSearch = searchTerm;

      return {
        mappedHostRes,
        activePage,
        totalNumRes,
        isSearching,
        fromSearch
      };
    });
  };

  clearSearch = () => {
    this.setState(() => {
      let activePage = 1;
      let fromSearch = "";

      return { activePage, fromSearch };
    });
    this.onGetHostRes(0, this.state.numResPerPage);
  };

  mappedHostResCard = hostRes => {
    return <SingleRes hostRes={hostRes} key={hostRes.id} />;
  };

  handleReviewClick = e => {
    e.preventDefault();
    this.setState(() => {
      return { displayReviewsToSend: true };
    });
  };

  handleUpcomingClick = e => {
    e.preventDefault();
    this.setState(() => {
      return { displayReviewsToSend: false };
    });
  };

  render() {
    return (
      <Fragment>
        <div className="app-page-title">
          <div className="page-title-wrapper d-flex">
            <div className="page-title-heading">
              <div>
                <h3>Host Dashboard</h3>
                <Nav className="page-title-subheading">
                  {/* <NavLink href="/profiles/host/current">
                    Update Profile
                  </NavLink> */}
                  <NavLink href="/mylistings">My Listings</NavLink>
                  <NavLink href="/listings/new">Create New Listing</NavLink>
                  {!this.state.displayReviewsToSend ? (
                    <NavLink
                      onClick={this.handleReviewClick}
                      className="text-primary"
                    >
                      Ask For Reviews
                    </NavLink>
                  ) : (
                      <NavLink
                        onClick={this.handleUpcomingClick}
                        className="text-primary"
                      >
                        Upcoming Reservations
                    </NavLink>
                    )}
                </Nav>
              </div>
            </div>
            <div></div>
            <div className="ml-auto">
              <SearchReservation
                resPerPage={this.state.numResPerPage}
                setUpForSearch={this.setUpForSearch}
                isSearching={this.state.isSearching}
                clearSearch={this.clearSearch}
              />
            </div>
          </div>
        </div>

        {!this.state.displayReviewsToSend ? (
          <>
            <Container>
              <div className={styles.pmd_intro_bg_img}>
                <h3>Upcoming Reservations</h3>
                <Row>
                  <Card className={styles.cardContainer}>
                    {this.state.mappedHostRes}
                  </Card>
                </Row>
              </div>
            </Container>
            <br />
            <Row className="d-flex justify-content-center">
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.state.numResPerPage}
                totalItemsCount={this.state.totalNumRes}
                pageRangeDisplayed={this.state.numDisplayedPages}
                onChange={this.handlePageChange}
              />
            </Row>
          </>
        ) : (
            <ReviewsToSend hostUserId={this.props.currentUser.id} />
          )}

        <Row>
          <Footer />
        </Row>
      </Fragment>
    );
  }
}

HostDashboard.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired
  }).isRequired
};

export default withRouter(HostDashboard);
