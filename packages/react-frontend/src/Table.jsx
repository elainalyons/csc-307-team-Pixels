function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Date</th>
        <th>Title</th>
        <th>Body</th>
      </tr>
    </thead>
  );
}

const formatDate = (value) => {
  const d = new Date(value);
  /*   return value && !isNaN(d) */
  return value && !isNaN(d)
    ? d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      })
    : "";
};

function TableBody(props) {
  const rows = props.journalData.map((row) => (
    <tr key={row._id ?? `${row.title} - ${row.createdAt}`}>
      <td>{formatDate(row.createdAt)}</td>
      <td>{row.title}</td>
      <td>{row.body}</td>
    </tr>
  ));
  return <tbody>{rows}</tbody>;
}

function Table(props) {
  return (
    <table>
      <TableHeader />
      <TableBody journalData={props.journalData} />
    </table>
  );
}

export default Table;
