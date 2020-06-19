import React from 'react';
import styled from 'styled-components';

export default function Card({ children }) {
	return <CardWrapper>{children}</CardWrapper>;
}

const CardWrapper = styled.div`
	position: absolute;
	top: 20%;
	background-color: whitesmoke;
	width: 60%;
	height: 35%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-radius: 20px;
	padding: 20px;
	box-shadow: 10px 10px;
`;
