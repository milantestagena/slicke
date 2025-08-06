export interface ExchangeData {
  collectionId: number;
  otherUserId: number;
  otherUserName?: string;
  toGiveIds: number[];
  toTakeIds: number[];
  toGiveCount?: number;
  toTakeCount?: number;
  minCount?: number;
  membership?: string;
}
