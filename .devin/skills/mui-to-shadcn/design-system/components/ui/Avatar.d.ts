import * as React from 'react';
/** shadcn Avatar: Avatar > AvatarImage + AvatarFallback (initials). */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> { className?: string; }
export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> { src?: string; alt?: string; }
export declare function Avatar(props: AvatarProps): JSX.Element;
export declare function AvatarImage(props: AvatarImageProps): JSX.Element | null;
export declare function AvatarFallback(props: AvatarProps): JSX.Element;
