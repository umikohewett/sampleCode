import React, { useState } from "react";
import PropTypes from "prop-types";
import { Collapse, CardHeader, CardBody, Card } from "reactstrap";


const CatCard = props => {
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);

	const deleteCat = () => {
		props.handleDeleteCat(props.cat.id);
	};


	return (
		<div className="col-11">
			<Card className="pl-3 pr-3 pt-3">
				<div className="w-100">
					<CardHeader className="mb-0 d-flex justify-content-between w-100"
						onClick={toggle}>
						<h4>
							<i className=" pe-7s-angle-down-circle" />
							{props.cat.name}
						</h4>
						{props.currentUser.roles.includes("Administrator") ?
						<h4>
							<i className="pe-7s-trash" onClick={deleteCat} />
						</h4>
						: null}
					</CardHeader>
				</div>
				<div className="card-body">
					<Collapse isOpen={isOpen}>
						<Card>
							<CardBody>

								{props.cat.faqs}

							</CardBody>
						</Card>
					</Collapse>
				</div>
			</Card>
		</div>
	);
};

CatCard.propTypes = {
	cat: PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		faqs: PropTypes.arrayOf(PropTypes.element)
	}),
	handleDeleteCat: PropTypes.func,
	currentUser: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		roles: PropTypes.array,
		veteranStatus: PropTypes.string
	})
};

export default CatCard;
