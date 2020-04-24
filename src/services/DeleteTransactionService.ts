import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = transactionsRepository.findOne({ where: { id } });
    if (transaction) {
      await transactionsRepository.delete({ id });
    } else {
      throw new AppError('transaction dont exists');
    }
  }
}

export default DeleteTransactionService;
