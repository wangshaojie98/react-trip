import React from 'react';
import './style.scss';

export default function SvgIcon({iconName, myClass}) {
	return (
		<svg className={`svgIcon ${myClass}`} aria-hidden="true">
			<use xlinkHref={`#icon-${iconName}`}/>
		</svg>
	);
}
