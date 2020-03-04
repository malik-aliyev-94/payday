package bank.payday.transactions;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransactionRepository extends MongoRepository<Transaction, String> {

    public List<Transaction> findByCustomer(int customer);
    public List<Transaction> findByAccount(int acount);

}