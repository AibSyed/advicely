import React from 'react';
import styled from 'styled-components';
import { FcIdea } from 'react-icons/fc';
import { IconContext } from 'react-icons';

export default function TitleHead() {
	return (
		<TitleHeadWrapper>
			{' '}
			<div>
				{' '}
				<IconContext.Provider value={{ size: '1.5em' }}>
					<h1>
						Aimless Advice{' '}
						<sup>
							<FcIdea />
						</sup>
					</h1>
				</IconContext.Provider>
			</div>
		</TitleHeadWrapper>
	);
}

const TitleHeadWrapper = styled.div`
	display: flex;
	position: fixed;
	top: 0;
	justify-content: center;
	align-items: center;
	width: 100%;
	background-color: #000000;
	color: #ffffff;
	font-family: 'Spartan', Roboto, sans-serif;
	font-weight: bolder;
	@media only screen and (max-width: 400px) {
		font-size: 12px;
	}
`;

TitleHead.defaultProps = {
	title: 'default title',
};
