import React from 'react';
import axios from 'axios';
import { AppHeader, AdviceButton, AdviceLoader, Card, Footer } from './utils';

import './App.css';

class App extends React.Component {
	state = { advice: '', isLoading: true };
	//since we want to get data as soon as compnent renders we are calling fetchAdvice here
	componentDidMount() {
		this.initialAdvice();
	}

	//when a function belongs to a class you don't need to declare it as const e.g fetchAdvice below
	fetchAdvice = async () => {
		try {
			//while awaiting response set isLoading true
			this.setState({ isLoading: true });
			const response = await axios.get('https://api.adviceslip.com/advice');
			//once response is received, retrieve random advice slip
			const { advice } = response.data.slip;
			//set state of advice with data from slip
			this.setState({ advice });
			//once state is set, then set loading to false after 2.5 second timeout so data can fully render
			setTimeout(() => this.setState({ isLoading: false }), 4300);
		} catch (error) {
			alert(error);
		}
	};

	initialAdvice = async () => {
		try {
			//while awaiting response set isLoading true
			this.setState({ isLoading: false });
			const response = await axios.get('https://api.adviceslip.com/advice');
			//once response is received, retrieve random advice slip
			const { advice } = response.data.slip;
			//set state of advice with data from slip
			this.setState({ advice });
			//once state is set, then set loading to false after 2.5 second timeout so data can fully render
		} catch (error) {
			alert(error);
		}
	};

	render() {
		const { advice, isLoading } = this.state;
		return (
			<div className="app">
				<header>
					<AppHeader />
				</header>
				<div className="clear">
					<span></span>
				</div>
				<content>
					<Card>
						{/*if loading is true then show spinner else show button and advice */}
						{isLoading ? (
							<>
								<h2 class="loadText">Generating Advice</h2>
								<AdviceLoader />
							</>
						) : (
							<AdviceButton advice={advice} fetchAdvice={this.fetchAdvice} />
						)}
					</Card>
				</content>
				<div className="clear">
					<span></span>
				</div>
				<footer>
					<Footer />
				</footer>
			</div>
		);
	}
}

export default App;
