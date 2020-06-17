import React from 'react';
import styled from 'styled-components';

export default function Card({ children }) {
	return <CardWrapper>{children}</CardWrapper>;
}

const CardWrapper = styled.div`
	background-color: whitesmoke;
	width: 60%;
	height: 25%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 20px;
	padding: 2%;
	padding: 20px;
	box-shadow: 10px 10px;
	@media only screen and (max-width: 960px) {
		width: 55%;
		height: 30%;
	}
`;

Card.defaultProps = {
	title: 'default title',
};
