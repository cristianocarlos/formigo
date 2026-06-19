export type TsOverride<Type, NewType> = Omit<Type, keyof NewType> & NewType;
export type TsAllToString<T> = {[P in keyof T]: string};
