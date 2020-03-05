package bank.payday.accounts;

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
import java.time.Instant;

@RestController
@RequestMapping(path="/api/v1")
public class AccountController {
	@Autowired
	private AccountRepository accountRepository;

	@GetMapping(path="/accounts/customer/{customer}/type/{type}")
	public ResponseEntity<ApiResponse> getAllAccounts(@PathVariable("customer") int customer, @PathVariable("type") String type) {
		try {
			List<Account> accounts = new ArrayList<Account>();
			accountRepository.findByCustomerAndTypeAndStatus(customer, type, 1).forEach(accounts::add);

			if (accounts.isEmpty()) {
				ApiResponse response = new ApiResponse(accounts, null);
				response.addError("Empty list.");
				return new ResponseEntity<>(response, HttpStatus.OK);
			}

			return new ResponseEntity<>(new ApiResponse(accounts, null), HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>(new ApiResponse(null, null), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}

    @GetMapping("/accounts/{id}")
	public ResponseEntity<ApiResponse> getAccountById(@PathVariable("id") Integer id) {
		Optional<Account> accountData = accountRepository.findById(id);
		List<String> e = new ArrayList<>();

		if (accountData.isPresent()) {
			return new ResponseEntity<>(new ApiResponse(accountData.get(), null), HttpStatus.OK);
		} else {
			e.add("Not found error.");
			return new ResponseEntity<>(new ApiResponse(null, e), HttpStatus.NOT_FOUND);
		}
	}

	@PutMapping("/accounts/disable/{id}")
	public ResponseEntity<ApiResponse> disableAccountById(@PathVariable("id") Integer id, @RequestBody Account acc) {
		Optional<Account> accountData = accountRepository.findById(id);
		List<String> e = new ArrayList<>();

		if (accountData.isPresent() && accountData.get().getCustomer() == acc.getCustomer()) {
			Account account = accountData.get();
			account.setStatus(0);
			accountRepository.save(account);
			return new ResponseEntity<>(new ApiResponse(account, null), HttpStatus.OK);
		} else {
			e.add("Not found error.");
			return new ResponseEntity<>(new ApiResponse(null, e), HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/accounts")
    public ResponseEntity<ApiResponse> addNewAccount(@RequestBody Account account) {
		Account u = new Account(account);

		Instant instant = Instant.now();
		long timeStamp = instant.toEpochMilli();
		u.setDate_of_creation(timeStamp);
		u.setStatus(1);

		// Generate random account number
		// It must be checked for unique
		String ALPHA_NUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		StringBuilder builder = new StringBuilder();
		int count = 12;
		while (count-- != 0) {
			int character = (int)(Math.random()*ALPHA_NUMERIC_STRING.length());
			builder.append(ALPHA_NUMERIC_STRING.charAt(character));
		}
		String accn =  builder.toString();
		u.setAccn(accn);

		List<String> errors = u.validate();

		if (errors.isEmpty()) {

			accountRepository.save(u);
			return new ResponseEntity<>(new ApiResponse(u, null), HttpStatus.CREATED);
			
		} else {
			return new ResponseEntity<>(new ApiResponse(null, errors), HttpStatus.OK);
		}
    }

}