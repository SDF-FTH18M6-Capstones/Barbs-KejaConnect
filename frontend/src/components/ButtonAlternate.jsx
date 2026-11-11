export default function ButtonAlternate({ onclick, text }) {
  return (
    <div
      className="px-3 py-2 transition-all duration-300 text-text border border-text rounded-md hover:border-primary hover:text-primary"
      onclick={onclick}
    >
      <p>{text}</p>
    </div>
  );
}
