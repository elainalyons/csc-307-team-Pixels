function TableHeader() {
  return (
    <thead>
      <tr>
        <th>Title</th>
        <th>Body</th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const rows = props.journalData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.title}</td>
        <td>{row.body}</td>
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
