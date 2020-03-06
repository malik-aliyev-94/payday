package bank.payday.customers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

import javax.validation.Valid;

@RestController
@RequestMapping(path="/api/v1")
public class CustomerController {
	@Autowired
	private CustomerRepository customerRepository;

	@GetMapping(path="/customers")
	public ResponseEntity<ApiResponse> getAllCustomers() {
		try {
			List<Customer> customers = new ArrayList<Customer>();
			customerRepository.findAll().forEach(customers::add);

			if (customers.isEmpty()) {
				ApiResponse response = new ApiResponse(customers, null);
				response.addError("Empty list.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			}

			return new ResponseEntity<>(new ApiResponse(customers, null), HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>(new ApiResponse(null, null), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}

    @GetMapping("/customers/{id}")
	public ResponseEntity<ApiResponse> getCustomerById(@PathVariable("id") Integer id) {
		Optional<Customer> customerData = customerRepository.findById(id);
		List<String> e = new ArrayList<>();

		if (customerData.isPresent()) {
			return new ResponseEntity<>(new ApiResponse(customerData.get(), null), HttpStatus.OK);
		} else {
			e.add("Not found error.");
			return new ResponseEntity<>(new ApiResponse(null, e), HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/customers/validate")
	public ResponseEntity<ApiResponse> validateCustomer(@RequestBody Customer customer) {
		
		ApiResponse response = new ApiResponse();
		
		String phone    = customer.getPhone();
		String email    = customer.getEmail();
		String password = customer.getPassword();

		if ((phone == null || email == null) && password == null) {
			response.addError("Please enter all required credentials.");
			return new ResponseEntity<>(response, HttpStatus.OK);
		}

		Optional<Customer> customerData;

		if ( phone != null) {
			customerData = customerRepository.findByPhone(phone);
		} else {
			customerData = customerRepository.findByEmail(email);
		}

		if (customerData.isPresent()) {

			if (customerData.get().validatePassword(password)) {
				customerData.get().setPassword(null);
				return new ResponseEntity<>(new ApiResponse(customerData.get(), null), HttpStatus.OK);
			} else {
				response.addError("Check login credentials.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			}

			
		} else {
			response.addError("Not found error.");
			return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
		}

		// return new ResponseEntity<>(new ApiResponse(null, null), HttpStatus.NOT_FOUND);	
	}

	@PostMapping("/customers")
    public ResponseEntity<ApiResponse> addNewCustomer(@RequestBody Customer customer) {
		Customer u = new Customer(customer);
		List<String> errors = u.validate();

		if (errors.isEmpty()) {

			// check email and phone to be unique
			long count = customerRepository.countByEmailOrPhone(u.getEmail(), u.getPhone());
			
			if ( count > 0 ) { // not unique
				errors.add("Customer exists.");
				return new ResponseEntity<>(new ApiResponse(null, errors), HttpStatus.OK);
			} else {
				u.encPassword();
				customerRepository.save(u);
				return new ResponseEntity<>(new ApiResponse(u, null), HttpStatus.CREATED);
			}
			
		} else {
			return new ResponseEntity<>(new ApiResponse(null, errors), HttpStatus.OK);
		}
    }

	@PutMapping("/customers/{id}")
    public ResponseEntity<ApiResponse> addNewCustomer(@RequestBody Customer customer, @PathVariable("id") Integer id) {
		Optional<Customer> customerData = customerRepository.findById(id);
		List<String> e = new ArrayList<>();

		if (customerData.isPresent()) {
			Customer _customer = customerData.get();

			// public Customer(String name, String last_name, String phone, String email, String gender, String date_of_birth, String password)
			if ( customer.getName() != null )          _customer.setName(customer.getName());
			if ( customer.getLast_name() != null )     _customer.setLast_name(customer.getLast_name());
			if ( customer.getPhone() != null )         _customer.setPhone(customer.getPhone());
			if ( customer.getEmail() != null )         _customer.setEmail(customer.getEmail());
			if ( customer.getGender() != null )        _customer.setGender(customer.getGender());
			if ( customer.getDate_of_birth() != null ) _customer.setDate_of_birth(customer.getDate_of_birth());
			if ( customer.getPassword() != null )      _customer.setPassword(customer.getPassword());

			List<String> errors = _customer.validate();
			
			if (errors.isEmpty()) {
				if ( customer.getPassword() != null ) _customer.encPassword();
				customerRepository.save(_customer);
				return new ResponseEntity<>(new ApiResponse(_customer, null), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(new ApiResponse(null, errors), HttpStatus.OK);
			}
		} else {
			e.add("Not found error.");
			return new ResponseEntity<>(new ApiResponse(null, e), HttpStatus.NOT_FOUND);
		}
    }

	@DeleteMapping("/customers/{id}")
	public ResponseEntity<HttpStatus> deleteCustomer(@PathVariable("id") Integer id) {
		try {
			customerRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
		}

	}

}