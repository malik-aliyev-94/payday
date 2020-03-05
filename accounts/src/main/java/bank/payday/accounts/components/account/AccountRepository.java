package bank.payday.accounts;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;
import java.util.List;

public interface AccountRepository extends CrudRepository<Account, Integer> {

    // find debit accounts
    // find credit account
    // block account

    public List<Account> findByCustomerAndTypeAndStatus(int customer, String type, int status);

}