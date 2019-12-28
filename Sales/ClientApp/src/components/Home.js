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
        text: 'FirstName',
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


    handleTableChange = (type, { page, sizePerPage }) => {
        fetch('api/Users/' + sizePerPage + '/' + page)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({
                    page,
                    users: data.usersData,
                    sizePerPage,
                    totalSize: data.totalSize,
                    loading: false
                });
            });
    }
    

    resetUsersData() {
        console.log('resetting..');
    }

    static renderUsersData(users, page, sizePerPage, onTableChange, totalSize) {
        return (
            <BootstrapTable remote keyField='userId' data={users} columns={this.columns}
                pagination={paginationFactory({ page, sizePerPage, totalSize })}
                onTableChange={onTableChange} />
        )
    }

    render() {
        let usersTableContent = this.state.loading
            ? <p><em>Loading...</em></p>
            : Home.renderUsersData(this.state.users, this.state.page, this.state.sizePerPage, this.state.totalSize,
            this.handleTableChange);

    return (
            <div className="mt-5">

                <h1>Sales data</h1>
                <p>This is an interview project for Client Savvy developed by Martin Tsekov.</p>

                <div className="row mb-2">
                    <div className="col">
                        <Button variant="warning" onClick={this.resetUsersData}>Reset Data</Button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
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