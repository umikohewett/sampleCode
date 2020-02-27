import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import logger from "sabio-debug";
import PropTypes from "prop-types";
import { Formik, Field, Form } from "formik";
import * as validationSchema from "./faqsFormValidationSchema";
import * as faqService from "../../services/faqService";
import swal from "sweetalert";
import styles from "./faqs.module.css"
import { Card } from "reactstrap";


const _logger = logger.extend("FAQsForm");

class FAQsForm extends Component {


	state =
		{
			id: this.props.faq.id || 0,
			question: this.props.faq.question || "",
			answer: this.props.faq.answer || "",
			faqCategory: this.props.faq.faqCategory || 0,
			sortOrder: this.props.faq.sortOrder || "",
			categories: [],
		}

	componentDidMount() {
		this.getCategories();
	}

	getCategories = () => {
		faqService.getCategories()
			.then(this.onGetCatsSuccess)
			.catch(this.onGetCatsErrors)
	}

	onGetCatsSuccess = response => {
		let cats = response.item;
		this.setState(prevState => {
			return {
				...prevState,
				categories: cats
			};
		});
	};

	onGetCatsError = () => {
		this.setState(prevState => {
			return { ...prevState, mappedCategories: [] };
		});
	};

	onCancelFAQ = e => {
		e.preventDefault();
		this.props.onCancel();

	};

	handleSubmit = (values) => {
		_logger(values);

		if (this.props.faq.id) {
			_logger(this.props.faq.id)
			let valuesUpdate = this.state;

			let data = {
				id: valuesUpdate.id,
				question: values.question,
				answer: values.answer,
				faqCategory: values.faqCategory,
				sortOrder: values.sortOrder,
			};

			faqService
				.updateFAQ(this.props.faq.id, data)
				.then(this.onUpdateFAQSuccess)
				.catch(this.onUpdateFAQError);
		}
		else {
			let data = {

				question: values.question,
				answer: values.answer,
				faqCategory: values.faqCategory,
				sortOrder: values.sortOrder,

			};
			faqService
				.newFAQ(data)
				.then(this.onAddFAQSuccess)
				.catch(this.onAddFAQError);
		}
	};

	onAddFAQSuccess = () => {
		_logger("success");
		swal({
			title: "FAQ Added!",
			text: "Your FAQ has been Added",
			icon: "success"
		});
		this.props.history.push("/faqs");
		this.props.refreshFAQsPage(0, 10);
	};

	onAddFAQError = response => {
		_logger(response);
		swal({
			title: "Add FAQ Failed",
			text: "Please try again.",
			icon: "error"
		});
	};

	onUpdateFAQSuccess = () => {
		_logger("refresh");
		swal({
			title: "FAQ has been Updated!",
			text: "Your FAQ has been Added",
			icon: "success"
		});
		this.props.history.push("/faqs");
		this.props.refreshFAQsPage(0, 100);
	};

	onUpdateFAQError = response => {
		_logger(response);
		swal({
			title: "FAQ Update Failed",
			text: "Please try again.",
			icon: "error"
		});
	};

	render() {
		return (

			<Formik
				enableReinitialize={true}
				initialValues={this.state}
				validationSchema={validationSchema.faqsFormValidationSchema}
				onSubmit={this.handleSubmit}>

				{props => {
					const { values, errors, touched, handleSubmit, handleChange

					} = props;
					return (
						<Form onSubmit={handleSubmit}>
							<Card className={styles.form}>
								<div className="card-body">
									<div id="heading" className="card-header">
										<h3 className="form-heading">
											Submit Your Question
											<p>Enter your Question below</p>
										</h3>
									</div>
								</div>

								<div>
									<label htmlFor="question" >
										Question:
										</label>
									<Field
										name="question"
										id="question"
										type="text"
										placeholder="Enter Question"
										className="form-control"
										onChange={handleChange}
										values={values.question}
									/>
									{errors.question && touched.question && (
										<span className="text-danger">{errors.question}</span>)}
								</div>

								<div className="form-group ">
									<label htmlFor="answer" >
										Answer:
										</label>
									<Field
										name="answer"
										id="answer"
										type="text"
										placeholder="Enter Answer"
										className="form-control"
										onChange={handleChange}
										values={values.answer}
									/>
									{errors.answer && touched.answer && (
										<span className="text-danger">{errors.answer}</span>)}
								</div>

								<div className="form-group">
									<label htmlFor="faqCategory">
										Category Name:
									</label>
									<select
										name="faqCategory"
										type="select"
										id="faqCategory"
										placeholder="Select Category Name"
										onChange={handleChange}
										values={values.faqCategory}
										style={{ display: 'block' }}>

										<option value="0" >Please Select</option>
										{this.state.categories.map(faqCategory => (
											<option key={faqCategory.id} value={faqCategory.id}>{faqCategory.name}</option>))}

									</select>

									{errors.faqCategory && touched.faqCategory && (
										<span className="text-danger">{errors.faqCategory}</span>)}
								</div>


								<div className="form-group ">
									<label htmlFor="sortOrder" >
										Sort Order Number
										</label>
									<Field
										name="sortOrder"
										id="sortOrder"
										type="text"
										placeholder="Enter Sort Order Number"
										className="form-control"
										onChange={handleChange}
										values={values.sortOrder}
									/>
									{errors.sortOrder && touched.sortOrder && (
										<span className="text-danger">{errors.sortOrder}</span>)}
								</div>

								<div className="form-group ">
									<div >
										<button
											type="submit"
											className={styles.submitBtn}
										>
											Submit
											</button>{' '}

										<button
											className={styles.cnclBtn}
											type="submit"
											onClick={this.onCancelFAQ}
										>
											Cancel Entry
											</button>{' '}
									</div>
								</div>
							</Card>
						</Form>
					)
				}
				}
			</Formik >
		)
	}
}

FAQsForm.propTypes = {
	faq: PropTypes.shape({
		id: PropTypes.number,
		question: PropTypes.string,
		answer: PropTypes.string,
		faqCategory: PropTypes.shape({
			id: PropTypes.number,
			name: PropTypes.string,
		}),
		sortOrder: PropTypes.number,
		faq: PropTypes.objectOf(PropTypes.string),

	}),
	history: PropTypes.shape({
		push: PropTypes.func,
		faq: PropTypes.shape({
			state: PropTypes.object
		})
	}),
	onCancel: PropTypes.func.isRequired,
	refreshFAQsPage: PropTypes.func,
}

export default withRouter(FAQsForm);