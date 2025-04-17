// import {Column, Table} from "../schema";
//
// type InferColumnType<C extends Column<any, any>> =
//     C extends Column<any, infer T>
//         ? C["isNullable"] extends true
//             ? T | undefined
//             : T
//         : never;
//
// export type InferTable<T extends Table<any>> = {
//     [K in keyof T["columns"]]: InferColumnType<T["columns"][K]>;
// };
