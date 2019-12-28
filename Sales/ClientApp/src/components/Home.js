import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';



export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { users: [], loading: true };

        fetch('api/Users')
            .then(response => response.json())
            .then(data => {
                this.setState({ users: data, loading: false });
            });
    }

    static renderUsersData(forecasts) {
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>Surname</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.userId}>
                            <td>{forecast.firstName}</td>
                            <td>{forecast.surname}</td>
                            <td>{forecast.email}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Home.renderUsersData(this.state.users);

        return (


            <div>
                <Button variant="warning">Warning</Button>

                <h1>Sales data</h1>
                <p>This is an interview project for Client Savvy developed by Martin Tsekov.</p>
                {contents}
            </div>
    );
    }
}