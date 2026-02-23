function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Title</th>
        <th>Body</th>
        <th>Date</th>
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
  const rows = props.journalData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.title}</td>
        <td>{row.body}</td>
        <td>{formatDate(row.date)}</td>
      </tr>
    );
  });
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
