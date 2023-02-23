import React from 'react'
import { MDBDataTable } from 'mdbreact';
import "@fortawesome/fontawesome-free/css/all.min.css";
// import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import './index.scss'

function Table( { data } ) {
    
    return (
        <div className='table-container'>
            <MDBDataTable
                striped
                bordered
                small
                data={data}
            />
        </div>
    );
}

export default Table