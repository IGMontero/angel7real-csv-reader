import React from 'react';

export default function Copyright() {
	return (
		<div style={{ textAlign: 'center', fontSize: '0.8em', color: '#888', 
        position: 'absolute', bottom: '10px', width: '100%'
        
        }}>
			Prototype by{' '}
			<a href='https://igmontero.com' target='_blank' rel='noopener noreferrer'>
				Ignacio Montero
			</a>{' '}
			&copy; 2023
		</div>
	);
}
