export default function SidePanel({ role }) {
  return (
    <aside>
      <div>
        <h2>What happens next?</h2>
        <ol>
          {role.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>

      {role.documents && (
        <div>
          <h2>Have these documents ready</h2>
          <ul>
            {role.documents.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
            <li>PDF, JPG or PNG, up to 5MB each</li>
          </ul>
        </div>
      )}
    </aside>
  );
}
