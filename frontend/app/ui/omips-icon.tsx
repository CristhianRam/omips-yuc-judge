/**
 * @file frontend/app/ui/omips-icon.tsx
 * @description Componente de interfaz de usuario del frontend.
 * @symbols OmipsIcon
 */

import * as React from "react";

/**
 * OMIPS Yuc. logo as a React SVG component.
 * Pass `width` and/or `height` to control the size.
 */
export default function OmipsIcon({
    width,
    height,
    className = '',
    ...props
}: {
    width?: number;
    height?: number;
    className?: string;
} & React.SVGProps<SVGSVGElement>) {
    const w = width ?? undefined;
    const h = height ?? (width ? Math.round(width * (600 / 800)) : undefined);
    return (
        <svg
            width={w}
            height={h}
            viewBox="0 0 800 600"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            className={className}
            {...props}
        >
            <g>
                <g id="svg_6">
                    <path
                        transform="rotate(180 400 435.418)"
                        id="svg_4"
                        d="m350.74517,285.23214l89.53281,-0.58717l238.8905,122.37738l1.3889,176.39007l-561.11489,2.7778l1.3889,-194.44576"
                        strokeWidth={5}
                        stroke="#ffffff"
                        fill="#ffffff"
                    />
                    <path
                        id="svg_5"
                        d="m346.66356,16.31179l93.61444,-2.50201l238.8905,123.61195l1.3889,176.39007l-561.11489,2.7778l1.3889,-194.44575"
                        strokeWidth={5}
                        stroke="#ffffff"
                        fill="#ffffff"
                    />
                </g>
                <path
                    id="svg_7"
                    d="m-511.40551,133.40678l0.74251,-0.74001l0.74251,0.74001l-0.37125,0l0,0.74357l-0.74251,0l0,-0.74357l-0.37125,0l-0.00001,0z"
                    strokeWidth={25}
                    stroke="#000"
                    fill="none"
                />
                <line
                    fill="none"
                    x1={217.14274}
                    y1={26.17035}
                    x2={304.07498}
                    y2={215.74285}
                    id="svg_12"
                    strokeWidth={40}
                    stroke="#241ecc"
                    transform="rotate(-90.16 260.609 120.957)"
                />
                <path
                    fill="#ffffff"
                    strokeWidth={40}
                    d="m217.94609,24.56921l87.72554,191.97476"
                    id="svg_25"
                    stroke="#0000bf"
                    transform="rotate(-90.16 261.809 120.557)"
                />
                <path
                    fill="#0000ff"
                    d="m-379.09569,580.5733c-12.86543,-6.76696 -11.1775,-10.8647 20.10222,-48.79781c15.79474,-19.15425 28.7176,-35.38255 28.7176,-36.06286c0,-0.68026 -43.61471,-1.23688 -96.92188,-1.23688l-96.92188,0l0,-35.87399l0,-35.87399l97.69003,0c75.32451,0 96.8491,-1.0807 94.01752,-4.72028c-2.01986,-2.59614 -15.79827,-19.8237 -30.61872,-38.2834c-27.93672,-34.79698 -27.92796,-44.12868 0.04316,-47.02117c13.92018,-1.43944 230.64082,109.15936 238.08995,121.50428c-72.18775,44.0781 -158.47658,90.21657 -237.96264,130.89759c-4.19112,0 -11.49694,-2.03916 -16.23536,-4.53147l-0.00002,0l0.00002,-0.00002z"
                    id="svg_46"
                    strokeWidth={0}
                    stroke="#241ecc"
                    transform="rotate(-32.808 -324.509 458.897)"
                />
                <line
                    fill="#ffffff"
                    x1={115.61196}
                    y1={159.33887}
                    x2={236.1141}
                    y2={423.43525}
                    id="svg_13"
                    strokeWidth={40}
                    stroke="#0000bf"
                    transform="rotate(-155.192 175.863 291.387)"
                />
                <line
                    fill="#ffffff"
                    x1={498.90802}
                    y1={384.58659}
                    x2={585.20153}
                    y2={578.19629}
                    id="svg_20"
                    strokeWidth={40}
                    stroke="#241ecc"
                    transform="rotate(-90 542.055 481.391)"
                />
                <line
                    fill="#ffffff"
                    x1={565.33643}
                    y1={172.10359}
                    x2={690.6381}
                    y2={442.61108}
                    id="svg_22"
                    strokeWidth={40}
                    stroke="#0000bf"
                    transform="rotate(24.808 627.987 307.357)"
                />
                <line
                    fill="#ffffff"
                    x1={512.21779}
                    y1={24.36646}
                    x2={573.32168}
                    y2={229.47687}
                    id="svg_23"
                    strokeWidth={40}
                    stroke="#0000bf"
                    transform="rotate(313.571 542.77 126.922)"
                />
                <line
                    fill="#ffffff"
                    x1={498.90802}
                    y1={384.58659}
                    x2={585.20153}
                    y2={578.19629}
                    id="svg_40"
                    strokeWidth={40}
                    stroke="#241ecc"
                    transform="rotate(-90 542.055 481.391)"
                />
                <line
                    fill="#ffffff"
                    x1={498.90802}
                    y1={384.58659}
                    x2={585.20153}
                    y2={578.19629}
                    id="svg_41"
                    strokeWidth={40}
                    stroke="#0000bf"
                    transform="rotate(-90 542.055 481.391)"
                />
                <line
                    fill="#ffffff"
                    x1={214.2438}
                    y1={375.25334}
                    x2={300.53731}
                    y2={568.86304}
                    id="svg_43"
                    strokeWidth={40}
                    stroke="#0000bf"
                    transform="rotate(143.903 257.391 472.058)"
                />
                <path
                    fill="#0000bf"
                    strokeWidth={0}
                    d="m240.18469,313.34796l134.16373,-208.6043l134.16373,208.6043l-67.08187,0l0,209.60806l-134.16372,0l0,-209.60806l-67.08187,0z"
                    id="svg_48"
                    stroke="null"
                    transform="rotate(60.8446 374.348 313.85)"
                />
                <path
                    fill="#0000bf"
                    d="m372.65906,31.74095l-37.35602,40.0542l37.35948,40.04675l13.5885,-14.56451l-23.7776,-25.48225l23.77266,-25.48227l-13.58702,-14.57193l0,0.00001zm54.67342,0l-13.57866,14.56824l23.77274,25.48224l-23.77274,25.47913l13.57866,14.56443l37.36447,-40.05042l-37.36447,-40.04362z"
                    id="svg_49"
                    strokeWidth={5}
                    stroke="#ffffff"
                />
                <path
                    fill="#0000bf"
                    d="m372.65906,494.46317l-37.35602,40.0542l37.35949,40.04675l13.5885,-14.56451l-23.7776,-25.48224l23.77266,-25.48227l-13.58703,-14.57194l0,0.00001zm54.67342,0l-13.57865,14.56824l23.77274,25.48223l-23.77274,25.47913l13.57865,14.56444l37.36447,-40.05042l-37.36447,-40.04362z"
                    id="svg_50"
                    strokeWidth={5}
                    stroke="#ffffff"
                />
            </g>
        </svg>
    );
}
