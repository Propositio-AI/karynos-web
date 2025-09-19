export type ArchiveType = 'TEXTBOOK' | 'CHAT' | 'GRAPH' | 'PLAN';
export type ShareType = 'PRIVATE' | 'PUBLIC';
export type StatusType = 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';

export type ArchiveTableType = {
    id: string; 
    query_id: string; 
    parent_id: string | null; 
    archive_type: ArchiveType;
    share_type: ShareType;
    archive_status: StatusType
    contents: any | null; 
    contents_metadata: any | null; 
    created_at: string; 
};
