import React from "react";

import "../index.css";
// Root layout applies to all routes
const RootLayout: React.FC<React.PropsWithChildren<object>> = ({
  children,
}) => {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default RootLayout;
