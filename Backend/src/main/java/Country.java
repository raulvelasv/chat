import java.io.Serializable;

public class Country implements Serializable{
	private String code;
	private String name;

	
	//Constructors
	public Country(){
		
	}
	
	public Country(String code, String name) {
		this.code = code;
		this.name = name;
	}



	//Mètodes
	public static String getList() {
		ConnectionDB conBD = new ConnectionDB();
		conBD.connectar();
		String json = conBD.getCountry();
		conBD.close();
		return json;
	}
		
	
	//Getters and Setters
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
