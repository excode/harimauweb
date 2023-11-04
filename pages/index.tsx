/* eslint-disable @next/next/no-img-element */

import React from "react";
import { Page } from "types/layout";
import LoginPage from "./auth/login";

const LandingPage: Page = () => {
  //
  return (
    <div>
      <LoginPage />
    </div>
  );
};

LandingPage.getLayout = function getLayout(page) {
  return (
    <React.Fragment>
      {page}
      {/* <AppConfig simple /> */}
    </React.Fragment>
  );
};
export default LandingPage;
