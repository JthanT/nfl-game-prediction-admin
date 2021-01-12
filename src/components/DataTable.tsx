import MUIDataTable from "mui-datatables";

function DataTable(props: {
    data: Array<any>,
    columns: Array<any>,
    title?: JSX.Element,
    options: object,
}) {

    return (
        <MUIDataTable
            data={props.data}
            columns={props.columns}
            title={props.title}
            options={{
                print: false,
                download: false,
                viewColumns: false,
                selectableRows: 'none',
                filter: false,
                rowsPerPage: 16,
                rowsPerPageOptions: [],
                ...props.options
            }}
        />
    );
}

export default DataTable;
