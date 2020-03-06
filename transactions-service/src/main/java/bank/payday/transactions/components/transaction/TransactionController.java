package bank.payday.transactions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.Instant;
import javax.validation.Valid;

@RestController
@RequestMapping(path="/api/v1")
public class TransactionController {
	@Autowired
	private TransactionRepository TransactionRepository;

	@GetMapping(path="/transactions/account/{account}")
	public ResponseEntity<ApiResponse> getAllCustomerTransactions(@PathVariable("account") int account) {
		return new ResponseEntity<>(new ApiResponse(TransactionRepository.findByAccountOrderByDateOfTransactionDesc(account), null), HttpStatus.OK);
	}

	@GetMapping(path="/transactions/{id}")
	public ResponseEntity<ApiResponse> getTransaction(@PathVariable("id") String id) {
		return new ResponseEntity<>(new ApiResponse(TransactionRepository.findById(id), null), HttpStatus.OK);
	}

	@PostMapping("/transactions")
	public ResponseEntity<ApiResponse> createNewTransaction(@Valid @RequestBody Transaction transaction) {
		
		Instant instant = Instant.now();
		long timeStamp = instant.toEpochMilli();
		transaction.setDateOfTransaction(timeStamp);

		// int customer -> must be integer > 0
		// int account  ->  must be integer > 0
		// int amount -> must be numeric > 0 or < 0

		// Java validation goes here :)

		// !!! We will assume that posted data already validated.
		ApiResponse response = new ApiResponse(null, null);
		if (transaction.getCustomer() < 1) response.addError("Invalid customer id."); // here can be sent a request to customers service for validation else.
		if (transaction.getAccount() < 1)  response.addError("Invalid account id."); // here can be sent a request to customers and account services to validate that account belongs to given customer.
		if (transaction.getAmount() == 0)   response.addError("Invalid amount."); 


		if (response.getErrors() == null || response.getErrors().isEmpty()) {

			Transaction tr = TransactionRepository.save(new Transaction(transaction));
			return new ResponseEntity<>(new ApiResponse(tr, null), HttpStatus.OK);

		} else {
			return new ResponseEntity<>(response, HttpStatus.EXPECTATION_FAILED);
		}
	}


}