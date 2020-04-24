import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const { income, outcome } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += Number(transaction.value);
            break;
          case 'outcome':
            accumulator.outcome += Number(transaction.value);
            break;
          default:
            break;
        }
        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );
    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
/* const balance = transactions.reduce(
      (accumulator: Balance, currentValue: Transaction) => {
        if (currentValue.type === 'income') {
          accumulator.income += currentValue.value;
        } else {
          accumulator.outcome += currentValue.value;
        }
        accumulator.total = accumulator.income - accumulator.outcome;
        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );
    return balance; */
