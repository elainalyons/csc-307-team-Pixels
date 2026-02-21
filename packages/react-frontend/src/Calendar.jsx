function CalendarHeader() {
  return (
    <thead>
      <tr>
        Calendar Here
      </tr>
    </thead>
  );
}

function CalendarBody(props) {
  
}
function Calendar(props){
    return (
        <table>
            <CalendarHeader />
            <CalendarBody CalendarData = {props.CalendarData} />
        </table>
    );
}

export default Calendar; 