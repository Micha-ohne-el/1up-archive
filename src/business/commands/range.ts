import {MessageContext} from '/business/message-context.ts';
import {command, param, optional, Command, Guild, Int, ParamError} from '/business/commands.ts';
import {getGuildXpRange, setXpRange} from '/data/multipliers.ts';

@command('range')
class _SetRange extends Command {
  @param(Guild, 'this')
  guildId!: bigint | 'this';

  @param(Int)
  first!: number;

  @param(Int)
  last!: number;

  override async invoke({canEdit, guildId}: MessageContext) {
    const guild = this.guildId === 'this' ? guildId : this.guildId;

    if (guild === undefined) {
      throw new ParamError(
        this.$params.get('guildId')!,
        this.guildId,
        'Please provide a Guild ID instead of using `this`, when using this command in DMs.'
      );
    }

    if (!canEdit(guild)) {
      return {success: false};
    }

    await setXpRange(guild, this.first, this.last);

    return {success: true};
  }
}

@command('range')
class _GetRange extends Command {
  @optional()
  @param(Guild, 'this')
  guildId!: bigint | 'this' | undefined;

  override async invoke({guildId}: MessageContext) {
    const guild = this.guildId === 'this' || this.guildId === undefined ? guildId : this.guildId;

    if (guild === undefined) {
      throw new ParamError(
        this.$params.get('guildId')!,
        this.guildId,
        'Please provide a Guild ID, when using this command in DMs.'
      );
    }

    const [first, last] = await getGuildXpRange(guild);

    return {
      message: `XP will be randomly chosen between ${first} and ${last}.`
    };
  }
}