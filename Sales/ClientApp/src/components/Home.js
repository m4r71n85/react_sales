import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export class Home extends Component {
    pageSize = 10;
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
    data = [
        {
            "name": "Page A",
            "uv": 4000,
            "pv": 2400,
            "amt": 2400
        },
        {
            "name": "Page B",
            "uv": 3000,
            "pv": 1398,
            "amt": 2210
        },
        {
            "name": "Page C",
            "uv": 2000,
            "pv": 9800,
            "amt": 2290
        },
        {
            "name": "Page D",
            "uv": 2780,
            "pv": 3908,
            "amt": 2000
        },
        {
            "name": "Page E",
            "uv": 1890,
            "pv": 4800,
            "amt": 2181
        },
        {
            "name": "Page F",
            "uv": 2390,
            "pv": 3800,
            "amt": 2500
        },
        {
            "name": "Page G",
            "uv": 3490,
            "pv": 4300,
            "amt": 2100
        }
    ]

    constructor(props) {
        super(props);
        this.state = { users: [], loading: true, page: 1, sizePerPage: this.pageSize };
        this.products = [];
        this.handleTableChange(null, { page: 1, sizePerPage: this.pageSize});
    }

    handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder }) => {
        this.loadUsers(page, sortField, sortOrder)
    }

    loadUsers = (page, sortField, sortOrder) => {
        axios.get('api/users/list', {
            params: {
                pageSize: this.pageSize,
                page,
                sortField,
                sortOrder
            }
        })
            .then(response => {
                this.setState({
                    page,
                    users: response.data.usersData,
                    totalSize: response.data.totalSize,
                    loading: false
                });
            });
    }

    resetUsersData = () => {
        axios.post('api/reset')
            .then((resp) => {
                this.loadUsers(1)
            });
    }

    static renderUsersData(users, page, sizePerPage,  totalSize, onTableChange) {
        return (
            <BootstrapTable remote keyField='userId' data={users} columns={this.columns}
                pagination={paginationFactory({ page, sizePerPage, totalSize, hideSizePerPage: true })}
                noDataIndication={"Loading..."}
                onTableChange={onTableChange} />
        )
    }

    static renderTopUsersChart() {
        return (
            <BarChart width={730} height={250} data={this.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
                <ReferenceLine y={4000} label="{this.data}" stroke="red" strokeDasharray="3 3" />
            </BarChart>
        );
    }



    render() {
        let usersTableContent = Home.renderUsersData(this.state.users, this.state.page, this.state.sizePerPage, this.state.totalSize,
            this.handleTableChange);

        let topUserSales = Home.renderTopUsersChart()

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
                    <div className="col-7">
                        {usersTableContent}
                    </div>
                    <div className="col-5">
                        {topUserSales}

                    </div>
                </div>
            </div>
    );
    }
}