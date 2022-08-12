export interface MessageContext {
  messageId: bigint;
  guildId?: bigint;
  authorId: bigint;
  channelIds: bigint[];
  roleIds: bigint[];
}
