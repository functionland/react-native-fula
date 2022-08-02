export interface FileRef {
    id: string
    iv: string
    key: string
}

export interface FileMeta {
    name: string;
    type: string;
    size: number;
    lastModified: number;
}