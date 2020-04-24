import { getCustomRepository, getRepository } from 'typeorm';
// import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface TransactionInterface {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionInterface): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    if (
      type === 'outcome' &&
      (await transactionsRepository.getBalance()).total < value
    ) {
      throw new AppError('insuficienteValue!');
    } else {
      const categoryRepository = getRepository(Category);
      const findByCategory = await categoryRepository.findOne({
        where: { title: category },
      });
      let category_id;
      if (findByCategory) {
        category_id = findByCategory.id;
      } else {
        const categoryCreate = categoryRepository.create({
          title: category,
        });
        await categoryRepository.save(categoryCreate);
        category_id = categoryCreate.id;
      }
      const transation = transactionsRepository.create({
        title,
        value,
        type,
        category_id,
      });
      await transactionsRepository.save(transation);
      return transation;
    }
  }
}

export default CreateTransactionService;
