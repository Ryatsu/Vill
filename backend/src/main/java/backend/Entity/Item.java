package backend.Entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "items")
public class Item {

    @Id
    private String id;

    @NotBlank(message = "Item name is required")
    private String name;

    @Positive(message = "Price must be positive")
    private double price;

    @Positive(message = "Cost must be positive")
    private double cost;

    private Date dateBought;
    private Date dateRegistered;

    public Item() {}

    // Getters & Setters
    public String getId() { return id; }
    public String getName() { return name; }
    public double getPrice() { return price; }
    public double getCost() { return cost; }
    public Date getDateBought() { return dateBought; }
    public Date getDateRegistered() { return dateRegistered; }

    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setPrice(double price) { this.price = price; }
    public void setCost(double cost) { this.cost = cost; }
    public void setDateBought(Date dateBought) { this.dateBought = dateBought; }
    public void setDateRegistered(Date dateRegistered) { this.dateRegistered = dateRegistered; }
}