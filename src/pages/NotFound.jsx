import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found — Shree Munnalal</title>
      </Helmet>
      <div className="container-app py-24 text-center">
        <h1 className="text-4xl mb-3">404</h1>
        <p className="text-brown/60 mb-6">The page you're looking for doesn't exist.</p>
        <Button as={Link} to="/">
          Back to Home
        </Button>
      </div>
    </>
  );
}
