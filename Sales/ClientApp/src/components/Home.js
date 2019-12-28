import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from 'axios';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { BarChart, Bar, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
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
            formatter: (cell) => {
            return (
                <Button variant="outline-info" size="sm" onClick={() => this.getCompareUser(cell)}>Compare</Button>
            );
        },
        headerAttrs: { width: 120 },
        }];

    constructor(props) {
        super(props);

        toastr.options = {
            positionClass: 'toast-top-full-width',
            hideDuration: 300,
            timeOut: 2000
        }
        this.state = {
            users: [], loading: true, page: 1, sizePerPage: this.pageSize, compareUser: {}, topUsers: [] };
        this.getGridUsers();
        this.getTopUsers();
    }


    handleTableChange = (type, { page, sortField, sortOrder }) => {
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
        })
        .catch((error) => {
            toastr.clear();
            toastr.error(error.response.data);
        });
    }

    getCompareUser = (userId) => {
        axios.get('api/users/compare', { params: { userId } })
            .then((response) => {
                this.setState({ compareUser: response.data })
            })
            .catch((error) => {
                toastr.clear();
                toastr.error(error.response.data);
            });
    }

    getTopUsers = () => {
        axios.get('api/users/top')
            .then((response) => {
                this.setState({ topUsers: response.data })
            })
            .catch((error) => {
                toastr.clear();
                toastr.error(error.response.data);
            });
    }

    resetUsersData = () => {
        axios.post('api/reset')
            .then(() => {
                this.getGridUsers();
                this.getTopUsers();
                this.setState({ compareUser: {} });
                toastr.clear();
                toastr.success("New data seeded successfully.");
            })
            .catch((error) => {
                toastr.clear();
                toastr.error(error.response.data);
            });
    }

    static renderUsersData(users, page, sizePerPage, totalSize, onTableChange, columns) {
        return (
            <BootstrapTable remote keyField='userId' data={users} columns={columns}
                pagination={paginationFactory({ page, sizePerPage, totalSize, hideSizePerPage: true })}
                noDataIndication={"No data..."}
                onTableChange={onTableChange} />
        )
    }

    static renderTopUsersChart(topUsers, compareUser) {
        return (
            <BarChart width={640} height={250} data={topUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fullName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalVolume" fill="#686dff" name="Sales" />
                <ReferenceLine y={compareUser.totalVolume} label={compareUser.firstName + ' ' + compareUser.surname + ' ('+ compareUser.totalVolume +')'} stroke="red" strokeDasharray="3 3" />
            </BarChart>
        );
    }

    render() {
        let usersTableContent = Home.renderUsersData(this.state.users, this.state.page, this.state.sizePerPage, this.state.totalSize,
            this.handleTableChange, this.columns);

        let topUserSales = Home.renderTopUsersChart(this.state.topUsers, this.state.compareUser)

        return (

            <div className="mt-5">
                <div className="row">
                    <div className="col mt-3 mb-4">
                        <h1>Sales Data</h1>
                    </div>
                </div>
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