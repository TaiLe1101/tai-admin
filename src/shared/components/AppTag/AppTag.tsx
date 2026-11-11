import { Tag, type TagProps } from "antd";
import type { CSSProperties } from "react";

export interface Props extends Omit<TagProps, 'size'> {
    size?: 'small' | 'normal'
}

const SIZE_STYLES: Record<'small' | 'normal', CSSProperties> = {
    small: {
        fontSize: '8px',
        lineHeight: '12px',
        padding: '0 5px',
        display: 'inline-flex',
        alignItems: 'center',
        marginInlineEnd: 0,
    },
    normal: {
        fontSize: '12px',
        height: '22px',
        lineHeight: '20px',
        padding: '0 7px',
        display: 'inline-flex',
        alignItems: 'center',
    },
}

export function AppTag({ children, size = "normal", style,
    ...restProps }: Props) {
    return (
        <Tag
            style={{
                ...SIZE_STYLES[size],
                ...style,
            }}
            {...restProps}
        >
            {children}
        </Tag>
    )
}