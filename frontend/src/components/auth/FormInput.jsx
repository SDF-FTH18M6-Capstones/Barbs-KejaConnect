export default function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
    return (
      <div className="space-y-2">
        <label htmlFor={name} className="block text-sm font-medium text-text">
          {label}
        </label>
      </div>
    );
}