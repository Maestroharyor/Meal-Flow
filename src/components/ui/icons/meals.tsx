import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export function Meals({ color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M18.75 3A2.25 2.25 0 0 0 16.5 5.25v13.5A2.25 2.25 0 0 0 18.75 21h.75a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 19.5 3h-.75ZM3.75 3A.75.75 0 0 0 3 3.75v3c0 .414.336.75.75.75h.75v11.25a2.25 2.25 0 0 0 2.25 2.25h1.5a2.25 2.25 0 0 0 2.25-2.25V7.5h.75a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 0-.75-.75h-7.5Zm5.25 5.25V7.5h-3v.75c0 1.242 1.008 2.25 2.25 2.25h.75Z"
        fill={color}
      />
    </Svg>
  );
}
