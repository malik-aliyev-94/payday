package bank.payday.accounts;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;

@Entity
public class Account {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;

	private int customer;

	private String name;

	@NotBlank(message = "Type is mandatory")
	@Pattern(regexp = "(credit)|(debit)", message="Only \"credit\" and \"debit\" values are acceptable as a type.")
	private String type;

	private int status;

	private long date_of_creation;

	private String accn;
	
	public Account(){}
    
	public Account(Account account) {
		this.name             = account.getName();
        this.customer         = account.getCustomer();
		this.type             = account.getType();
		this.date_of_creation = account.getDate_of_creation();
	}

    public Account(int customer, String name, String type) {
        this.name     = name;
        this.customer = customer;
		this.type     = type;
    }

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getCustomer() {
		return customer;
	}

	public void setCustomer(int customer) {
		this.customer = customer;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getAccn() {
		return accn;
	}

	public void setAccn(String accn) {
		this.accn = accn;
	}

	public void setDate_of_creation(long date_of_creation) {
        this.date_of_creation = date_of_creation;
    }

    public long getDate_of_creation() {
        return this.date_of_creation;
    }
	

	public List<String> validate() {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator      = factory.getValidator();
		Set<ConstraintViolation<Account>> errors = validator.validate(this);

		List<String> e = new ArrayList<>();
		
		for (ConstraintViolation<Account> constraintViolation : errors) {
			String message = constraintViolation.getMessage();
			e.add(message);
		}

		return e;
	}
}