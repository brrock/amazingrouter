import React from "react";
import { useRouter } from "@/lib/router";

const HomePage: React.FC = () => {
  const { pathname } = useRouter();
  return (
    <div>
      <h1>Home Page</h1>
      <p>Current Pathname: {pathname}</p>
    </div>
  );
};

export default HomePage;
