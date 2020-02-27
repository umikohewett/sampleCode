import React, { useState } from "react";
import PropTypes from "prop-types";
import { Collapse } from "reactstrap";

const SingleFAQ = props => {
	const [isOpen, setIsOpen] = useState(true);
	const toggle = () => setIsOpen(!isOpen);

	const editFaq = () => {
		props.handleEditFaq(props.faq);
	};

	const deleteFaq = () => {
		props.handleDeleteFaq(props.faq.id);
	};

	return (
		<React.Fragment>
			<div >
				<div className="card-text-faq">
					<div onClick={toggle}>
						<hr />
						<em className="em">Question:</em>
						<div>{props.faq.question}</div>
					</div>
					<br />
				</div>
				<Collapse isOpen={isOpen}>
					<div className="card-text-faq">
						<em className="em">Answer:</em>
						<div>{props.faq.answer}</div>
					</div>
				</Collapse>
				<br />
				{props.currentUser.roles.includes("Administrator") ?
					<div>
						<button
							className="pe-7s-note2"
							onClick={editFaq}
						> Edit
				</button>

						<button
							className="pe-7s-trash"
							onClick={deleteFaq}
						>Delete
				</button>
					</div>
					: null}

			</div>
		</React.Fragment>
	);
};



SingleFAQ.propTypes = {
	faq: PropTypes.shape({
		id: PropTypes.number.isRequired,
		question: PropTypes.string.isRequired,
		answer: PropTypes.string.isRequired
	}),
	handleEditFaq: PropTypes.func,
	handleDeleteFaq: PropTypes.func,
	refreshFAQsPage: PropTypes.func,
	currentUser: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		roles: PropTypes.array,
		veteranStatus: PropTypes.string
	})
};

export default SingleFAQ;
