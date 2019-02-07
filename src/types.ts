export type PublicPart<T> = { [K in keyof T]: T[K] };
export type Dict<V, K extends string = string> = { [key in K]?: V };
