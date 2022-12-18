import { Link } from "react-router-dom";

function HeaderLogo() {
  return (
    <div className="top-bar__logo">
      <Link to="/" className="top-bar__logo-link">
        Last.fm
      </Link>
    </div>
  );
}

export default HeaderLogo;
