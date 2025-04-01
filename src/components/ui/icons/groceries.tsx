import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export function Groceries({ color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.276l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378a2.25 2.25 0 0 1 2.25-2.25h10.5a.75.75 0 0 0 .712-.513l3-9.75a.75.75 0 0 0-.712-.987H4.902l-.65-2.43a1.875 1.875 0 0 0-1.815-1.371H2.25ZM3.75 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm14.25 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        fill={color}
      />
    </Svg>
  );
}
