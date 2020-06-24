import React from 'react';
import styled from 'styled-components';

export default function AdviceButton({ advice, fetchAdvice }) {
	return (
		<AdviceButtonWrapper>
			<h1 className="advice">{advice}</h1>
			<br />
			<button onClick={fetchAdvice} className="button">
				<span>GENERATE ADVICE</span>
			</button>
		</AdviceButtonWrapper>
	);
}

const AdviceButtonWrapper = styled.div`
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
	@media only screen and (max-width: 450px) {
		.button span {
			font-size: 13px;
		}
	}
`;

AdviceButton.defaultProps = {
	advice: 'Be Good. Do Good.',
};
