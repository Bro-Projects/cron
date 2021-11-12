import { Snowflake } from 'eris';
import type { R } from 'rethinkdb-ts';
import type { Giveaway, LotteryResults } from '../typings/';

export default class Database {
  private r: R;

  async connect(r: R): Promise<void> {
    this.r = r;
    await this.r.connectPool({});
  }

  async getUser(userID: string): Promise<any> {
    return this.r.table('users').get(userID).run();
  }

  async getHourlyStats(): Promise<LotteryResults | null> {
    const winner = await this.r.table('lottery').sample(1).run();
    if (!winner.length) {
      return null;
    }
    const participantCount = await this.r.table('lottery').count().run();
    const amount = participantCount * 250000;
    return {
      winnerID: winner[0].id,
      amountWon: amount,
      participantsCount: participantCount,
    };
  }

  async getDailyStats(): Promise<LotteryResults | null> {
    const winner = await this.r.table('dailyLottery').sample(1).run();
    if (!winner.length) {
      return null;
    }
    const participantCount = await this.r.table('dailyLottery').count().run();
    const amount = participantCount * 1e6;
    return {
      winnerID: winner[0].id,
      amountWon: amount,
      participantsCount: participantCount,
    };
  }

  async getWeeklyStats(): Promise<LotteryResults | null> {
    const winner = await this.r.table('weeklyLottery').sample(1).run();
    const participantCount = await this.r.table('weeklyLottery').count().run();
    const amount = participantCount * 1e7;
    return {
      winnerID: winner[0].id,
      amountWon: amount,
      participantsCount: participantCount,
    };
  }

  async resetHourly(): Promise<void> {
    await this.r.table('lottery').delete().run();
  }

  async resetDaily(): Promise<void> {
    await this.r.table('dailyLottery').delete().run();
  }

  async resetWeekly(): Promise<void> {
    await this.r.table('weeklyLottery').delete().run();
  }

  async updateCooldown(userID: string, lotteryType: string): Promise<void> {
    const user = await this.getUser(userID);
    if (!Object.keys(user.lotteryCooldowns).includes(lotteryType)) {
      return null;
    }

    await this.r
      .table('users')
      .get(userID)
      .update({
        lotteryCooldowns: {
          [lotteryType]: Date.now(),
        },
      })
      .run();
  }

  async getTickets(userID: string): Promise<number> {
    return this.r
      .table('users')
      .get(userID)('items')('lotteryticket')
      .default(0)
      .run();
  }

  async addLotteryWin(userID: string, coins: number): Promise<void> {
    const lotteryticket = (await this.getTickets(userID)) + 1;
    await this.r
      .table('users')
      .get(userID)
      .update({
        lotteryWins: this.r.row('lotteryWins').add(1),
        pocket: this.r.row('pocket').add(Number(coins)),
        items: {
          lotteryticket,
        },
      })
      .run();
  }

  async addWeeklyWin(userID: string, coins: number): Promise<void> {
    const lotteryticket = (await this.getTickets(userID)) + 1;
    await this.r
      .table('users')
      .get(userID)
      .update({
        lotteryWins: this.r.row('lotteryWins').add(1),
        items: {
          lotteryticket,
          coupon: 1,
        },
        upgrades: {
          coupon: coins,
        },
      })
      .run();
  }

  getLotteryWins(userID: string): Promise<number> {
    return this.r.table('users').get(userID)('lotteryWins').run();
  }

  async addPocket(id: Snowflake, amount: number): Promise<void> {
    await this.r
      .table('users')
      .get(id)
      .update({
        pocket: this.r.row('pocket').add(Number(amount)),
        won: this.r.row('won').add(Number(amount)),
      })
      .run();
  }

  async updateItemAmount(
    userID: Snowflake,
    itemID: string,
    amount = 1,
  ): Promise<any> {
    const { items } = await this.getUser(userID);
    items[itemID] = Math.max((items[itemID] || 0) + amount, 0);

    if (items[itemID] === 0) {
      delete items[itemID];
    }

    await this.r
      .table('users')
      .get(userID)
      .update({
        items: this.r.literal(items),
      })
      .run();
  }

  async getActiveGiveaways(): Promise<Giveaway[]> {
    const giveaways: Giveaway[] = await this.r
      .table('giveaways')
      .filter({ ended: false, forCron: true })
      .run();
    return giveaways;
  }

  async addGiveawayEntry(id: Snowflake, userID: Snowflake): Promise<void> {
    await this.r
      .table('giveaways')
      .get(id)
      .update({
        participants: this.r.row('participants').append(userID).distinct(),
      })
      .run();
  }

  async getParticipants(id: Snowflake): Promise<string[]> {
    const participants = await this.r
      .table('giveaways')
      .get(id)('participants')
      .default([])
      .run();
    return participants;
  }

  async addGiveaway(data: Giveaway): Promise<void> {
    await this.r.table('giveaways').insert(data).run();
  }

  async endGiveaway(id: Snowflake): Promise<void> {
    await this.r.table('giveaways').get(id).update({ ended: true }).run();
  }
}
