package backend.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "items")
public class Item {

	@Id
	private String id;
	private String name;
	private float price;
	private float cost;
	private Date dateBought;
	private Date dateRegistered;

	public Item() {}

	public Item(String id, String name, float price, float cost, Date dateBought, Date dateRegistered) {
		this.id = id;
		this.name = name;
		this.price = price;
		this.cost = cost;
		this.dateBought = dateBought;
		this.dateRegistered = dateRegistered;
	}

	public String getId() { return id; }
	public String getName() { return name; }
	public float getPrice() { return price; }
	public float getCost() { return cost; }
	public Date getDateBought() { return dateBought; }
	public Date getDateRegistered() { return dateRegistered; }

	public void setId(String id) { this.id = id; }
	public void setName(String name) { this.name = name; }
	public void setPrice(float price) { this.price = price; }
	public void setCost(float cost) { this.cost = cost; }
	public void setDateBought(Date dateBought) { this.dateBought = dateBought; }
	public void setDateRegistered(Date dateRegistered) { this.dateRegistered = dateRegistered; }

}
