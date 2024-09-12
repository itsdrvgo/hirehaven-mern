import { SVGProps } from "react";

export function HireHaven({
    width,
    height,
    className,
    fill = "#fff",
    ...props
}: SVGProps<SVGSVGElement>) {
    return (
        <svg
            id="HireHaven"
            data-name="HireHaven"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            height={height || 30}
            width={width || 30}
            className={className}
            {...props}
        >
            <path
                fill={fill}
                d="M451.44,190.21A144.41,144.41,0,1,0,307,334.62,144.41,144.41,0,0,0,451.44,190.21Zm-229,0a83.24,83.24,0,1,1,83.24,83.25A83.24,83.24,0,0,1,222.41,190.21Z"
            />
            <rect
                fill={fill}
                x="229.76"
                y="355.78"
                width="141.65"
                height="55.19"
                rx="24"
                transform="translate(683.96 82.78) rotate(90)"
            />
            <rect
                fill={fill}
                x="48.56"
                y="399.01"
                width="279.63"
                height="55.19"
                rx="24"
                transform="translate(376.74 853.21) rotate(180)"
            />
        </svg>
    );
}
