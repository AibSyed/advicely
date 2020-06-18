import React from 'react';
import styled from 'styled-components';

export default function QuoteButton({ advice, fetchAdvice }) {
	return (
		<QuoteButtonWrapper>
			<h1 className="heading">{advice}</h1>
			<button onClick={fetchAdvice} className="button">
				<span>GIVE ME AIMLESS ADVICE</span>
			</button>
		</QuoteButtonWrapper>
	);
}

const QuoteButtonWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	.heading {
		display: flex;
		align-items: center;
		height: 15vh;
		font-family: 'Spartan', Roboto, sans-serif;
		margin: 10px;
	}

	.button {
		position: relative;
		text-transform: uppercase;
		text-decoration: none;
		padding: 20px;
		background: transparent;
		border-radius: 10px;
		cursor: pointer;
		border: 3px solid #164ca7;
	}

	.button span {
		color: #000000;
		font-size: 20px;
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
		color: #ffffff;
		text-align: center;
	}

	@media only screen and (max-width: 960px) {
		.heading {
			font-size: 24px;
		}

		.button {
			width: 270px;
			padding: 10px;
		}

		.button span {
			font-size: 17px;
		}
	}

	@media only screen and (max-width: 768px) {
		.heading {
			font-size: 22px;
		}

		.button {
			width: 230px;
			padding: 10px;
		}

		.button span {
			font-size: 14px;
		}
	}

	@media only screen and (max-width: 320px) {
		.heading {
			font-size: 18px;
		}

		.button {
			width: 180px;
			padding: 10px;
		}

		.button span {
			font-size: 12px;
		}
	}
`;

QuoteButton.defaultProps = {
	title: 'default title',
};
