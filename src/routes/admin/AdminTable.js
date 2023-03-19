import { Table } from "react-bootstrap";

const AdminTable = ({ header, data, original, changeList, TableButtons, onClick }) => {
  if (!header || !data) {
  }

  return (
    <Table striped bordered hover responsive style={{backgroundColor: 'white'}}>
      <thead>
        <tr>
          {header.map((head, index) => (
            <th key={index}>
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(data) ? data.map((slice, order) => (
          <tr key={order} onClick={onClick ? onClick(original[order]) : () => {}} style={ onClick ? {cursor: 'pointer'} : {}}>
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
                      changeList={changeList}
                    />
                    </td>
                  ))
                : ""}
            
          </tr>
        )) : <tr>
            {header.map((value, index) => (
              <td key={index}>X</td>
            ))}
            
          </tr>}
      </tbody>
    </Table>
  );
};

export default AdminTable;
