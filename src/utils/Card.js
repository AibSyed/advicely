import React from 'react';
import styled from 'styled-components';

export default function Card({ children }) {
	return <CardWrapper>{children}</CardWrapper>;
}

const CardWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	background-color: whitesmoke;
	width: 80%;
	max-width: 500px;
	min-height: 200px;
	align-items: center;
	border-radius: 20px;
	padding: 20px;
	box-shadow: 10px 10px;

	@media only screen and (max-width: 450px) {
		width: 80%;
		padding: 10px;
	}
`;
