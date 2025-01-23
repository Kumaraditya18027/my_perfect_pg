"use client";
import { useAuth } from "../contexts/AuthContext";

// app/pgowner/page.tsx
const PgOwnerHome = () => {
  const { currentUserData } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome, {currentUserData?.name || "PG Owner"}!
      </h1>
      <p>Select an option from the navbar to manage your PG.</p>
    </div>
  );
};

export default PgOwnerHome;
