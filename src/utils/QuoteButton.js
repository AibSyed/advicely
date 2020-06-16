import React from 'react';

export default function QuoteButton({ advice, fetchAdvice }) {
	return (
		<>
			<h1 className="heading">{advice}</h1>
			<button onClick={fetchAdvice} className="button">
				<span>GIVE ME AIMLESS ADVICE</span>
			</button>
		</>
	);
}
