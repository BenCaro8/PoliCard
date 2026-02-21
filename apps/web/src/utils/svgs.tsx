import { ReactElement, CSSProperties, cloneElement, SVGProps } from 'react';
import { themeColors, ThemeColor } from './types';
import React from 'react';

export const shapes = ['squiggle', 'square', 'triangle', 'x'] as const;

type Shape = (typeof shapes)[number];

type ShapeMap = {
  [shape in Shape]: { svg: ReactElement; fill: boolean };
};

const shapeMap: ShapeMap = {
  squiggle: {
    svg: (
      <svg>
        <path
          d="m2.46177,126.39581c10.12618,-0.06577 20.25237,-0.13151 30.37857,-0.19726c0.06666,-10.3997 0.13333,-20.7994 0.19999,-31.19908c10.07782,0 20.15564,0 30.23346,0c0,-10.46351 0,-20.927 0,-31.39051c10.33589,0 20.67178,0 31.00767,0c0,-10.20827 0,-20.41656 0,-30.62485c10.20829,0 20.41656,0 30.62485,0c0,-10.20829 0,-20.41658 0,-30.62487c15.18483,0 30.36965,0 45.55448,0c0,5.10414 0,10.20829 0,15.31243c-10.08071,0 -20.16136,0 -30.24206,0c0,10.33589 0,20.67178 0,31.00769c-10.20829,0 -20.41656,0 -30.62485,0c0,10.33589 0,20.67178 0,31.00767c-10.20829,0 -20.41656,0 -30.62485,0c0,10.33591 0,20.6718 0,31.00767c-10.33589,0 -20.67178,0 -31.00767,0c0,10.46351 0,20.927 0,31.39049c-15.31243,0 -30.62485,0 -45.93728,0c0.68263,-5.07223 -1.16374,-10.79174 0.43769,-15.68938l0,0z"
          strokeWidth="7"
          fill="none"
        />
      </svg>
    ),
    fill: false,
  },
  square: {
    svg: (
      <svg
        height="200px"
        width="200px"
        viewBox="-95.7 -95.7 521.40 521.40"
        strokeWidth="15"
      >
        <path
          d="M315,0H15C6.716,0,0,6.716,0,15v300c0,8.284,6.716,15,15,15h300c8.284,0,15-6.716,15-15V15 C330,6.716,323.285,0,315,0z M300,300H30V30h270V300z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    fill: false,
  },
  triangle: {
    svg: (
      <svg height="200px" width="200px" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.0001 5.94363L4.76627 18H19.2339L12.0001 5.94363ZM10.7138 4.20006C11.2964 3.22905 12.7037 3.22905 13.2863 4.20006L21.4032 17.7282C22.0031 18.728 21.2829 20 20.117 20H3.88318C2.71724 20 1.99706 18.728 2.59694 17.7282L10.7138 4.20006Z"
          fill="none"
        />
      </svg>
    ),
    fill: false,
  },
  x: {
    svg: (
      <svg height="100px" width="100px" viewBox="0 0 25 25">
        <g
          stroke="none"
          strokeWidth="1"
          fillRule="evenodd"
          transform="translate(-467.000000, -1039.000000)"
        >
          <path
            d="M489.396,1061.4 C488.614,1062.18 487.347,1062.18 486.564,1061.4 L479.484,1054.32 L472.404,1061.4 C471.622,1062.18 470.354,1062.18 469.572,1061.4 C468.79,1060.61 468.79,1059.35 469.572,1058.56 L476.652,1051.48 L469.572,1044.4 C468.79,1043.62 468.79,1042.35 469.572,1041.57 C470.354,1040.79 471.622,1040.79 472.404,1041.57 L479.484,1048.65 L486.564,1041.57 C487.347,1040.79 488.614,1040.79 489.396,1041.57 C490.179,1042.35 490.179,1043.62 489.396,1044.4 L482.316,1051.48 L489.396,1058.56 C490.179,1059.35 490.179,1060.61 489.396,1061.4 L489.396,1061.4 Z M485.148,1051.48 L490.813,1045.82 C492.376,1044.26 492.376,1041.72 490.813,1040.16 C489.248,1038.59 486.712,1038.59 485.148,1040.16 L479.484,1045.82 L473.82,1040.16 C472.257,1038.59 469.721,1038.59 468.156,1040.16 C466.593,1041.72 466.593,1044.26 468.156,1045.82 L473.82,1051.48 L468.156,1057.15 C466.593,1058.71 466.593,1061.25 468.156,1062.81 C469.721,1064.38 472.257,1064.38 473.82,1062.81 L479.484,1057.15 L485.148,1062.81 C486.712,1064.38 489.248,1064.38 490.813,1062.81 C492.376,1061.25 492.376,1058.71 490.813,1057.15 L485.148,1051.48 L485.148,1051.48 Z"
            id="cross"
          />
        </g>
      </svg>
    ),
    fill: true,
  },
};

export const getSvg = (
  shape: Shape,
  index: number,
  className: string,
  style: CSSProperties,
  color: ThemeColor | string | 'none' = 'primary-accent-color',
): ReactElement => {
  const svgElement = shapeMap[shape].svg as React.ReactElement<
    SVGProps<SVGSVGElement>
  >;

  color = themeColors.includes(`--${color}` as (typeof themeColors)[number])
    ? `var(--${color})`
    : color;

  const clonedSvg = cloneElement(svgElement, {
    key: index,
    className,
    style: { ...style, stroke: color },
  });

  let clonedPath = svgElement.props.children;
  if (React.isValidElement(clonedPath)) {
    clonedPath = cloneElement(
      clonedPath as React.ReactElement<SVGProps<SVGPathElement>>,
      {
        fill: shapeMap[shape].fill ? color : 'none',
      },
    );
  }

  return cloneElement(clonedSvg, {}, clonedPath);
};

export type Icon = 'user' | 'password';

const icons: { [x in Icon]: ReactElement } = {
  user: (
    <svg
      height="20px"
      width="25px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60.671 60.671"
    >
      <ellipse
        stroke="#ffffff"
        cx="30.336"
        cy="12.097"
        rx="11.997"
        ry="12.097"
      ></ellipse>
      <path
        stroke="#ffffff"
        d="M35.64,30.079H25.031c-7.021,0-12.714,5.739-12.714,12.821v17.771h36.037V42.9 C48.354,35.818,42.661,30.079,35.64,30.079z"
      ></path>
    </svg>
  ),
  password: (
    <svg
      width="25px"
      height="25px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288"
        stroke="#ffffff"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export const getIcon = (
  icon: Icon,
  className?: string,
  style?: CSSProperties,
  color: ThemeColor | string | 'none' = 'none',
): ReactElement => {
  const svgElement = icons[icon] as React.ReactElement<SVGProps<SVGSVGElement>>;

  color = themeColors.includes(`--${color}` as (typeof themeColors)[number])
    ? `var(--${color})`
    : color;

  const clonedSvg = cloneElement(svgElement, {
    className,
    style: { ...style, stroke: color },
  });

  return clonedSvg;
};
