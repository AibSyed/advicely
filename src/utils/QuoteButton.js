import React from 'react';
import styled from 'styled-components';

export default function QuoteButton({ advice, fetchAdvice }) {
	return (
		<QuoteButtonWrapper>
			<h1 className="advice">{advice}</h1>
			<button onClick={fetchAdvice} className="button">
				<span>GIVE ME AIMLESS ADVICE</span>
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
		padding: 20px;
		background: #164ca7;
		border-radius: 10px;
		cursor: pointer;
	}
	.button span {
		color: #ffffff;
		font-size: 16px;
		font-weight: 500;
		letter-spacing: 0.7px;
		text-align: center;
	}
	.button:hover {
		background: #164ca7;
	}
	.button:active {
		background-color: #164ca7;
		box-shadow: 0 3px #333;
		transform: translateY(4px);
	}
	.button:hover span {
		color: yellow;
		text-align: center;
		font-style: italic;
	}
`;

QuoteButton.defaultProps = {
	advice: 'Be Good. Do Good.',
};
