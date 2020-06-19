import React from 'react';
import styled from 'styled-components';

export default function Footer() {
	return (
		<FooterWrapper>
			<div className="disclaimer">
				<h5>
					Advice data is fetched from{' '}
					<a href="https://api.adviceslip.com/i">https://api.adviceslip.com/</a>{' '}
					as JSON.
				</h5>
				<h6>
					DISCLAIMER: I am not responsible for any advice you take from this
					application. Some advice may be good, but I highly advise that you use
					common sense when taking any action from any application that could
					jeopordize, yours or anyone elses life, health, or well being.
				</h6>
				<h7>&copy;2020 Created By Shoaib (Aib) Syed</h7>
			</div>
		</FooterWrapper>
	);
}

const FooterWrapper = styled.div`
	padding: 10px;
	background-color: #000000;
	color: #ffffff;
	font-family: 'Spartan', Roboto, sans-serif;
	text-align: left;
	.disclaimer {
		margin: 30px;
	}
	@media only screen and (max-width: 960px) {
		.disclaimer {
			font-size: 12px;
		}
	}
	@media only screen and (max-width: 768px) {
		.disclaimer {
			font-size: 12px;
			margin: 20px;
		}
	}
	@media only screen and (max-width: 320px) {
		.disclaimer {
			font-size: 10px;
		}
	}
`;
