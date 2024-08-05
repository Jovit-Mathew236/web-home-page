import React from "react";
import { useRouteError } from "react-router-dom";

function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-container">
      <h1>Oops! Something went wrong.</h1>
      <p>
        We're sorry, but an unexpected error occurred. Please try again later.
      </p>
      {error instanceof Error && (
        <p>
          <i>{error.message}</i>
        </p>
      )}
    </div>
  );
}

export default ErrorBoundary;
