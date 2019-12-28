import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

  constructor (props) {
    super(props);
    this.state = { forecasts: [], loading: true };

    fetch('api/Users')
      .then(response => response.json())
      .then(data => {
        this.setState({ forecasts: data, loading: false });
      });
  }

  static renderForecastsTable (forecasts) {
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Temp. (C)</th>
            <th>Temp. (F)</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast =>
            <tr key={forecast.userId}>
              <td>{forecast.firstName}</td>
              <td>{forecast.surname}</td>
              <td>{forecast.email}</td>
              <td>{forecast.summary}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render () {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
        : Home.renderForecastsTable(this.state.forecasts);

    return (
      <div>
        <h1>Sales data</h1>
            <p>This is an interview project for Client Savvy developed by Martin Tsekov.</p> 
        {contents}
      </div>
    );
  }
}
