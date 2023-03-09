import { Table } from "react-bootstrap";

const AdminTable = ({ header, data, original, width, done, TableButtons, onClick }) => {
  if (!header || !data) {
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {header.map((head, index) => (
            <th key={index} style={{ width: `${width[index]}%` }}>
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((slice, order) => (
          <tr key={order} onClick={onClick ? onClick(original[order]) : () => {}}>
            {slice.map((value, index) => (
              <td key={index}>{value}</td>
            ))}
           
              {TableButtons
                ? TableButtons.map((TableButton, buttonIndex) => (
                  <td key={header.length - 1}>
                    <TableButton
                      key={buttonIndex}
                      id={slice[0]}
                      order={order}
                      entity={original[order]}
                      done={done}
                    />
                    </td>
                  ))
                : ""}
            
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AdminTable;
