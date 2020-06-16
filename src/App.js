import React from 'react';
import axios from 'axios';
import { QuoteButton, QuoteLoader } from './utils';

import './App.css';

class App extends React.Component {
	state = { advice: '', isLoading: true };
	//since we want to get data as soon as compnent renders we are calling fetchAdvice here
	componentDidMount() {
		this.fetchAdvice();
	}

	//when a function belongs to a class you don't need to declare it as const e.g fetchAdvice below
	fetchAdvice = async () => {
		try {
			this.setState({ isLoading: true });
			const response = await axios.get('https://api.adviceslip.com/advice');
			const { advice } = response.data.slip;
			this.setState({ advice });
			setTimeout(() => this.setState({ isLoading: false }), 1500);
		} catch (error) {
			alert(error);
		}
	};

	render() {
		const { advice, isLoading } = this.state;
		return (
			<div className="app">
				<div className="card">
					{isLoading ? (
						<QuoteLoader />
					) : (
						<QuoteButton advice={advice} fetchAdvice={this.fetchAdvice} />
					)}
				</div>
			</div>
		);
	}
}

export default App;
