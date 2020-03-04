package bank.payday.customers;

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

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Entity
public class Customer {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer id;

	@NotBlank(message = "Name is mandatory")
	@Pattern(regexp = "^[A-Za-z]+$", message="Name can contain only letters (no spaces).")
	private String name;

	@NotBlank(message = "Last name is mandatory")
	@Pattern(regexp = "^[A-Za-z]+$", message="Last name can contain only letters (no spaces).")
	private String last_name;

	@NotBlank(message = "Phone is mandatory")
	@Pattern(regexp = "^[0-9]{9,16}$", message="Phone can contain only numners (minimum 9 numbers).")
	private String phone;

	@NotBlank(message = "Email is mandatory")
	@Email(message = "Email should be valid")
	private String email;

	@NotBlank(message = "Gender is mandatory")
	@Pattern(regexp = "(man)|(woman)", message="Only \"man\" and \"woman\" values are acceptable as a gender.")
	private String gender;

	@NotBlank(message = "Date of birth is mandatory")
	@Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message="Date of birth must be valid (YYYY-MM-DD).")
	private String date_of_birth;
	
	@NotBlank(message = "Password is mandatory")
	@Pattern(regexp = "^[a-zA-Z0-9]{6,}$|^(\\$2a\\$10\\$)(.){53}$", message="Password must only alphanumeric characters. Minimum required length is 6.")
	private String password;

	public Customer(){}
    
	public Customer(Customer customer) {
		this.name          = customer.getName();
        this.last_name     = customer.getLast_name();
		this.phone         = customer.getPhone();
		this.email         = customer.getEmail();
		this.gender        = customer.getGender();
		this.date_of_birth = customer.getDate_of_birth();
		this.password      = customer.getPassword();
	}

    public Customer(String name, String last_name, String phone, String email, String gender, String date_of_birth, String password) {
        this.name          = name;
        this.last_name     = last_name;
		this.phone         = phone;
		this.email         = email;
		this.gender        = gender;
		this.date_of_birth = date_of_birth;
		this.password      = password;
    }

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLast_name() {
		return last_name;
	}

	public void setLast_name(String last_name) {
		this.last_name = last_name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getDate_of_birth() {
		return date_of_birth;
	}

	public void setDate_of_birth(String date_of_birth) {
		this.date_of_birth = date_of_birth;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String encrypt(String password) {
		BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
		String hashedPassword = passwordEncoder.encode(password);
		return hashedPassword;
	}

	public void encPassword() {
		this.password = encrypt(this.password);
	}

	public boolean validatePassword(String password) {
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		return encoder.matches(password, this.password);
	}

	public List<String> validate() {
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator      = factory.getValidator();
		Set<ConstraintViolation<Customer>> errors = validator.validate(this);

		List<String> e = new ArrayList<>();
		
		for (ConstraintViolation<Customer> constraintViolation : errors) {
			String message = constraintViolation.getMessage();
			e.add(message);
		}

		return e;
	}
}