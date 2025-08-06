export interface ProposalUser {
  id: number;
  name: string;
  phone_number: string;
  fullname: string;
  latitute: number;
  longitude: number;
  country: string;
  region: string;
}

export interface ProposalUserItem {
  id: number;
  link: string;
  identifier: string;
  counter: number;
}

export interface ProposalItem {
  id: number;
  user_id: number;
  user_item: ProposalUserItem;
}

export interface Proposal {
  id: number;
  sender: ProposalUser;
  receiver: ProposalUser;
  items: ProposalItem[];
}

