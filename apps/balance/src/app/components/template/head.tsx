import React from "react";

import { Helmet } from "react-helmet";

const Head = (title: string | undefined, description: string | undefined) => {
  return (
    <Helmet
      title={`Balance Capital | ${title}`}
      htmlAttributes={{
        lang: "en",
      }}
      meta={[
        {
          name: "description",
          content: description,
        },
      ]}
    ></Helmet>
  );
};

export default Head;
