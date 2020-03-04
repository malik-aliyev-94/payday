package bank.payday.customers;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface CustomerRepository extends CrudRepository<Customer, Integer> {
    public Optional<Customer> findByEmailAndPassword(String email, String password);
    public Optional<Customer> findByPhoneAndPassword(String phone, String password);

    public Optional<Customer> findByEmail(String email);
    public Optional<Customer> findByPhone(String phone);

    public long countByEmailOrPhone(String email, String phone);
}