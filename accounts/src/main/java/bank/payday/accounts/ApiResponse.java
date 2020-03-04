package bank.payday.accounts;

import java.util.List;
import java.util.ArrayList;

public class ApiResponse {
    public Object data;
	public List<String> errors;

    public ApiResponse() {}

	public ApiResponse(Object data, List<String> errors){
		this.data = data;
		this.errors = errors;
	}

    public void addError(String error) {
        if (this.errors == null) this.errors = new ArrayList<>();
        this.errors.add(error);
    }

    public void setData(Object data) {
        this.data = data;
    } 

    public Object getData(Object data) {
        return this.data;
    } 
}
