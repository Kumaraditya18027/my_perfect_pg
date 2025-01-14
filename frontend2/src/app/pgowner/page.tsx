import Navbar from "@/components/MainNavbar";
import UserInputForm from "@/components/UploadPgForm";

import React from "react";

const addPg = () => {
  return (
    <>
      <div className="mb-2">
        <Navbar />
      </div>
      <div className="mt-4">
        <UserInputForm />
      </div>
    </>
  );
};

export default addPg;
