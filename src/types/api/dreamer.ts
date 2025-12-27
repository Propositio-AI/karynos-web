export type DreamerGroupItem = {
	/** グループ名 */
	name: string;
	/** グループID (UUID7) */
	group_id: string;
};

export type NewDreamerRequest = {
	/** 団体ID */
	organization_id: number;
	/** 苗字 */
	name_family: string;
	/** 名前 */
	name_given: string;
};

export type NewDreamerResponse = {
	/** Dreamer ID (UUID) */
	dreamer_id: string;
};

export type UpdateDreamerRequest = {
	/** 団体ID */
	organization_id?: number;
	/** 苗字 */
	name_family?: string;
	/** 名前 */
	name_given?: string;
};

export type DreamerResponse = {
	/** ログイン用ID */
	login_id: string;
	/** 団体ID */
	organization_id: number;
	/** 苗字 */
	name_family: string;
	/** 名前 */
	name_given: string;
	/** 所属しているDreamerグループの一覧 */
	groups: DreamerGroupItem[];
};

export type NewDreamerGroupRequest = {
	/** グループ名 */
	name: string;
	/** グループの説明 */
	description: string;
	/** 初期グループDreamerのIDリスト (UUID7) */
	dreamers: string[];
};

export type NewDreamerGroupResponse = {
	/** グループID (UUID7) */
	group_id: string;
};

export type DreamerMemberItem = {
	/** Dreamer名 */
	name: string;
	/** Dreamer ID (UUID7) */
	dreamer_id: string;
};

export type DreamerGroupResponse = {
	/** グループ名 */
	name: string;
	/** グループの説明 */
	description: string;
	/** グループメンバーのIDリスト */
	dreamers: DreamerMemberItem[];
};

export type UpdateDreamerGroupRequest = {
	/** グループ名 */
	name?: string;
	/** グループの説明 */
	description?: string;
};

export type DreamerToGroupRequest = {
	/** 更新したいDreamer IDのリスト (UUID) */
	dreamers: string[];
};

export type DreamerToGroupResponse = {
	/** 更新後のDreamer IDのリスト (UUID) */
	dreamers: string[];
};
