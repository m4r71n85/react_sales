import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

// with es6
import BootstrapTable from 'react-bootstrap-table-next';


export class Home extends Component {
    static columns = [{
        dataField: 'firstName',
        text: 'First Name',
        sort: true
    }, {
        dataField: 'surname',
        text: 'Surname',
        sort: true
    }, {
        dataField: 'email',
        text: 'Email',
        sort: true
    }];

    constructor(props) {
        super(props);
        this.state = { users: [], loading: true, page: 1, sizePerPage: 10 };
        this.products = [];
        this.handleTableChange(null, {page: 1, sizePerPage: 10});
    }


    handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder }) => {
        console.log(type, page, sizePerPage, filters, sortField, sortOrder)
        fetch('api/Users/' + sizePerPage +'/' + page + '/' + sortField + '/' + sortOrder)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    page,
                    users: data.usersData,
                    totalSize: data.totalSize,
                    loading: false
                });
            });
    }
    

    resetUsersData() {
        console.log('resetting..');
    }

    static renderUsersData(users, page, sizePerPage,  totalSize, onTableChange) {
        return (
            <BootstrapTable remote keyField='userId' data={users} columns={this.columns}
                pagination={paginationFactory({ page, sizePerPage, totalSize, hideSizePerPage: true })}
                noDataIndication={"Loading..."}
                onTableChange={onTableChange} />
        )
    }



    render() {
        let usersTableContent = Home.renderUsersData(this.state.users, this.state.page, this.state.sizePerPage, this.state.totalSize,
            this.handleTableChange);

    return (
            <div className="mt-5">

            <div className="spinner">
                <div className="rect1" />
                <div className="rect2" />
                <div className="rect3" />
                <div className="rect4" />
                <div className="rect5" />
            </div>

                <h1>Sales data</h1>
                <p>This is an interview project for Client Savvy developed by Martin Tsekov.</p>

                <div className="row mb-2">
                    <div className="col">
                        <Button variant="warning" onClick={this.resetUsersData}>Reset Data</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-7">
                        {usersTableContent}
                    </div>
                    <div className="col">
                        ...
                    </div>
                </div>
            </div>
    );
    }
}