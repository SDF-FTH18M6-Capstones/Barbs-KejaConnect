export default function ButtonText({ onclick, text }) {
  return (
    <div
      className="flex px-3 py-2 text-text hover:text-primary"
      onclick={onclick}
    >
      <p>{text}</p>
    </div>
  );
}
