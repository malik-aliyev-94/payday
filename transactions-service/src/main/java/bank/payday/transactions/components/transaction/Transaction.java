package bank.payday.transactions;

import org.springframework.data.mongodb.core.index.IndexDirection;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.annotation.Id;

@Document
public class Transaction {

    @Id
    private String id;

    // @Indexed(direction = IndexDirection.ASCENDING)
    private int customer;

    // @Indexed(direction = IndexDirection.ASCENDING)
    private int account;

    // @Indexed(direction = IndexDirection.ASCENDING)
    @Field("date_of_transaction")
    private long dateOfTransaction;

    private int amount;
    private String description;

    public Transaction() {}
    
    public Transaction(Transaction t) {
        this.customer            = t.getCustomer();
        this.account             = t.getAccount();
        this.dateOfTransaction   = t.getDateOfTransaction();
        this.amount              = t.getAmount();
        this.description         = t.getDescription();
    }

    public Transaction(int customer, int account, long dateOfTransaction, int amount, String description) {
        this.customer            = customer;
        this.account             = account;
        this.dateOfTransaction   = dateOfTransaction;
        this.amount              = amount;
        this.description         = description;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setCustomer(int customer) {
        this.customer = customer;
    }

    public int getCustomer() {
        return this.customer;
    }

    public void setAccount(int account) {
        this.account = account;
    }

    public int getAccount() {
        return this.account;
    }

    public void setDateOfTransaction(long dateOfTransaction) {
        this.dateOfTransaction = dateOfTransaction;
    }

    public long getDateOfTransaction() {
        return this.dateOfTransaction;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public int getAmount() {
        return this.amount;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return this.description;
    }

    @Override
    public String toString() {
        return "";
    }

}