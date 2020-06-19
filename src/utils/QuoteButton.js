import React from 'react';
import styled from 'styled-components';

export default function QuoteButton({ advice, fetchAdvice }) {
	return (
		<QuoteButtonWrapper>
			<h1 className="advice">{advice}</h1>
			<br />
			<button onClick={fetchAdvice} className="button">
				<span>GENERATE ADVICE</span>
			</button>
		</QuoteButtonWrapper>
	);
}

const QuoteButtonWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	.advice {
		font-family: 'Spartan', Roboto, sans-serif;
		margin: 15px;
	}
	.button {
		max-width: 300px;
		text-transform: uppercase;
		text-decoration: none;
		padding: 15px;
		background: #164ca7;
		border-radius: 10px;
		cursor: pointer;
		border: none;
	}
	.button span {
		color: #ffffff;
		font-size: 16px;
		font-weight: 500;
		letter-spacing: 0.7px;
		text-align: center;
	}
	.button:hover span {
		text-align: center;
		font-style: italic;
	}
	@media only screen and (max-width: 450px) {
		.advice {
			font-size: 20px;
		}
		.button span {
			font-size: 13px;
		}
	}
`;

QuoteButton.defaultProps = {
	advice: 'Be Good. Do Good.',
};
