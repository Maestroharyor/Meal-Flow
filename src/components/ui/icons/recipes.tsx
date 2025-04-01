import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export function Recipes({ color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M11.25 4.5A3.75 3.75 0 0 0 7.5 8.25v9a3.75 3.75 0 0 0 3.75 3.75h6a3.75 3.75 0 0 0 3.75-3.75v-9A3.75 3.75 0 0 0 17.25 4.5h-6ZM13.5 16.5h3.75a.75.75 0 0 1 0 1.5H13.5a.75.75 0 0 1 0-1.5Zm0-3h3.75a.75.75 0 0 1 0 1.5H13.5a.75.75 0 0 1 0-1.5Zm0-3h3.75a.75.75 0 0 1 0 1.5H13.5a.75.75 0 0 1 0-1.5ZM5.25 6.75a.75.75 0 0 0-.75.75v10.5a2.25 2.25 0 0 0 2.25 2.25h6.75a.75.75 0 0 0 0-1.5H6.75a.75.75 0 0 1-.75-.75V7.5a.75.75 0 0 0-.75-.75Z"
        fill={color}
      />
    </Svg>
  );
}
