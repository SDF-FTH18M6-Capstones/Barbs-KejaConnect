import { Link } from "react-router-dom";

export default function EmptyInquiries() {
  return (
    <div>
      <p>Find a place you like and ask the poster about it</p>
      <p>Your inquiries will show up here.</p>
      <Link to="/listings">Browse Listings</Link>
    </div>
  );
}
