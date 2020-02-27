import React, { Component } from "react";
import { withRouter } from "react-router";
import { Card, Nav, NavLink, NavItem } from "reactstrap";
import styles from "./footer.module.css";

class Footer extends Component {
  render() {
    return (
      <div className="col-12 p-0">
        <footer className={styles.footer}>
          <hr />
          <Card className=" pmd-footer bg-primary pmd-footer-dark align-items-center">
            <div className={styles.footerContainer}>
              <div className="row pb-4">
                <div className=" col-12 d-flex justify-content-center">
                  <ul className="pmd-footer-nav">
                    <p className="pmd-listing-title text-center">
                      <b className="text-white">Contact</b>
                    </p>
                    <Nav>
                      <NavItem>
                        <NavLink className="text-white">
                          <a
                            href="mailto:HostHero@questions.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white"
                          >
                            HostHero@questions.com
                          </a>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink className="text-white">
                          1-800-got-quest
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </ul>
                </div>
              </div>
              <div className="text-center text-white">
                <i className="f09a"> </i>
                <i className="fa fa f099"> </i>
                <div className="pmd-site-info">
                  <span>
                    &copy; 2020 <strong>HostAHero</strong>.
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </footer>
      </div>
    );
  }
}
export default withRouter(Footer);
