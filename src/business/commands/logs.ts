import {getOwnerId} from '../../util/secrets.ts';
import {MessageContext} from '../message-context.ts';
import {command, Command, param, optional, require, Int} from '/business/commands.ts';
import {logMemory} from '/util/log-memory.ts';

@command('logs')
class _Logs extends Command {
  @optional()
  @require((amount: number) => amount > 0)
  @param(Int)
  amount!: number | undefined;

  override async invoke({authorId}: MessageContext) {
    if (authorId !== getOwnerId()) {
      return {success: false, message: 'You do not have permissions to view the logs.'};
    }

    const amount = this.amount ?? 20;

    return {
      message: '```\n' + logMemory.get(amount).join('\n') + '\n```'
    }
  }
}