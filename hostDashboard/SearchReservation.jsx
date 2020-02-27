import React, { Component } from "react";
import { InputGroup, InputGroupAddon, Input, Button } from "reactstrap";
import PropTypes from "prop-types";
import * as reservationService from "../../services/reservationService";
import { toast } from "react-toastify";
import logger from "sabio-debug";
import { withRouter } from "react-router-dom";

const _logger = logger.extend("SearchReservation");

class SearchReservation extends Component {
	state = {
		searchTerm: ""
	};

	handleChange = e => {
		let name = e.target.name;
		let value = e.target.value;

		this.setState(() => {
			return { [name]: value };
		});
	};

	handleClick = e => {
		e.preventDefault();
		this.searchProfiles(this.state.searchTerm);
	};

	handleKeyPress = e => {
		if (e.key === "Enter") {
			this.searchProfiles(this.state.searchTerm);
		}
	};

	clearSearchResults = e => {
		e.preventDefault();
		this.setState(() => {
			let searchTerm = "";
			return { searchTerm };
		});
		this.props.clearSearch();
	};

	searchProfiles = searchTerm => {
		reservationService
			.searchReservation(0, this.props.resPerPage, searchTerm)
			.then(this.onGetAllForSearchSuccess)
			.catch(this.onGetAllForSearchError);
	};

	onGetAllForSearchSuccess = response => {
		let { item } = response.data;
		this.props.setUpForSearch(item, this.state.searchTerm);
	};

	onGetAllForSearchError = err => {
		if (err.response.status === 404) {
			toast("Search returned 0 results.");
		} else {
			_logger(err.response);
			toast("Something went wrong! Please try again.");
		}
	};

	render() {
		return (
			<div>
				<InputGroup>
					<InputGroupAddon addonType="prepend">
						<Button onClick={this.handleClick}>
							<i className="pe-7s-search btn-icon-wrapper" />
						</Button>
					</InputGroupAddon>
					<Input
						name="searchTerm"
						value={this.state.searchTerm}
						placeholder="Search..."
						onChange={this.handleChange}
						onKeyPress={this.handleKeyPress}
					/>
					<InputGroupAddon
						className={this.props.isSearching ? "" : "d-none"}
						addonType="append"
					>
						<Button onClick={this.clearSearchResults}>Clear Search</Button>
					</InputGroupAddon>
				</InputGroup>
			</div>
		);
	}
}

SearchReservation.propTypes = {
	resPerPage: PropTypes.number.isRequired,
	setUpForSearch: PropTypes.func.isRequired,
	isSearching: PropTypes.bool.isRequired,
	clearSearch: PropTypes.func.isRequired
};

export default withRouter(SearchReservation);
