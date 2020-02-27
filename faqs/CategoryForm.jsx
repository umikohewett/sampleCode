import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import logger from "debug";
import PropTypes from "prop-types";
import { Formik, FastField, Form } from "formik";
import * as validationSchema from "./catFormValidationSchema";
import * as faqService from "../../services/faqService";
import swal from "sweetalert";
import styles from "./faqs.module.css";
import { Card } from "reactstrap";

const _logger = logger.extend("CategoryForm");

class CategoryForm extends Component {
  state = {
    id: this.props.catCol.id || 0,
    name: this.props.catCol.name || "",
    categories: []
  };

  componentDidMount() {
    this.getCategories();
  }
  getCategories = () => {
    faqService
      .getCategories()
      .then(this.onGetCatsSuccess)
      .catch(this.onGetCatsErrors);
  };

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

  handleSubmit = values => {
    _logger(values);

    if (this.props.catCol.id) {
      _logger(this.props.catCol.id);

      let valuesUpdate = this.state;

      let data = {
        id: valuesUpdate.id,
        name: values.name
      };

      faqService
        .updateCat(this.props.catCol.id, data)
        .then(this.onUpdateCatSuccess)
        .catch(this.onUpdateCatError);
    } else {
      let data = {
        name: values.name
      };
      faqService
        .newCat(data)
        .then(this.onAddCatSuccess)
        .catch(this.onAddCatError);
    }
  };

  onAddCatSuccess = () => {
    _logger("success");
    swal({
      title: "Category Added!",
      text: "Your Category has been Added",
      icon: "success"
    });
    this.props.refreshFAQsPage(0, 500);
  };

  onAddCatError = response => {
    _logger(response);
    swal({
      title: "Add Category Failed",
      text: "Please try again.",
      icon: "error"
    });
  };

  onUpdateCatSuccess = () => {
    _logger("refresh");
    swal({
      title: "Category has been Updated!",
      text: "Your Category has been Added",
      icon: "success"
    });
    this.props.history.push("/faqs");
    this.props.refreshFAQsPage(0, 500);
  };

  onUpdateCatError = response => {
    _logger(response);
    swal({
      title: "Category Update Failed",
      text: "Please try again.",
      icon: "error"
    });
  };

  render() {
    return (
      <Formik
        initialValues={this.state}
        validationSchema={validationSchema.catFormValidationSchema}
        onSubmit={this.handleSubmit}
      >
        {props => {
          const { values, errors, touched, handleChange, handleSubmit } = props;
          return (
            <Form onSubmit={handleSubmit}>
              <Card className={styles.form}>
                <div className="card-body">
                  <div id="heading" className="card-header">
                    <h3 className="form-heading">Category Form</h3>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="faqCategory">
                    Select A Category To Update:
                  </label>
                  <select
                    name="faqCategory"
                    type="select"
                    id="faqCategory"
                    placeholder="Select Category Name"
                    onChange={handleChange}
                    values={values.faqCategory}
                    style={{ display: "block" }}
                  >
                    <option value="0">Please Select</option>
                    {this.state.categories.map(faqCategory => (
                      <option key={faqCategory.id} value={faqCategory.id}>
                        {faqCategory.name}
                      </option>
                    ))}
                  </select>

                  {errors.faqCategory && touched.faqCategory && (
                    <span className="text-danger">{errors.faqCategory}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="Name">Name of New Category:</label>
                  <FastField
                    name="name"
                    id="name"
                    type="text"
                    placeholder="Enter Category Name"
                    className="form-control"
                    onChange={handleChange}
                    values={values.name}
                  />
                  {errors.name && touched.name && (
                    <span className="text-danger">{errors.name}</span>
                  )}
                </div>
                <br />
                <div className="form-group ">
                  <div>
                    <button type="submit" className={styles.submitBtn}>
                      Submit
                    </button>{" "}
                    <button
                      className={styles.cnclBtn}
                      type="submit"
                      onClick={this.onCancelFAQ}
                    >
                      Cancel Entry
                    </button>{" "}
                    <br />
                    <br />
                    <p>
                      *If you would like to update a category, please select the
                      category to be updated from the drop-down list and then
                      enter the new name. If you would like to make a new
                      category, enter the name in the Name field only.
                    </p>
                  </div>
                </div>
              </Card>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

CategoryForm.propTypes = {
  catCol: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
    cat: PropTypes.shape({
      state: PropTypes.object
    })
  }),
  onCancel: PropTypes.func.isRequired,
  refreshFAQsPage: PropTypes.func
};
export default withRouter(CategoryForm);
