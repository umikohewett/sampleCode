import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import FAQsForm from "./FAQsForm";
import CategoryForm from "./CategoryForm";
import logger from "sabio-debug";
import SingleFAQ from "./SingleFAQ";
import * as faqService from "../../services/faqService";
import styles from "./faqs.module.css";
import swal from "sweetalert";
import CategoryCard from "./CategoryCard";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Footer from "../footer/Footer";

const _logger = logger.extend("FAQs");

class FAQs extends Component {
  state = {
    SingleFAQ: [
      {
        id: "",
        question: "",
        answer: "",
        faqCategory: "",
        sortOrder: "",
        dateCreated: "",
        dateModified: "",
        createdBy: "",
        modifiedBy: ""
      }
    ],
    CategoryForm: [
      {
        id: "",
        name: ""
      }
    ],

    mappedFAQ: [],
    mapCategory: [],
    modalIsOpen: false,
    catModalIsOpen: false,
    categories: [],
    faqs: [],
    currentPage: 0,
    mappedCategories: [],
    mapFaqQuest: {},
    mapCatColumns: {}
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
    this.retrieveFAQs(0, 500);
  };
  onGetCatsError = () => {
    this.setState(prevState => {
      return { ...prevState, mappedCategories: [] };
    });
  };

  refreshFAQsPage = () => {
    this.retrieveFAQs(0, 500);
  };
  retrieveFAQs = (pageIndex, pageSize) => {
    faqService
      .getFAQsPage(pageIndex, pageSize)
      .then(this.onGetFAQsSuccess)
      .catch(this.onGetFAQsError);
  };

  onGetFAQsSuccess = response => {
    let faqs = response.data.item.pagedItems;
    let categories = [...this.state.categories];
    if (faqs && categories) {
      categories.forEach(currentCategory => {
        currentCategory.faqs = [];
        faqs.forEach(currentFaq => {
          if (currentCategory.id === currentFaq.faqCategory.id) {
            currentCategory.faqs.push(this.mappedFAQ(currentFaq));
          }
        });
      });

      this.setState(prevState => {
        return {
          ...prevState,
          mappedCategories: categories.map(this.mapCategory)
        };
      });
    }
  };

  onGetFAQError = response => {
    _logger(response);
    swal({
      title: "Could not Retrieve FAQs ",
      text: "Please try again.",
      icon: "error"
    });
  };

  toggleModal = faq => {
    this.setState(prevState => {
      return { modalIsOpen: !prevState.modalIsOpen, mapFaqQuest: faq };
    });
  };

  toggleCatModal = catCol => {
    this.setState(prevState => {
      return {
        catModalIsOpen: !prevState.catModalIsOpen,
        mapCatColumns: catCol
      };
    });
  };

  mappedFAQ = faq => (
    <SingleFAQ
      key={faq.id}
      faq={faq}
      handleEditFaq={this.toggleModal}
      handleDeleteFaq={this.onDeleteFAQ}
      refreshFAQsPage={this.refreshFAQsPage}
      currentUser={this.props.currentUser}
    />
  );

  mapCategory = cat => (
    <CategoryCard
      key={cat.id}
      cat={cat}
      editFaq={this.editFaq}
      handleEditCat={this.toggleCatModal}
      handleDeleteCat={this.onDeleteCat}
      refreshFAQsPage={this.refreshFAQsPage}
      currentUser={this.props.currentUser}
    />
  );

  mapCatColumns = catCol => (
    <CategoryForm
      key={catCol.id}
      faqCategory={catCol}
      handleDeleteCat={this.onDeleteCat}
      refreshFAQsPage={this.refreshFAQsPage}
      refreshCat={this.getCategories}
    />
  );

  onDeleteFAQ = faqId => {
    faqService
      .deleteFAQ(faqId)
      .then(this.onDeleteSuccess)
      .catch(this.onDeleteError);
  };

  onDeleteSuccess = () => {
    _logger("delete FAQ success");
    swal({
      title: "Delete Success",
      text: "FAQ has been Deleted",
      icon: "success"
    });
    this.refreshFAQsPage(0, 500);
  };

  onDeleteError = response => {
    _logger(response);
    swal({
      title: "Delete Error",
      text: "FAQ did not Delete.",
      icon: "error"
    });
  };

  onDeleteCat = catId => {
    Swal.fire({
      title: "Are your sure?",
      text:
        "* To delete a column, the column must be empty of Question Cards. Please make sure your column is empty before you proceed with your delete request.*",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33"
    }).then(value => {
      if (value.value) {
        this.setState(() => {
          faqService
            .deleteCat(catId)
            .then(this.onDeleteCatSuccess)
            .catch(this.onDeleteCatError);
        });
      } else {
        toast("Category was NOT deleted");
      }
    });
  };

  onDeleteCatSuccess = () => {
    _logger("delete Category success");
    swal({
      title: "Delete Success",
      text: "Category has been Deleted",
      icon: "success"
    });
    this.getCategories();
  };

  onDeleteCatError = response => {
    _logger(response);
    swal({
      title: "Delete Error",
      text:
        "Category did not Delete. There may be Questions still in the section. Please empty category before attempting to delete.",
      icon: "error"
    });
  };

  render() {
    return (
      <>
        <Row>
          <Col>
            <div className="app-inner-layout chat-layout">
              <div className={styles.faq_sticky_header}>
                <div className="app-inner-layout__header text-white bg-premium-dark">
                  <div className={styles.sticky_inner_wrapper}>
                    <div className="app-page-title">
                      <div className={styles.pagetTitleWrapper}>
                        <div className="page-title-heading">
                          <img
                            className={styles.icon}
                            src={
                              "https://media-exp1.licdn.com/dms/image/C4E0BAQElqiSzh_JhNA/company-logo_200_200/0?e=2159024400&v=beta&t=CKrj4iJDeD3qPMQ3XRtt1t31vbW01KtmAx0aMRbiRMk"
                            }
                            alt="..."
                          ></img>
                          <div className={styles.titleSubHeading}>
                            FAQs Section
                            <div className="page-title-subheading">
                              Have Questions? Find Your Answers Here.
                            </div>
                          </div>
                          <div className="page-title-actions">
                            {this.props.currentUser.roles.includes(
                              "Administrator"
                            ) ? (
                              <div>
                                <button
                                  type="button"
                                  id="toggleForm"
                                  className={styles.formBtnTemp}
                                  onClick={this.toggleModal}
                                >
                                  Add Question
                                </button>

                                <button
                                  type="button"
                                  id="toggleCatForm"
                                  className={styles.formBtnTemp}
                                  onClick={this.toggleCatModal}
                                >
                                  Add/Update Category
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div>
          <Modal isOpen={this.state.modalIsOpen}>
            <ModalHeader toggle={this.toggleModal}>FAQs Form</ModalHeader>
            <ModalBody>
              <FAQsForm
                onCancel={this.toggleModal}
                faq={this.state.mapFaqQuest}
                refreshFAQsPage={this.refreshFAQsPage}
              />
            </ModalBody>
            <ModalFooter></ModalFooter>
          </Modal>
        </div>
        <div>
          <Modal isOpen={this.state.catModalIsOpen}>
            <ModalHeader toggle={this.toggleCatModal}>
              Category Form
            </ModalHeader>
            <ModalBody>
              <CategoryForm
                onCancel={this.toggleCatModal}
                catCol={this.state.mapCatColumns}
                refreshFAQsPage={this.refreshFAQsPage}
              />
            </ModalBody>
            <ModalFooter></ModalFooter>
          </Modal>
        </div>
        <Col>
          <div className={styles.outeraccordion}>
            <Row className="justify-content-around">
              {this.state.mappedCategories}
            </Row>
          </div>
        </Col>
        <Row>
          <Col>
            <div>
              <div className="shadow p-3 mb-5 bg-white rounded col-md">
                <div className="row">
                  <div className="col-12">
                    <h1>Host A Hero</h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <p>
                      Red hair crookshanks bludger Marauder’s Map Prongs
                      sunshine daisies butter mellow Ludo Bagman. Beaters
                      gobbledegook N.E.W.T., Honeydukes eriseD inferi Wormtail.
                      Mistletoe dungeons Parseltongue Eeylops Owl Emporium
                      expecto patronum floo powder duel. Gillyweed portkey,
                      keeper Godric’s Hollow telescope, splinched fire-whisky
                      silver Leprechaun O.W.L. stroke the spine. Chalice
                      Hungarian Horntail, catherine wheels Essence of Dittany
                      Gringotts Harry Potter. Prophecies Yaxley green eyes
                      Remembrall horcrux hand of the servant. Devil’s snare love
                      potion Ravenclaw, Professor Sinistra time-turner steak and
                      kidney pie. Cabbage Daily Prophet letters from no one
                      Dervish and Banges leg.
                    </p>
                    <p>
                      Prefect’s bathroom Trelawney veela squashy armchairs,
                      SPEW: Gamp’s Elemental Law of Transfiguration. Magic
                      Nagini bezoar, Hippogriffs Headless Hunt giant squid
                      petrified. Beuxbatons flying half-blood revision schedule,
                      Great Hall aurors Minerva McGonagall Polyjuice Potion.
                      Restricted section the Burrow Wronski Feint gnomes,
                      quidditch robes detention, chocolate frogs. Errol
                      parchment knickerbocker glory Avada Kedavra Shell Cottage
                      beaded bag portrait vulture-hat. Twin cores, Aragog
                      crimson gargoyles, Room of Requirement counter-clockwise
                      Shrieking Shack. Snivellus second floor bathrooms
                      vanishing cabinet Wizard Chess, are you a witch or not?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <div className={styles.contactBox}>
              <div className="shadow p-3 mb-5 bg-white rounded col-md">
                <div className="row">
                  <div className="col-12">
                    <h3>Still Have Questions?</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <p>Not finding the answers your looking for?</p>
                    <p>Please call us at 1-800-got-quest</p>
                    <p>
                      Email us at:{" "}
                      <a
                        href="mailto:HostHero@questions.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        HostHero@questions.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Col>
          <Footer />
        </Col>
      </>
    );
  }
}

FAQs.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  refreshFAQsPage: PropTypes.func,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    roles: PropTypes.array,
    veteranStatus: PropTypes.string
  })
};

export default withRouter(FAQs);
