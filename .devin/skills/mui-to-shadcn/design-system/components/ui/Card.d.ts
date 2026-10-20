import * as React from 'react';
/** shadcn Card: Card > CardHeader (CardTitle, CardDescription, CardAction) > CardContent > CardFooter. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { className?: string; }
export declare function Card(props: CardProps): JSX.Element;
export declare function CardHeader(props: CardProps): JSX.Element;
export declare function CardTitle(props: CardProps): JSX.Element;
export declare function CardDescription(props: CardProps): JSX.Element;
export declare function CardAction(props: CardProps): JSX.Element;
export declare function CardContent(props: CardProps): JSX.Element;
export declare function CardFooter(props: CardProps): JSX.Element;
