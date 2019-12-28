import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './Home.css';

export class Home extends Component {
    pageSize = 10;
    columns = [{
        dataField: 'firstName',
        text: 'First Name',
        sort: true,
        headerAttrs: { width: 130 },
    }, {
        dataField: 'surname',
        text: 'Surname',
        sort: true,
        headerAttrs: { width: 130 },
    }, {
        dataField: 'email',
        text: 'Email',
        sort: true,
    }, {
        dataField: "userId",
        text: "Actions",
        sort: false,
            formatter: (cell, row, rowIndex) => {
            return (
                <Button variant="outline-info" size="sm" onClick={() => this.getCompareUser(cell)}>Compare</Button>
            );
        },
        headerAttrs: { width: 120 },
    }];
    data = [
            {
                "name": "Page A",
                "uv": 4000,
            },
            {
                "name": "Page B",
                "uv": 3000,
            },
            {
                "name": "Page C",
                "uv": 2000,
            },
            {
                "name": "Page D",
                "uv": 2780,
            },
            {
                "name": "Page E",
                "uv": 1890,
            },
            {
                "name": "Page F",
                "uv": 2390,
            },
            {
                "name": "Page G",
                "uv": 3490,
            },
            {
                "name": "Page H",
                "uv": 3490,
            },
            {
                "name": "Page I",
                "uv": 3490,
            },
            {
                "name": "Page J",
                "uv": 3490,
            }
        ];

    constructor(props) {
        super(props);

        this.state = {
            users: [], loading: true, page: 1, sizePerPage: this.pageSize, compareUser: {}, topUsers: [] };
        this.getGridUsers(1);
    }

    handleTableChange = (type, { page, sizePerPage, filters, sortField, sortOrder }) => {
        this.getGridUsers(page, sortField, sortOrder)
    }

    getGridUsers = (page=1, sortField, sortOrder) => {
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

    getCompareUser = (userId) => {
        axios.get('api/users/compare', { params: { userId } })
            .then((response) => {
                this.setState({ compareUser: response.data })
            });
    }

    getTopUsers = () => {
        axios.get('api/users/top')
            .then((response) => {
                this.setState({ topUsers: response.data })
            });
    }

    resetUsersData = () => {
        axios.post('api/reset')
            .then(() => {
                this.getGridUsers();
                this.setState({ compareUser: {} });
            });
    }

    static renderUsersData(users, page, sizePerPage, totalSize, onTableChange, columns) {
        return (
            <BootstrapTable remote keyField='userId' data={users} columns={columns}
                pagination={paginationFactory({ page, sizePerPage, totalSize, hideSizePerPage: true })}
                noDataIndication={"Loading..."}
                onTableChange={onTableChange} />
        )
    }

    static renderTopUsersChart(data, compareUser) {
        return (
            <BarChart width={640} height={250} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="uv" fill="#686dff" />
                <ReferenceLine y={compareUser.totalVolume} label={compareUser.firstName + ' ' + compareUser.surname + ' ('+ compareUser.totalVolume +')'} stroke="red" strokeDasharray="3 3" />
            </BarChart>
        );
    }

    render() {
        let usersTableContent = Home.renderUsersData(this.state.users, this.state.page, this.state.sizePerPage, this.state.totalSize,
            this.handleTableChange, this.columns);

        let topUserSales = Home.renderTopUsersChart(this.data, this.state.compareUser)

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
                    <div className="col-6">
                        {usersTableContent}
                    </div>
                    <div className="col-6">
                        {topUserSales}
                    </div>
                </div>
            </div>
    );
    }
}