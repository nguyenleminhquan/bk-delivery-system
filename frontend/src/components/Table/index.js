import React from 'react'
import { MDBDataTable } from 'mdbreact';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "mdbreact/dist/css/mdb.css";
import './index.scss'

function Table( { data } ) {
    
    return (
        <div className='table-container'>
            <MDBDataTable
                striped
                bordered
                small
                responsiveSm={true}
                responsiveMd={true}
                responsiveLg={true}
                data={data}
            />
        </div>
    );
}

export default Table