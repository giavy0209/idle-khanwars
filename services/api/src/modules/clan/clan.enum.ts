export namespace CLAN {
  export namespace REQUEST {
    export enum APPROVAL {
      PENDING = 'PENDING',
      APPROVED = 'APPROVED',
      REJECTED = 'REJECTED',
    }
    export const APPROVALS = Object.values(APPROVAL);
  }
}
