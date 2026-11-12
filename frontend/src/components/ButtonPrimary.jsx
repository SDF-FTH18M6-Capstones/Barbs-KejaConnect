export default function ButtonPrimary({ onclick, text }) {
  return (
    <div
      className="px-3 py-2 transition-all duration-300 bg-primary text-text-on-primary rounded-md hover:bg-primary-dark"
      onClick={onclick}
    >
      <p>{text}</p>
    </div>
  );
}
